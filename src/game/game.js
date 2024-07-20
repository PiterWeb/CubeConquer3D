
import TurnController from './turnController.js';
import TeamController from './teamController.js';

export default class Game {

    /** @type {TurnController} */
    static turnController;
    /** @type {TeamController} */
    static teamController;

    static #isStarted = false;

    constructor(){}

    static get isStarted() {
        return this.#isStarted;
    }

    static start(){

        this.turnController = new TurnController();
        this.teamController = new TeamController();

        this.teamController.generateTeams();
        this.turnController.nextRound();

        this.#isStarted = true;

        this.gameloop();
    }

    static async gameloop() {

        this.turnController.nextTurn('red');

        const redPlayers = this.teamController.RED;

        for (let redPlayer of redPlayers) {
            await redPlayer.controll().catch(console.error);
        }

        this.turnController.nextTurn('blue');

        const bluePlayers = this.teamController.BLUE;

        for (let bluePlayer of bluePlayers) {
            await bluePlayer.controll().catch(console.error);
        }

        this.turnController.nextRound();

        this.gameloop();

    }

}