import {
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    LineBasicMaterial,
    LineSegments,
    EdgesGeometry,
} from "three";
import { scene } from "../setup";
import Terrain from "./terrain";
import Grid from "./map_grid";
import animateTerrainFall from "./animate_terrain_fall";

export const mapSize = 15;

export const xOrigin = -mapSize / 2;
export const zOrigin = -mapSize / 2;
export const yOrigin = 0.5;

export const mapConstraints = {
    x: {
        max: xOrigin + Math.round(mapSize / 2) - 1,
        min: xOrigin - Math.round(mapSize / 2) + 1,
    },
    z: {
        max: zOrigin + Math.round(mapSize / 2) - 1,
        min: zOrigin - Math.round(mapSize / 2) + 1,
    },
};

/**
 * @param {number} seed
 * **/
export function renderMap(seed = Math.random() * 200) {
    const geometry = new BoxGeometry(mapSize, 1, mapSize);
    const material = new MeshBasicMaterial({ color: "green" });
    const map = new Mesh(geometry, material);

    // Show the edges of the map
    const edges = new EdgesGeometry(geometry);
    const line = new LineBasicMaterial({ color: "black" });
    const edgesMap = new LineSegments(edges, line);

    map.position.x = xOrigin;
    map.position.z = zOrigin;
    map.position.y = yOrigin - 1;
    map.name = "terrain";

    edgesMap.position.x = xOrigin;
    edgesMap.position.z = zOrigin;
    edgesMap.position.y = yOrigin - 1;

    const grid = new Grid(mapSize);
    grid.render();

    const terrain = new Terrain(mapSize);
    terrain.render(seed);

    scene.add(map);
    scene.add(edgesMap);

    animateTerrainFall(terrain);

    return terrain;
}
