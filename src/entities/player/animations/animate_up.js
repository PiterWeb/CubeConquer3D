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
 * @param {() => void} cllbk
 */
export default function animate_up(
    player,
    playerRaycast,
    animationDuration,
    cllbk = () => {}
) {
    if (player.position.z <= mapConstraints.z.min) return;

    const direction = new Vector3(0, 0, -1);

    const boxHaveToClimb = playerRaycast.boxHaveToClimb(direction);
    const boxHaveToFall = playerRaycast.boxHaveToFall(direction);
    const boxHaveToColide = playerRaycast.boxHaveToColide(direction);

    if (boxHaveToClimb) {
        animate_climb(player, animationDuration);
    } else if (boxHaveToFall) {
        animate_fall(player, animationDuration);
    } else if (boxHaveToColide) {
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
            if (
                boxHaveToFall
            )
                return;
            cllbk();
        });
}
