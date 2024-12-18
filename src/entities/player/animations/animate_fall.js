import { Mesh, Vector3 } from "three";
import { Tween, Easing } from "@tweenjs/tween.js";
import Raycast from "../raycast";
import { ShakeCamera } from "../../../camera";

/**
 * @param {Mesh} player
 * @param {number} animationDuration
 *
 */
export default function animate_fall(player, animationDuration) {
    new Tween({ y: player.position.y })
        .to(
            {
                y: player.position.y - 1,
            },
            animationDuration
        )
        .easing(Easing.Quadratic.InOut)
        .onUpdate((object) => {
            player.position.y = object.y;
        })
        .onComplete(() => {

            const direction = new Vector3(0, 0, 0);
            const boxHaveToFall = new Raycast(player).boxHaveToFall(direction);

            if (boxHaveToFall) {
                animate_fall(player, animationDuration / 1.5);
                ShakeCamera(new Vector3(0.5, 0, 0), 350, animationDuration / 1.5)
                return
            }

            const audio = new Audio("/fall.wav");
            audio.volume = 0.5;
            audio.play().then(() => {
                audio.remove();
            });


        })
        .start();
}
