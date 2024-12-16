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
import { ZoneCube } from "../entities/cube/zone_cube";

export default class Terrain {
    /** @type {number} **/
    static #size;

    /** @type {Mesh} **/
    static #terrainMesh;

    /** @type {number[][]} **/
    static #map;

    /** @type {import("simplex-noise").NoiseFunction2D} */
    static #noise2D;

    // /** @type {import("simplex-noise").NoiseFunction3D} */
    // static #noise3D;
    
    /** @type {Array<ZoneCube>} */
    static #zones = this.#generateZoneArray();

    /** @type {Array<{x: number, z: number, zone: ZoneCube}>} */
    static #zoneSeeds = this.#generateRandomSeeds();
    
    static getMap() {
        return this.#map;
    }

    static getTerrainMesh() {
        return this.#terrainMesh;
    }

    static clear() {
        const terrain = this.getTerrainMesh()
        scene.remove(terrain);
    }

    /**
     * Render the terrain
     * @param {number} size
     * @param {number} seed
     * **/
    static render(size, seed = Math.random() * 200) {

        this.#size = size;
        this.#map = new Array(size)
            .fill(null)
            .map(() => new Array(size).fill(yOrigin));

        console.log("*** Terrain ***");
        console.log("Rendering terrain with seed: ", seed);
        console.log("****************");

        const seedGen = Alea(seed)

        this.#noise2D = createNoise2D(seedGen);
        // this.#noise3D = createNoise3D(seedGen);

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
                const zone = this.#getZone(x, z)
                const material = new MeshPhongMaterial({ color: zone.color });

                /** @type {ZoneCube}  */
                const cube = new Mesh(geometry, material);
                cube.name = "terrain";

                // Terrain can generate shadows (but not receive them)
                cube.castShadow = true;

                cube.position.x = x;
                cube.position.z = z;
                cube.position.y = y;

                cube.userData = zone

                // Create the edges of the cube (can be reused for all cubes)
                const edges = new EdgesGeometry(geometry);
                const line = new LineBasicMaterial({
                    color: zone.border_color ?? "black",
                    linewidth: 3,
                    precision: "highp",
                });
                const edgesCube = new LineSegments(edges, line);

                // Generate Cubes below the current cube
                for (let k = y; k >= 1; k--) {

                    const geometry = new BoxGeometry(1, 1, 1);
                    const material = new MeshPhongMaterial({ color: zone.color });
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
    static #randomY(x, z) {
        // Generate a random number between -1 and 1 aproximately
        const noiseValue = this.#noise2D(x / 10, z / 10);

        // Round the number to the nearest integer between 0 and 4
        const randomY = Math.round(Math.abs(noiseValue * 4) - 1);

        return randomY;
    }



    /**
     * @param {number} x
     * @param {number} z
     * @returns {ZoneCube} 
     *  **/
    static #getZone(x, z) {

        // 1. Define Seeds (fixed points in the space)
        const seeds = this.#zoneSeeds

        let nearestSeed = null;
        let minDistance = Infinity;

        // 2. Calculate distance to seeds
        for (const seed of seeds) {
            const dx = x - seed.x;
            const dz = z - seed.z;

            // Euclidean distance 
            const distance = Math.sqrt(dx * dx + dz * dz);

            // Verify if this seed is the nearest
            if (distance < minDistance) {
                minDistance = distance;
                nearestSeed = seed;
            }
        }

        // 3. Apply optional noise to make the zones aleatory
        const scale = 0.05; // Adjust noise scale
        const noiseValue = this.#noise2D(x * scale, z * scale);

        // Softening transition
        const threshold = 0.3; // Noise treshold
        if (noiseValue > threshold) {
            // Select the new nearestSeed based on the previous seed and the total number of seeds
            const index = (seeds.indexOf(nearestSeed) + 1) % seeds.length;
            nearestSeed = seeds[index];
        }

        // 4. Return the zone
        return nearestSeed.zone;

    }


    /**
     * Generate aleatory coordinates for the zone's seeds
     * @returns {Array<{x: number, z: number, zone: ZoneCube}>} Array of aleatory seeds.
     */
    static #generateRandomSeeds() {
        const numSeeds = this.#zones.length; // Number of seeds
        const range = 50; // Range for x and z coords
        const seeds = [];

        for (let i = 0; i < numSeeds; i++) {
            const randomX = Math.floor(Math.random() * (2 * range + 1)) - range; // Aleatory between -50 and 50
            const randomZ = Math.floor(Math.random() * (2 * range + 1)) - range;

            seeds.push({ x: randomX, z: randomZ, zone: this.#zones[i] });
        }

        return seeds;
    }

    /** @returns {Array<ZoneCube>} */
    static #generateZoneArray() {

        const china = { name: "china", color: 'red' }
        const israel = { name: "israel", color: 'lightblue' }
        const georgia = { name: "georgia", color: 'white' }
        const alemania = { name: "alemania", color: 'black', border_color: 'white' }
    
        const zones = []
    
        zones.push(china)
    
        zones.push(israel)
    
        zones.push(georgia)
    
        zones.push(alemania)
    
        return zones
    
    }

}