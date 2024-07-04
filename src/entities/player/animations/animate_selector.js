import { Easing } from "@tweenjs/tween.js";
import { Tween } from "@tweenjs/tween.js";
import { Mesh } from "three";

/**
 * @param {Mesh} selector
 * @returns {Tween}
 */
export default function animate_selector(selector) {
    return new Tween({ y: selector.position.y })
        .to(
            {
                y: selector.position.y + 0.5,
            },
            1000
        )
        .onUpdate(({ y }) => {
            selector.position.y = y;
        })
        .easing(Easing.Quadratic.InOut)
        .repeat(Infinity)
        .yoyo(true)
        .start();
}
