import { charFromIndex } from "./charUtils.js"
export class GameBoard {
    boardElement = document.querySelector('.js-board');
    boardWidth = 10;
    boardHeight = 10;
    boardTiles;

    constructor() {
        console.log("constructorGameBoard");
        this.initializeBoard()
    }
    initializeBoard() {
        this.renderBoard()
        this.initializeBoardTiles();
    }
    initializeBoardTiles() {
        this.boardTiles = document.querySelectorAll('.js-board-tile');
        this.boardTiles.forEach(function (boardTile) {
            boardTile.addEventListener('click', () => console.log(this));
        });
    }
    printoutexample = (teststring) => {
        console.log(teststring);
    }
    handleBoardClick(boardTile) {
        // console.log(boardTile.dataset);
        console.log("hellothere");
    }
    renderBoard() {
        let htmlString = '';
        for (let i = 0; i < this.boardWidth; i++) {
            for (let j = 0; j < this.boardHeight; j++) {
                htmlString += `<button
                class = "board-tile-${i}${j} js-board-tile"
                data-row-index=${i}
                data-column-index=${j}
                disabled>
                    ${charFromIndex(i)}${j}
                </button>`
            }
        }
        // console.log(x)
        this.boardElement.innerHTML = htmlString;
    }

}