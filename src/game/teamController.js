import { Player, renderPlayerBox } from "../entities/player/player";
import { xOrigin, yOrigin, zOrigin } from "../map/map";

/** @typedef {'red' | 'blue'} teamType */
/** @import {role as Role} from  "../entities/player/role" */

export default class TeamController {
    /** @type {{red: Player[], blue: Player[]}} */
    #teams = {
        red: [],
        blue: [],
    };

    #roleNumbers = {
        dps: 1,
        tank: 1,
        healer: 1,
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

        const roles = /** @type {Array<Role>} */ (Object.keys(this.#roleNumbers));

        for (const role of roles) {
            const redSpawn = this.#getSpawnPoint("red");
            const blueSpawn = this.#getSpawnPoint("blue");

            const redBox = renderPlayerBox("red", role, redSpawn);
            const blueBox = renderPlayerBox("blue", role, blueSpawn);

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
