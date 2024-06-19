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
export default function animate_up(player, playerRaycast, animationDuration) {
    if (player.position.z <= mapConstraints.z.min) return;

    const direction = new Vector3(0, 0, -1);

    if (playerRaycast.boxHaveToClimb(direction)) {
        animate_climb(player, animationDuration);
    } else if (playerRaycast.boxHaveToFall(direction)) {
        animate_fall(player, animationDuration);
    } else if (playerRaycast.boxHaveToColide(direction)) {
        return;
    }

    new Tween({ x_rotation: player.rotation.x, z: player.position.z })
        .to(
            {
                x_rotation: player.rotation.x - Math.PI / 2,
                z: player.position.z - 1,
            },
            animationDuration
        )
        .onUpdate((object) => {
            player.rotation.x = object.x_rotation;
            player.position.z = object.z;
        })
        .start()
        .onComplete(() => {
            player.rotation.x = 0;
        });
}
