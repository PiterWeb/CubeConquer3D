import { Mesh, Vector3 } from "three";
import { mapConstraints } from "@/map/map";
import Raycast from "@player/raycast";
import { Tween } from "@tweenjs/tween.js";
import animate_climb from "@player/animations/animate_climb";
import animate_fall from "@player/animations/animate_fall";

/**
 * @param {Mesh} player
 * @param {Raycast} playerRaycast
 * @param {number} animationDuration
 * @param {() => void} cllbkStart
 * @param {(fall: boolean) => void} cllbkEnd
 */
export default function animate_right(
    player,
    playerRaycast,
    animationDuration,
    cllbkStart = () => {},
    cllbkEnd = () => {}
) {
    if (player.position.x >= mapConstraints.x.max) return;

    const direction = new Vector3(1, 0, 0);

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

    new Tween({ z_rotation: player.rotation.z, x: player.position.x })
        .to(
            {
                z_rotation: player.rotation.z - Math.PI / 2,
                x: player.position.x + 1,
            },
            animationDuration
        )
        .onUpdate((object) => {
            player.rotation.z = object.z_rotation;
            player.position.x = object.x;
        })
        .start()
        .onStart(() => cllbkStart())
        .onComplete(() => {
            player.rotation.z = 0;
            const fall = boxHaveToFall !== false;
            cllbkEnd(fall);
        });
}
