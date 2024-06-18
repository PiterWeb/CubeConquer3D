import { Mesh } from "three";
import { renderBox } from "../box";

class Team {
    /** @type {{red: Mesh[], blue: Mesh[]}} */
    static #teams = {
        red: [],
        blue: [],
    };

    static #roleNumbers = {
        dps: 1,
        tank: 2,
        healer: 1,
    };

    /** Get a semi random spawn point for members of different teams */
    static getSpawnPoint(team) {
        return team === "red" ? { x: 0, y: 0, z: 0 } : { x: 0, y: 0, z: 0 };
    }

    /** Generate the teams */
    static generateTeams() {

        for(let role in this.#roleNumbers) {
            for(let i = 0; i < this.#roleNumbers[role]; i++) {

                const redBox = renderBox("red", role);

                this.#teams.red.push({ role });
                this.#teams.blue.push({ role });
            }
        }

        Team.#teams.red = [];
        Team.#teams.blue = [];
    }

    constructor() {}

    static get RED() {
        return Team.#teams.red;
    }

    static get BLUE() {
        return Team.#teams.blue;
    }
}
