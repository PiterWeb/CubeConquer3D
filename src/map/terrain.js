import { scene } from "../setup";
import { createNoise2D } from 'simplex-noise';
import { xOrigin, zOrigin, yOrigin } from "./map";
import {
    BoxGeometry,
    MeshPhongMaterial,
    Mesh,
    EdgesGeometry,
    LineBasicMaterial,
    LineSegments,
} from "three";

import Alea from "alea";
import { createNoise3D } from "simplex-noise";

export default class Terrain {
    /** @type {number} **/
    #size;

    /** @type {Mesh} **/
    #terrainMesh;

    /** @type {number[][]} **/
    #map;

    /** @type {import("simplex-noise").NoiseFunction2D} */
    #noise2D;

    /** @type {import("simplex-noise").NoiseFunction3D} */
    #noise3D;

    /** @param {number} size **/
    constructor(size) {
        this.#size = size;
        this.#map = new Array(size)
            .fill(null)
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
    render(seed = Math.random() * 200) {
        console.log("*** Terrain ***");
        console.log("Rendering terrain with seed: ", seed);
        console.log("****************");

        const seedGen = Alea(seed)

        this.#noise2D = createNoise2D(seedGen);
        this.#noise3D = createNoise3D(seedGen);

        const terrain = new Mesh();

        for (let i = 0; i < this.#size; i++) {
            for (let j = 0; j < this.#size; j++) {
                const x = xOrigin + Math.floor(this.#size / 2) - i;
                const z = zOrigin + Math.floor(this.#size / 2) - j;
                const y = yOrigin + this.#randomY(i, j);

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
                const edges = new EdgesGeometry(geometry);
                const line = new LineBasicMaterial({
                    color: "black",
                    linewidth: 3,
                    precision: "highp",
                });
                const edgesCube = new LineSegments(edges, line);

                // Generate Cubes below the current cube
                for (let k = y; k >= 1; k--) {
                    if (this.#shouldBeACavity(x, yOrigin + y - k, z)) {
                        Terrain.#decorateCave(x, yOrigin + y - k, z);
                        // continue;
                    }

                    const geometry = new BoxGeometry(1, 1, 1);
                    const material = new MeshPhongMaterial({ color: "white" });
                    const belowCube = new Mesh(geometry, material);
                    const edgesCube = new LineSegments(edges, line);

                    belowCube.position.x = x;
                    belowCube.position.y = yOrigin + y - k;
                    belowCube.position.z = z;
                    belowCube.name = "terrain";

                    belowCube.add(edgesCube);
                    terrain.add(belowCube);
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
     * @param {number} z
     *  **/
    #randomY(x, z) {
        // Generate a random number between -1 and 1 aproximately
        const noiseValue = this.#noise2D(x/10, z/10);

        // Round the number to the nearest integer between 0 and 4
        const randomY = Math.round(Math.abs(noiseValue * 4) - 1);

        return randomY;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     *  **/
    #shouldBeACavity(x, y, z) {
        const noiseValue = this.#noise3D(x, y, z);

        // Round the number to the nearest integer between 0 and 1
        const bool = Math.round(Math.abs(noiseValue));

        return bool !== 1;
    }

    static #decorateCave(x, y, z) {
        // TODO
    }
}
