import Terrain from "./terrain";
import { yOrigin } from "./map";
import { Tween } from "@tweenjs/tween.js";

/** @param {Terrain} terrain */
export default function animateTerrainFall(terrain) {
    terrain.getTerrainMesh().position.y = yOrigin + 20;

    new Tween({ y: terrain.getTerrainMesh().position.y })
        .to(
            {
                y: yOrigin - 0.5,
            },
            1000
        )
        .onUpdate((object) => {
            terrain.getTerrainMesh().position.y = object.y;
        })
        .start();
}
