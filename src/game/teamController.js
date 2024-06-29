import { Mesh } from "three";
import { renderPlayerBox } from "../entities/player/player";
import { xOrigin, yOrigin, zOrigin } from "../map/map";

/** @typedef {'red' | 'blue'} teamType */
/** @import role from  "../entities/player/role" */

export default class TeamController {
    /** @type {{red: Mesh[], blue: Mesh[]}} */
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
            ? { x: xOrigin, y: yOrigin, z: zOrigin }
            : { x: xOrigin - 4, y: yOrigin, z: zOrigin - 4 };
    }

    /** Generate the teams */
    generateTeams() {

        const roles = /** @type {Array<role>} */ (Object.keys(this.#roleNumbers));

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
