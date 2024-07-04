import {
    Mesh,
    BoxGeometry,
    MeshPhongMaterial,
    LineSegments,
    EdgesGeometry,
    LineBasicMaterial,
} from "three";
import { Player } from "./player";
import animate_selector from "./animations/animate_selector";

/** @param {Player} player */
export function createPlayerSelector(player) {
    const selectorGeometry = new BoxGeometry(0.5, 0.5, 0.5);
    const selectorMaterial = new MeshPhongMaterial({
        color: "black",
    });
    const selector = new Mesh(selectorGeometry, selectorMaterial);
    selector.position.set(0, 1, 0);

    const edges = new EdgesGeometry(selectorGeometry);

    const line = new LineSegments(
        edges,
        new LineBasicMaterial({ color: "white" })
    );

    selector.add(line);

    player.add(selector);

    const animation = animate_selector(selector);

    player.userData.selector_animation = animation;

    return selector;
}

/**
 * @param {Player} player
 * @param {Mesh} selector
 */
export function removePlayerSelector(player, selector) {
    if (player.userData.selector_animation)
        player.userData.selector_animation.end();

    player.remove(selector);
}
