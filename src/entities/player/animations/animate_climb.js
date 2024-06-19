import { Mesh } from "three";
import { Tween } from "@tweenjs/tween.js";

/**
 * @param {Mesh} player
 * @param {number} animationDuration
 */
export default function animate_climb(player, animationDuration) {
    new Tween({ y: player.position.y })
        .to(
            {
                y: player.position.y + 1,
            },
            animationDuration / 2
        )
        .onUpdate((object) => {
            player.position.y = object.y;
        })
        .start();
}
