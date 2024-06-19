import { Mesh } from "three";
import { Tween } from "@tweenjs/tween.js";
import { yOrigin } from "../../../map/map";

/**
 * @param {Mesh} player
 * @param {number} animationDuration
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
        .onUpdate((object) => {
            player.position.y = object.y;
        })
        .start();
}
