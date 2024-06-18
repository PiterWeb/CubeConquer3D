import teamType from "./player/team.js";

class Turns {
    #round = 0;

    /** @type {Map<teamType, int>} */
    #turns = {
        red: 0,
        blue: 0,
    };

    constructor() {}

    get round() {
        return this.#round;
    }

    get turns() {
        return this.#turns;
    }

    nextRound() {
        this.#round++;
    }

    /** @param {teamType} team */
    nextTurn(team) {
        this.#turns[team]++;
    }
}
