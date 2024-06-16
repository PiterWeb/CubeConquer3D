import {
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    LineBasicMaterial,
    LineSegments,
    EdgesGeometry,
    GridHelper,
} from "three";
import { scene } from "../setup";

export const mapSize = 15;

export const xOrigin = -mapSize / 2;
export const zOrigin = -mapSize / 2;
export const yOrigin = 0.5;

export const mapConstraints = {
    x: {
        max: xOrigin + Math.round(mapSize / 2) - 1,
        min: xOrigin - Math.round(mapSize/2) + 1,
    },
    z: {
        max: zOrigin + Math.round(mapSize / 2) - 1,
        min: zOrigin - Math.round(mapSize/2) + 1,
    },
};

function renderGrid() {
    const grid = new GridHelper(mapSize, mapSize, 0x000000, 0x000000);

    grid.position.x = xOrigin;
    grid.position.z = zOrigin;
    grid.position.y = yOrigin - 0.5;

    scene.add(grid);
}

export function renderMap() {
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

    edgesMap.position.x = xOrigin;
    edgesMap.position.z = zOrigin;
    edgesMap.position.y = yOrigin - 1;

    renderGrid();

    scene.add(map);
    scene.add(edgesMap);

    return map;
}
