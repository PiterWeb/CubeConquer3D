import Terrain from "./terrain";
import { yOrigin } from "./map";
import { Tween } from "@tweenjs/tween.js";

export default function animateTerrainFall() {
    Terrain.getTerrainMesh().position.y = yOrigin + 20;

    new Tween({ y: Terrain.getTerrainMesh().position.y })
        .to(
            {
                y: yOrigin - 0.5,
            },
            1000
        )
        .onUpdate((object) => {
            Terrain.getTerrainMesh().position.y = object.y;
        })
        .start();
}
