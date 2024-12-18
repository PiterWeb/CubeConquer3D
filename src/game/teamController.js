import { Player, renderPlayerBox } from "../entities/player/player";
import { xOrigin, yOrigin, zOrigin } from "../map/map";

/** @typedef {'red' | 'blue'} teamType */
/** @import {color as Role} from  "../entities/player/color" */

export default class TeamController {
    /** @type {{red: Player[], blue: Player[]}} */
    #teams = {
        red: [],
        blue: [],
    };

    #colorNumbers = {
        gray: 1,
        orange: 1,
        green: 1,
    };

    /** Get a semi random spawn point for members of different teams */
    /** @param {teamType} team */
    #getSpawnPoint(team) {
        return team === "red"
            ? { x: xOrigin + 6, y: yOrigin, z: zOrigin + 6 }
            : { x: xOrigin - 6, y: yOrigin, z: zOrigin - 6 };
    }

    /** Generate the teams */
    generateTeams() {

        const colors = /** @type {Array<Role>} */ (Object.keys(this.#colorNumbers));

        for (const color of colors) {
            const redSpawn = this.#getSpawnPoint("red");
            const blueSpawn = this.#getSpawnPoint("blue");

            const redBox = renderPlayerBox("red", color, redSpawn);
            const blueBox = renderPlayerBox("blue", color, blueSpawn);

            this.#teams.red.push(redBox);
            this.#teams.blue.push(blueBox);
        }
    }

    constructor() {}

    get RED() {
        return this.#teams.red;
    }

    get BLUE() {
        return this.#teams.blue;
    }
}
