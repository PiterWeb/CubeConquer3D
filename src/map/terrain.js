import { scene } from "../setup";
import { xOrigin, zOrigin, yOrigin } from "./map";
import {
    BoxGeometry,
    MeshPhongMaterial,
    Mesh,
    EdgesGeometry,
    LineBasicMaterial,
    LineSegments,
} from "three";

// Expose the perlin noise function to the global scope
import "./perlin_noise.js";

export default class Terrain {
    /** @type {number} **/
    #size;

    /** @type {Mesh} **/
    #terrainMesh;

    /** @type {number[][]} **/
    #map;

    /** @param {number} size **/
    constructor(size) {
        this.#size = size;
        this.#map = new Array(size)
            .fill()
            .map(() => new Array(size).fill(yOrigin));
    }

    getMap() {
        return this.#map;
    }

    getTerrainMesh() {
        return this.#terrainMesh;
    }

    /**
     * Render the terrain
     * @param {number} seed
     * **/
    render(seed = Math.random()) {
        console.log("*** Terrain ***");
        console.log("Rendering terrain with seed: ", seed);
        console.log("****************");

        noise.seed(seed);

        const terrain = new Mesh();

        for (let i = 0; i < this.#size; i++) {
            for (let j = 0; j < this.#size; j++) {
                const x = xOrigin + Math.floor(this.#size / 2) - i;
                const z = zOrigin + Math.floor(this.#size / 2) - j;
                const y = yOrigin + Terrain.randomY(i, j);

                // Skip the cubes below the origin
                if (y < yOrigin) continue;

                // Update the map
                this.#map[i][j] = y;

                const geometry = new BoxGeometry(1, 1, 1);
                const material = new MeshPhongMaterial({ color: "white" });
                const cube = new Mesh(geometry, material);
                cube.name = "terrain";

                // Terrain can generate shadows (but not receive them)
                cube.castShadow = true;

                cube.position.x = x;
                cube.position.z = z;
                cube.position.y = y;

                // Create the edges of the cube (can be reused for all cubes)
                // angle parameter very low to avoid rendering issues (but not 0)
                const edges = new EdgesGeometry(geometry, Math.exp(-10 ^ 11));
                const line = new LineBasicMaterial({
                    color: "black",
                    linewidth: 3,
                    precision: "highp",
                });
                const edgesCube = new LineSegments(edges, line);

                // Generate Cubes below the current cube
                for (let k = y; k >= 1; k--) {
                    const geometry = new BoxGeometry(1, 1, 1);
                    const material = new MeshPhongMaterial({ color: "white" });
                    const belowCube = new Mesh(geometry, material);

                    belowCube.position.x = x;
                    belowCube.position.y = yOrigin + y - k;
                    belowCube.position.z = z;
                    belowCube.name = "terrain";

                    belowCube.add(edgesCube);
                    scene.add(belowCube);
                }

                cube.add(edgesCube);
                terrain.add(cube);
            }
        }

        scene.add(terrain);
        this.#terrainMesh = terrain;
    }

    /**
     * @param {number} x
     * @param {number} y
     *  **/
    static randomY(x, y) {
        // Generate a random number between -0.5 and 0.5 aproximately
        const noiseValue = noise.perlin2(x / 15, y / 15);

        // Round the number to the nearest integer between 0 and 4
        const randomY = Math.round(Math.abs(noiseValue * 8) - 1);

        return randomY;
    }
}
