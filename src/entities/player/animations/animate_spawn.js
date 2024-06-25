import { Mesh } from "three";
import { Tween } from "@tweenjs/tween.js";

/**
 * @param {Mesh} player
 * @param {number} animationDuration
 * @param {number} yDestination
 * */
export default function animate_spawn(player, yDestination, animationDuration) {
    return new Tween({ y: player.position.y })
        .to(
            {
                y: yDestination,
            },
            animationDuration
        )
        .onUpdate((object) => {
            player.position.y = object.y;
        });
}
