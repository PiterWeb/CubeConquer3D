import { Mesh, Vector3 } from "three";
import { mapConstraints } from "../../../map/map";
import Raycast from "../raycast";
import { Tween } from "@tweenjs/tween.js";
import animate_climb from "./animate_climb";
import animate_fall from "./animate_fall";

/**
 * @param {Mesh} player
 * @param {Raycast} playerRaycast
 * @param {number} animationDuration
 */
export default function animate_left(player, playerRaycast, animationDuration) {
    if (player.position.x <= mapConstraints.x.min) return;

    const direction = new Vector3(-1, 0, 0);

    if (playerRaycast.boxHaveToClimb(direction)) {
        animate_climb(player, animationDuration);
    } else if (playerRaycast.boxHaveToFall(direction)) {
        animate_fall(player, animationDuration);
    } else if (playerRaycast.boxHaveToColide(direction)) {
        return;
    }

    new Tween({ z_rotation: player.rotation.z, x: player.position.x })
        .to(
            {
                z_rotation: player.rotation.z + Math.PI / 2,
                x: player.position.x - 1,
            },
            animationDuration
        )
        .onUpdate((object) => {
            player.rotation.z = object.z_rotation;
            player.position.x = object.x;
        })
        .start()
        .onComplete(() => {
            player.rotation.z = 0;
        });
}
