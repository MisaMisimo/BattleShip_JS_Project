import { charFromIndex } from "./charUtils.js"
export class GameBoard {
    boardElement = document.querySelector('.js-board');
    boardWidth = 10;
    boardHeight = 10;


    constructor() {
        console.log("constructorGameBoard");
    }

    renderBoard() {
        let htmlString = '';
        for (let i = 1; i <= this.boardWidth; i++) {
            for (let j = 1; j <= this.boardHeight; j++) {
                htmlString += `<button data-row-index=${i} data-column-index=${j}>${charFromIndex(i)}${j}</button>`
            }
        }
        // console.log(x)
        this.boardElement.innerHTML = htmlString;
    }

}