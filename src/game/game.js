import TurnController from "./turnController.js";
import TeamController from "./teamController.js";
import Terrain from "../map/terrain.js";

export default class Game {
    /** @type {TurnController} */
    static turnController;
    /** @type {TeamController} */
    static teamController;

    static #isStarted = false;

    constructor() {}

    static get isStarted() {
        return this.#isStarted;
    }

    static start() {
        this.turnController = new TurnController();
        this.teamController = new TeamController();

        this.teamController.generateTeams();
        this.turnController.nextRound();

        this.#isStarted = true;

        this.generateMapObjects();

        // Introduced delay to allow the animation of player spawn to finish
        setTimeout(() => {
            this.gameloop();
        }, 1000);
    }

    static async gameloop() {
        this.turnController.nextTurn("red");

        const redPlayers = this.teamController.RED;

        for (let redPlayer of redPlayers) {
            await redPlayer.controll().catch(console.error);
        }

        this.turnController.nextTurn("blue");

        const bluePlayers = this.teamController.BLUE;

        for (let bluePlayer of bluePlayers) {
            await bluePlayer.controll().catch(console.error);
        }

        this.turnController.nextRound();

        this.gameloop();
    }

    static async generateMapObjects() {
        const mapPositions = Terrain.getMap();

        const peakRows = mapPositions.map((row, rowIndex) => {

            const maxValueRow = Math.max(...row);

            const peakIndexPositions = row.findIndex((value) => value === maxValueRow);

            return {
                rowIndex,
                colIndex:peakIndexPositions,
                value: maxValueRow
            }

        })

        const peaks = peakRows.filter((rowPeak, i, arr) => {

            const nextRowPeak = arr[i + 1] ?? { rowIndex: 0, colIndex: 0, value: 0 };
            const lastRowPeak = arr[i - 1] ?? { rowIndex: 0, colIndex: 0, value: 0 };

            if (Math.abs(nextRowPeak.colIndex - rowPeak.colIndex) < 3) return false
            if (Math.abs(lastRowPeak.colIndex - rowPeak.colIndex) < 3) return false

            if (Math.abs(nextRowPeak.rowIndex - rowPeak.rowIndex) < 3) return false
            if (Math.abs(lastRowPeak.rowIndex - rowPeak.rowIndex) < 3) return false

            return true

        })

        console.log(peaks)


    }
}
