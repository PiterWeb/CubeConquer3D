import { Mesh, BoxGeometry, MeshPhongMaterial } from "three";

/** @param {Mesh} player */
export function createPlayerSelector(player) {
    const selectorGeometry = new BoxGeometry(0.5, 0.5, 0.5);
    const selectorMaterial = new MeshPhongMaterial({
        color: "black",
    });
    const selector = new Mesh(selectorGeometry, selectorMaterial);
    selector.position.set(0, 1, 0);
    player.add(selector);

    return selector
}

/** 
 * @param {Mesh} player
 * @param {Mesh} selector
 */
export function removePlayerSelector(player, selector) {
    player.remove(selector);
}