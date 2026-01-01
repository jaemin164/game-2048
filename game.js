class Game2048 {
    constructor() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.bestScore = localStorage.getItem('bestScore') || 0;
        this.gameBoard = document.getElementById('game-board');
        this.scoreElement = document.getElementById('score');
        this.bestScoreElement = document.getElementById('best-score');
        this.gameOverElement = document.getElementById('game-over');
        this.finalScoreElement = document.getElementById('final-score');

        this.init();
    }

    init() {
        this.bestScoreElement.textContent = this.bestScore;
        this.createBoard();
        this.addRandomTile();
        this.addRandomTile();
        this.render();
        this.setupEventListeners();
    }

    createBoard() {
        this.gameBoard.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            this.gameBoard.appendChild(tile);
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                this.handleMove(e.key);
            }
        });

        document.getElementById('new-game').addEventListener('click', () => {
            this.resetGame();
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            this.resetGame();
            this.gameOverElement.classList.add('hidden');
        });
    }

    addRandomTile() {
        const emptyCells = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.grid[r][c] === 0) {
                    emptyCells.push({ r, c });
                }
            }
        }

        if (emptyCells.length > 0) {
            const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    handleMove(direction) {
        let moved = false;
        const oldGrid = JSON.stringify(this.grid);

        switch (direction) {
            case 'ArrowUp':
                moved = this.moveUp();
                break;
            case 'ArrowDown':
                moved = this.moveDown();
                break;
            case 'ArrowLeft':
                moved = this.moveLeft();
                break;
            case 'ArrowRight':
                moved = this.moveRight();
                break;
        }

        if (moved && oldGrid !== JSON.stringify(this.grid)) {
            this.addRandomTile();
            this.render();

            if (this.isGameOver()) {
                setTimeout(() => {
                    this.showGameOver();
                }, 300);
            }
        }
    }

    moveLeft() {
        let moved = false;
        for (let r = 0; r < 4; r++) {
            const row = this.grid[r].filter(val => val !== 0);
            const merged = [];

            for (let i = 0; i < row.length; i++) {
                if (i < row.length - 1 && row[i] === row[i + 1]) {
                    merged.push(row[i] * 2);
                    this.score += row[i] * 2;
                    i++;
                } else {
                    merged.push(row[i]);
                }
            }

            while (merged.length < 4) {
                merged.push(0);
            }

            if (JSON.stringify(this.grid[r]) !== JSON.stringify(merged)) {
                moved = true;
            }
            this.grid[r] = merged;
        }
        return moved;
    }

    moveRight() {
        let moved = false;
        for (let r = 0; r < 4; r++) {
            const row = this.grid[r].filter(val => val !== 0).reverse();
            const merged = [];

            for (let i = 0; i < row.length; i++) {
                if (i < row.length - 1 && row[i] === row[i + 1]) {
                    merged.push(row[i] * 2);
                    this.score += row[i] * 2;
                    i++;
                } else {
                    merged.push(row[i]);
                }
            }

            while (merged.length < 4) {
                merged.push(0);
            }

            const result = merged.reverse();
            if (JSON.stringify(this.grid[r]) !== JSON.stringify(result)) {
                moved = true;
            }
            this.grid[r] = result;
        }
        return moved;
    }

    moveUp() {
        let moved = false;
        for (let c = 0; c < 4; c++) {
            const column = [];
            for (let r = 0; r < 4; r++) {
                if (this.grid[r][c] !== 0) {
                    column.push(this.grid[r][c]);
                }
            }

            const merged = [];
            for (let i = 0; i < column.length; i++) {
                if (i < column.length - 1 && column[i] === column[i + 1]) {
                    merged.push(column[i] * 2);
                    this.score += column[i] * 2;
                    i++;
                } else {
                    merged.push(column[i]);
                }
            }

            while (merged.length < 4) {
                merged.push(0);
            }

            for (let r = 0; r < 4; r++) {
                if (this.grid[r][c] !== merged[r]) {
                    moved = true;
                }
                this.grid[r][c] = merged[r];
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let c = 0; c < 4; c++) {
            const column = [];
            for (let r = 3; r >= 0; r--) {
                if (this.grid[r][c] !== 0) {
                    column.push(this.grid[r][c]);
                }
            }

            const merged = [];
            for (let i = 0; i < column.length; i++) {
                if (i < column.length - 1 && column[i] === column[i + 1]) {
                    merged.push(column[i] * 2);
                    this.score += column[i] * 2;
                    i++;
                } else {
                    merged.push(column[i]);
                }
            }

            while (merged.length < 4) {
                merged.push(0);
            }

            for (let r = 0; r < 4; r++) {
                if (this.grid[3 - r][c] !== merged[r]) {
                    moved = true;
                }
                this.grid[3 - r][c] = merged[r];
            }
        }
        return moved;
    }

    isGameOver() {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.grid[r][c] === 0) return false;
                if (c < 3 && this.grid[r][c] === this.grid[r][c + 1]) return false;
                if (r < 3 && this.grid[r][c] === this.grid[r + 1][c]) return false;
            }
        }
        return true;
    }

    showGameOver() {
        this.finalScoreElement.textContent = this.score;
        this.gameOverElement.classList.remove('hidden');

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
            this.bestScoreElement.textContent = this.bestScore;
        }
    }

    render() {
        const tiles = this.gameBoard.querySelectorAll('.tile');
        let index = 0;

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const value = this.grid[r][c];
                const tile = tiles[index];

                if (value === 0) {
                    tile.textContent = '';
                    tile.removeAttribute('data-value');
                } else {
                    tile.textContent = value;
                    tile.setAttribute('data-value', value);
                }

                index++;
            }
        }

        this.scoreElement.textContent = this.score;
    }

    resetGame() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.addRandomTile();
        this.addRandomTile();
        this.render();
    }
}

let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new Game2048();
});
