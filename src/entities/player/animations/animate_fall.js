import { Mesh } from "three";
import { Tween, Easing } from "@tweenjs/tween.js";
import { yOrigin } from "../../../map/map";

/**
 * @param {Mesh} player
 * @param {number} animationDuration
 * @param {() => void} cllbk
 */
export default function animate_fall(player, animationDuration) {
    if (player.position.y <= yOrigin) return;
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
        }).onComplete(() => {
            const audio = new Audio("/fall.wav");
            audio.volume = 0.5;
            audio.play().then(() => {
                audio.remove();
            })
        })
        .start();
}
