import { GameBoard } from "./GameBoard.js"
export class GameEngine {
    gameStates = {
        "placingBoats": 0
    };
    gameState = this.gameStates[0]

    constructor() {
        let board = new GameBoard();
        this.initializeMenuButtons();
    }

    initializeMenuButtons() {
        let startGameBtnElement = document.getElementById('start-game-btn');
        startGameBtnElement.addEventListener('click', () => this.startGame());
    }
    placeBoatAnchor(x, y) {

    }
    startGame() {
        console.log("Started Game!");
    }

}