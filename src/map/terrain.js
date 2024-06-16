import { scene } from "../setup";
import { xOrigin, zOrigin, yOrigin } from "./map";
import {
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    EdgesGeometry,
    LineBasicMaterial,
    LineSegments,
} from "three";

// Expose the perlin noise function to the global scope
import "./perlin_noise.js";

export default class Terrain {
    #size;

    constructor(size) {
        this.#size = size;
    }

    /**
     * @param {number} seed
     * **/
    render(seed = Math.random()) {
        noise.seed(seed);

        for (let i = 0; i < this.#size; i++) {
            for (let j = 0; j < this.#size; j++) {
                const geometry = new BoxGeometry(1, 1, 1);
                const material = new MeshBasicMaterial({ color: "white" });
                const cube = new Mesh(geometry, material);

                const x = xOrigin + Math.floor(this.#size / 2) - i;
                const z = zOrigin + Math.floor(this.#size / 2) - j;

                cube.position.x = x;
                cube.position.z = z;

                const y = yOrigin + Terrain.randomY(i, j);
                cube.position.y = y;

                // Generate Cubes below the current cube
                for (let k = y; k >= 1; k--) {
                    const geometry = new BoxGeometry(1, 1, 1);
                    const material = new MeshBasicMaterial({ color: "white" });
                    const cube = new Mesh(geometry, material);

                    cube.position.x = x;
                    cube.position.y = yOrigin + y - k;
                    cube.position.z = z;

                    scene.add(cube);
                }

                const edges = new EdgesGeometry(geometry);
                const line = new LineBasicMaterial({ color: "black" });
                const edgesCube = new LineSegments(edges, line);

                cube.add(edgesCube);

                scene.add(cube);
            }
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     *  **/
    static randomY(x, y) {
        console.log(noise.perlin2(x / 10, y / 10));

        return Math.round(Math.abs(noise.perlin2(x / 10, y / 10) * 8) - 1);
    }
}
