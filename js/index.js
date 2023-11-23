class TicTacToe {
    constructor(gridSize, winningLength) {
        this.gridSize = gridSize;
        this.winningLength = winningLength;
        this.cells = [];
        this.currentPlayer = "X";
        this.gameActive = true;
        this.board = Array(gridSize * gridSize).fill(null);

        this.startBtn = document.getElementById("start-btn");
        this.turn = document.getElementById("turn");
        this.activeScale = document.getElementById("active-scale");

        this.initializeGame();
    }

    initializeGame() {
        document.documentElement.style.setProperty('--grid-size', this.gridSize);

        const container = document.getElementById("game-container");
        
        container.innerHTML = '';
        this.activeScale.innerHTML = `Active scale: ${this.gridSize} x ${this.gridSize} | Winning condition: ${this.winningLength}`;
        this.startBtn.style.display = 'none';
        this.turn.style.display = 'block';
        this.turn.innerHTML = `Turn: Player ${this.currentPlayer}`;
        this.turn.style.fontWeight = 'normal';

        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute("data-index", i);
            container.appendChild(cell);
            this.cells.push(cell);
        }

        this.cells.forEach(cell => {
            cell.textContent = "";
            cell.style.backgroundColor = "#f0f0f0";
            cell.addEventListener("click", () => this.handleCellClick(cell));
        });
    }

    handleCellClick(cell) {
        const index = cell.getAttribute("data-index");

        if (this.board[index] || !this.gameActive) return;

        this.board[index] = this.currentPlayer;
        cell.textContent = this.currentPlayer;

        const winMessage = `🎉Congratulations Player ${this.currentPlayer} Wins!🎉`;
        const drawMessage = "It's a draw!";

        if (this.checkForWinner()) {
            this.turn.style.fontWeight = 'bold';
            this.turn.innerHTML = winMessage
            this.showRestartButton();
            setTimeout(() => {
                alert(winMessage);
                this.gameActive = false;
            }, 100);
        } else if (this.checkForTie()) {
            this.turn.innerHTML = drawMessage;
            this.showRestartButton();
            setTimeout(()=>{
                alert(drawMessage);
                this.gameActive = false;
            }, 100)
        } else {
            this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
            this.turn.innerHTML = `Turn: Player ${this.currentPlayer}`
        }
    }

    showRestartButton() {
        this.startBtn.innerText = 'Restart Game';
        this.startBtn.style.display = 'inline-block';
    }

    checkForWinner() {
        const winPatterns = this.generateWinPatterns();

        for (const pattern of winPatterns) {
            const winnerCells = this.checkPatternForWinner(pattern);
            if (winnerCells) {
                this.highlightWinningCells(winnerCells);
                return true;
            }
        }

        return false;
    }

    checkPatternForWinner(pattern) {
        for (let i = 0; i <= pattern.length - this.winningLength; i++) {
            const subPattern = pattern.slice(i, i + this.winningLength);
            const marks = subPattern.map(index => this.board[index]);
            if (marks.every(mark => mark === this.currentPlayer)) {
                return subPattern;
            }
        }
        return null;
    }

    checkForTie() {
        return this.board.every(cell => cell !== null);
    }

    generateWinPatterns() {
        const winPatterns = [];

        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j <= this.gridSize - this.winningLength; j++) {
                const row = [];
                for (let k = 0; k < this.winningLength; k++) {
                    row.push(i * this.gridSize + j + k);
                }
                winPatterns.push(row);
            }
        }

        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j <= this.gridSize - this.winningLength; j++) {
                const col = [];
                for (let k = 0; k < this.winningLength; k++) {
                    col.push((j + k) * this.gridSize + i);
                }
                winPatterns.push(col);
            }
        }

        for (let i = 0; i <= this.gridSize - this.winningLength; i++) {
            for (let j = 0; j <= this.gridSize - this.winningLength; j++) {
                const diagonal1 = [];
                const diagonal2 = [];
                for (let k = 0; k < this.winningLength; k++) {
                    diagonal1.push((i + k) * this.gridSize + (j + k));
                    diagonal2.push((i + k) * this.gridSize + (j + this.winningLength - 1 - k));
                }
                winPatterns.push(diagonal1, diagonal2);
            }
        }

        return winPatterns;
    }


    highlightWinningCells(pattern) {
        pattern.forEach(index => {
            this.cells[index].style.backgroundColor = "lightgreen";
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let gridSizeInput = document.getElementById("grid-size");
    let winningLengthInput = document.getElementById("winning-length");
    let startBtn = document.getElementById("start-btn");
    let gridSize = parseInt(gridSizeInput.value);
    let winningLength = parseInt(winningLengthInput.value);
    let game;

    window.startGame = function () {
        gridSize = parseInt(gridSizeInput.value);
        winningLength = parseInt(winningLengthInput.value);
        game = new TicTacToe(gridSize, winningLength);
    };

    window.resetGame = function () {
        if (game) {
            game.initializeGame();
        }
    };

    window.updateGridSize = function () {
        gridSize = parseInt(gridSizeInput.value);
        winningLength = parseInt(winningLengthInput.value);
        if(winningLength > gridSize){
            winningLengthInput.value = gridSize
        }
        startBtn.style.display = 'inline-block';
    };
});
