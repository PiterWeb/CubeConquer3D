import { GridHelper } from "three";
import { scene } from "../setup";
import { xOrigin, zOrigin, yOrigin } from "./map";

export default class Grid {
    #size = 0;

    constructor(size) {
        this.#size = size;
    }

    render() {
        const grid = new GridHelper(this.#size, this.#size, 0x000000, 0x000000);

        grid.material.linewidth = 3;
        grid.material.opacity = 0.5;

        grid.position.x = xOrigin;
        grid.position.z = zOrigin;
        grid.position.y = yOrigin - 0.5;

        scene.add(grid);
    }
}
