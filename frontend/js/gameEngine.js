import { charFromIndex } from "./charUtils.js"

export class GameEngine {
    gameStates = {
        startMenu: "startMenu",
        placingBoats: "placingBoats",
        anchorPlaced: "anchorPlaced",
        pickBoatDirection: "pickBoatDirection",
        playerMove: "playerMove",
        computerMove: "computerMove"
    }
    tileStates = {
        placed: "placed",
        undefined: "undefined"

    }
    placedBoatStates = {
        unplaced: "unplaced",
        placed: "placed"
    }
    boats = [
        {
            name: "Carrier",
            length: 5,
            state: this.placedBoatStates.unplaced
        },
        {
            name: "Battleship",
            length: 4,
            state: this.placedBoatStates.unplaced
        },
        {
            name: "Cruiser",
            length: 3,
            state: this.placedBoatStates.unplaced
        },
        {
            name: "Submarine",
            length: 3,
            state: this.placedBoatStates.unplaced
        },
        {
            name: "Destroyer",
            length: 2,
            state: this.placedBoatStates.unplaced
        }
    ]


    gameState = this.gameStates.startMenu
    allBoardTiles = document.querySelectorAll('.js-board-tile');
    board = document.querySelector('.js-board');
    startMenu = document.querySelector('.js-start-menu');
    endGameButtonElement = document.getElementById('end-game-btn');
    startGameBtnElement = document.getElementById('start-game-btn');

    // Current Anchor
    currentAnchor;
    maxPlacedBoatLength = 4;
    boardElement = document.querySelector('.js-board');
    boardWidth = 10;
    boardHeight = 10;
    boardTiles;
    constructor() {
        this.initializeMenuButtons();
        this.initializeBoard()
        document.addEventListener('mousemove', (e) => {
            this.handleMouseMovement(e);

        });
    }
    getQuadrant45(x, y) {
        let angle = Math.atan2(y, x) * (180 / Math.PI); // -180 to 180 degrees
        angle = (angle + 360 - 45) % 360;               // Shift by 45° and normalize
        return Math.floor(angle / 90);              // Returns quadrant 1 to 4
    }
    handleMouseMovement(e) {
        let gridGap = 10; //px
        if (this.gameState === this.gameStates.anchorPlaced) {
            // console.log(`X:${e.screenX},Y:${e.screenY},tileX:${this.currentAnchor.x_coord},tileY:${this.currentAnchor.y_coord}`);
            let anchorButton = document.querySelector(`.board-tile-${this.currentAnchor.rowIndex}${this.currentAnchor.columnIndex}`)
            let x_length = Math.round(Math.abs(e.clientX - this.currentAnchor.x_coord) / (anchorButton.offsetWidth + gridGap));
            let y_length = Math.round(Math.abs(e.clientY - this.currentAnchor.y_coord) / (anchorButton.offsetHeight + gridGap));
            let mouseQuadrant = this.getQuadrant45(e.screenX - this.currentAnchor.x_coord, e.screenY - this.currentAnchor.y_coord);
            this.highlightBoatDirection(mouseQuadrant, x_length, y_length);
        }
    }
    placeBoat(boardTile) {
        // update boats status
        let boatLength = boardTile.dataset.rowIndex - this.currentAnchor.rowIndex;
        for (let boat of this.boats) {
            if (boatLength + 1 === boat.length && this.placedBoatStates.unplaced) {
                boat.state = this.placedBoatStates.placed;
                console.log(boat);
                // update html dataset
                break;
            }
        }
    }
    highlightBoatDirection(mouseQuadrant, x_length, y_length) {
        // console.log(`mouseQuadrant:${mouseQuadrant}, x_length:${x_length}, y_length:${y_length}, rowIndex:${this.currentAnchor.rowIndex}, columnIndex:${this.currentAnchor.columnIndex}`);
        //Update all tiles in that direction 
        x_length = Math.min(this.maxPlacedBoatLength, x_length)
        y_length = Math.min(this.maxPlacedBoatLength, y_length)


        this.allBoardTiles = document.querySelectorAll('.js-board-tile');
        this.allBoardTiles.forEach((boardTile) => {
            let tileRowIndex = Number(boardTile.dataset.rowIndex);
            let tileColumnIndex = Number(boardTile.dataset.columnIndex);
            let anchorRowIndex = this.currentAnchor.rowIndex;
            let anchorColumnIndex = this.currentAnchor.columnIndex;
            if (mouseQuadrant === 0) {
                if (
                    tileRowIndex - y_length <= anchorRowIndex && anchorRowIndex <= tileRowIndex &&
                    anchorColumnIndex === tileColumnIndex
                ) {
                    this.setTileState(boardTile, this.tileStates.placed);
                } else {
                    this.setTileState(boardTile, this.tileStates.undefined);
                }
            }
            if (mouseQuadrant === 1) {
                if (anchorRowIndex === tileRowIndex &&
                    tileColumnIndex <= anchorColumnIndex && anchorColumnIndex <= tileColumnIndex + x_length
                ) {
                    this.setTileState(boardTile, this.tileStates.placed);
                } else {
                    this.setTileState(boardTile, this.tileStates.undefined);
                }
            }
            if (mouseQuadrant === 2) {
                if (tileRowIndex <= anchorRowIndex && anchorRowIndex <= tileRowIndex + y_length &&
                    anchorColumnIndex === tileColumnIndex
                ) {
                    this.setTileState(boardTile, this.tileStates.placed);
                } else {
                    this.setTileState(boardTile, this.tileStates.undefined);
                }
            }
            if (mouseQuadrant === 3) {
                if (anchorRowIndex === tileRowIndex &&
                    tileColumnIndex - x_length <= anchorColumnIndex && anchorColumnIndex <= tileColumnIndex
                ) {
                    this.setTileState(boardTile, this.tileStates.placed);
                } else {
                    this.setTileState(boardTile, this.tileStates.undefined);
                }
            }
        });
    }
    updateGameState(newGameState) {
        // From Start Menu
        if (this.gameStates.startMenu === this.gameState) {
            if (this.gameStates.placingBoats === newGameState) {
                this.gameState = newGameState;
                this.startGame();
            }
        }
        // From placingBoats
        if (this.gameStates.placingBoats === this.gameState) {
            //to anchor placed
            if (this.gameStates.anchorPlaced === newGameState) {
                this.gameState = newGameState;
                // this.startGame();
            }
        }
        // From anchorPlaced 
        if (this.gameStates.anchorPlaced === this.gameState) {
            if (this.gameStates.placingBoats === newGameState) {

            }

        }
        // if Going to menu. NO further conditoins
        if (this.gameStates.startMenu === newGameState) {
            this.gameState = newGameState;
            this.endGame();
        }
    }
    initializeMenuButtons() {
        this.startGameBtnElement.addEventListener('click', () => {
            this.updateGameState(this.gameStates.placingBoats)

        });
        this.endGameButtonElement.addEventListener('click', () => {
            this.updateGameState(this.gameStates.startMenu)
        });
    }
    startGame() {
        console.log("Started Game!");
        this.startMenu.style.display = "none";
        this.endGameButtonElement.style.display = "flex";
        this.board.style.display = "grid";
    }
    endGame() {
        console.log("End Game.");
        this.startMenu.style.display = "flex";
        this.endGameButtonElement.style.display = "none";
        this.board.style.display = "none";
    }
    handleBoardClick(boardTile) {
        // console.log(this.gameState)
        if (this.gameState === this.gameStates.placingBoats) {
            this.updateGameState(this.gameStates.anchorPlaced);
            this.placeAnchor(boardTile);
            this.setTileState(boardTile, this.tileStates.placed);
        }
        else if (this.gameState === this.gameStates.anchorPlaced) {
            this.placeBoat(boardTile);
            this.updateGameState(this.gameStates.placingBoats);
        }
        // console.log(boardTile.dataset);
        // console.log(boardTile.dataset.rowIndex);
        // console.log(boardTile.dataset.columnIndex);
    }
    setTileState(boardTile, tileState) {
        if (tileState === this.tileStates.undefined) {
            boardTile.style.borderColor = "initial";
            boardTile.style.backgroundColor = "rgb(50, 50, 50)";
            boardTile.style.color = "bisque";
        }
        else if (tileState === this.tileStates.placed) {
            boardTile.style.borderColor = "orange";
            boardTile.style.backgroundColor = "orange";
            boardTile.style.color = "black";
        }
    }
    placeAnchor(boardTile) {
        this.currentAnchor = {
            rowIndex: Number(boardTile.dataset.rowIndex),
            columnIndex: Number(boardTile.dataset.columnIndex),
            x_coord: boardTile.getBoundingClientRect().left + boardTile.offsetWidth / 2,
            y_coord: boardTile.getBoundingClientRect().top + boardTile.offsetHeight / 2,
        };
        // console.log(this.currentAnchor)
        this.setTileState(boardTile, this.tileStates.placed);
    }
    initializeBoard() {
        this.renderBoard()
        this.initializeBoardTiles();
    }
    initializeBoardTiles() {
        this.boardTiles = document.querySelectorAll('.js-board-tile');
        this.boardTiles.forEach((boardTile) => {
            boardTile.addEventListener('click', () => this.handleBoardClick(boardTile));
        });
    }
    renderBoard() {
        let htmlString = '';
        for (let i = 0; i < this.boardWidth; i++) {
            for (let j = 0; j < this.boardHeight; j++) {
                htmlString += `<button
                class = "board-tile-${i}${j} js-board-tile"
                data-row-index=${i}
                data-column-index=${j}
                data-player-tile-state="none"
                data-computer-tile-state="none"
                >
                    ${i}${j}
                </button>`
            }
        }
        // ${charFromIndex(i)}${j}
        // console.log(x)
        this.boardElement.innerHTML = htmlString;
    }
}