
import TurnController from './turnController.js';
import TeamController from './teamController.js';
import { controllPlayer } from '../entities/player/player.js';

export default class Game {

    /** @type {TurnController} */
    #turnController;
    /** @type {TeamController} */
    #teamController;

    constructor(){
        this.#turnController = new TurnController();
        this.#teamController = new TeamController();
    }

    start(){
        this.#teamController.generateTeams();
        this.#turnController.nextRound();
        this.gameloop();
    }

    async gameloop() {

        this.#turnController.nextTurn('red');

        const redPlayers = this.#teamController.RED;

        for (let redPlayer of redPlayers) {
            await controllPlayer(redPlayer).catch(console.error);
        }

        this.#turnController.nextTurn('blue');

        const bluePlayers = this.#teamController.BLUE;

        for (let bluePlayer of bluePlayers) {
            await controllPlayer(bluePlayer).catch(console.error);
        }

        this.#turnController.nextRound();

        this.gameloop();

    }

}