import {
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    EdgesGeometry,
    LineBasicMaterial,
    LineSegments,
} from "three";
import { scene } from "../setup";
import { mapSize } from "./map";
import Terrain from "./terrain";

export default function renderBackground() {
    const size = 40;

    const geometry = new BoxGeometry(size, 1, size);
    const material = new MeshBasicMaterial({ color: "green" });

    const bg1 = new Mesh(geometry, material);
    bg1.position.x = size / 2 + 4;

    const bg2 = new Mesh(geometry, material);
    bg2.position.z = size / 2 + 4;

    const bg3 = new Mesh(geometry, material);
    bg3.position.x = -mapSize - size / 2 - 4;

    const bg4 = new Mesh(geometry, material);
    bg4.position.z = -mapSize - size / 2 - 4;

    const edges = new EdgesGeometry(geometry);
    const line = new LineBasicMaterial({ color: "black" });
    const edgesMap = new LineSegments(edges, line);

    bg1.add(edgesMap);
    bg2.add(edgesMap.clone());
    bg3.add(edgesMap.clone());
    bg4.add(edgesMap.clone());

    const bg = new Mesh();
    bg.add(bg1);
    bg.add(bg2);
    bg.add(bg3);
    bg.add(bg4);

    scene.add(bg);
}
