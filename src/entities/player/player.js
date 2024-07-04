import {
    BoxGeometry,
    Mesh,
    EdgesGeometry,
    LineBasicMaterial,
    LineSegments,
    MeshPhongMaterial,
    MeshBasicMaterial,
    BackSide,
} from "three";
import { scene } from "../../setup";
import { xOrigin, zOrigin, yOrigin } from "../../map/map";
import Debouncer from "../../debouncer";
import { roleColors } from "./role";
import { Rotation } from "../../camera";
import Raycast from "./raycast";
import animate_up from "./animations/animate_up";
import animate_down from "./animations/animate_down";
import animate_left from "./animations/animate_left";
import animate_right from "./animations/animate_right";
import { createPlayerSelector, removePlayerSelector } from "./player_selector";
import { Tween } from "@tweenjs/tween.js";
/**
 * @import {teamType} from "../../game/teamController"
 * @import Role from "./role"
 */

/**
 * @class Player - A class to represent a player in the scene
 * @extends Mesh
 */
export class Player extends Mesh {
    /**
     * @param {BoxGeometry} geometry
     * @param {MeshPhongMaterial} material
     * @param {Object} userData
     * @param {teamType} userData.team
     * @param {Role} userData.role
     * @param {boolean} userData.moving
     * @param {Tween?} userData.selector_animation
     */
    constructor(geometry, material, userData) {
        super(geometry, material);
        this.userData = userData;
        this.userData
    }
}

/**
 *  Render a box in the scene
 *  @param {teamType} team The team color
 *  @param {Role} role The role of the player
 *  @param {Object} position The position of the box
 *  @param {number} position.x The x position of the box
 *  @param {number} position.y The y position of the box
 *  @param {number} position.z The z position of the box
 * @returns {Player} The player box
 **/
export function renderPlayerBox(
    team = "blue",
    role = "dps",
    { x = xOrigin, y = yOrigin, z = zOrigin } = {
        x: xOrigin,
        y: yOrigin,
        z: zOrigin,
    }
) {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshPhongMaterial({
        color: team,
    });

    const player = new Player(geometry, material, {
        team,
        role,
        moving: false,
        selector_animation: null,
    });

    player.position.x = x;
    player.position.y = y;
    player.position.z = z;

    // Player can receive shadows
    player.receiveShadow = true;

    // Create the edges of the cube
    const edges = new BoxGeometry(1.1, 1.1, 1.1);

    const materialEdges = new MeshBasicMaterial({
        color: roleColors[role],
        side: BackSide,
    })

    const meshEdges = new Mesh(edges, materialEdges);

    // Add the edges to the cube
    player.add(meshEdges);

    scene.add(player);

    return player;
}

const animationDuration = 150;

/**
 *
 * Animate the box movement in the scene
 *
 * @param {Mesh & {userData: { moving?: boolean}}} player The box to animate
 * @param {'up' | 'down' | 'left' | 'right'} dir The direction of the movement
 * **/
function animateMove(player, dir) {
    const playerRaycast = new Raycast(player);

    /** @param {boolean} fall */
    function onAnimationFinish(fall) {
        if (!fall) {
            const audio = new Audio("/move.wav");
            audio.volume = 0.5;
            audio.play().then(() => {
                audio.remove();
            });
        }
        player.userData.moving = false;
    }

    function onAnimationStart() {
        player.userData.moving = true;
    }

    if (dir === "up") {
        animate_up(
            player,
            playerRaycast,
            animationDuration,
            onAnimationStart,
            onAnimationFinish
        );
        return;
    }

    if (dir === "down") {
        animate_down(
            player,
            playerRaycast,
            animationDuration,
            onAnimationStart,
            onAnimationFinish
        );
        return;
    }

    if (dir === "left") {
        animate_left(
            player,
            playerRaycast,
            animationDuration,
            onAnimationStart,
            onAnimationFinish
        );
        return;
    }

    if (dir === "right") {
        animate_right(
            player,
            playerRaycast,
            animationDuration,
            onAnimationStart,
            onAnimationFinish
        );
        return;
    }
}

/**
 * Move the player with the keyboard (WASD) and confirm the movement with the spacebar
 * @param {Player} player The player to move
 * @returns {Promise<void>} The promise resolves when the movement is confirmed
 * **/
export function controllPlayer(player) {
    return new Promise((resolve) => {
        const selector = createPlayerSelector(player);

        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshBasicMaterial({
            color: player.userData.team,
            opacity: 0.5,
            transparent: true,
        });

        /** @type {Mesh & {userData: { moving?: boolean}}} */
        const tempBox = new Mesh(geometry, material);
        tempBox.position.set(
            player.position.x,
            player.position.y,
            player.position.z
        );

        tempBox.userData.moving = false;

        const tempEdges = new EdgesGeometry(geometry);
        const line = new LineBasicMaterial({
            color: roleColors[player.userData.role],
        });
        const tempBoxEdges = new LineSegments(tempEdges, line);


        tempBox.add(tempBoxEdges);
        scene.add(tempBox);

        const actionDebouncer = new Debouncer();

        /**
         *
         * @param {KeyboardEvent} event
         * **/
        function move(event) {
            actionDebouncer.debounce(() => {
                if (event.key === "w") {
                    animateMove(tempBox, Rotation.getDirection("up"));
                    return;
                }
                if (event.key === "s") {
                    animateMove(tempBox, Rotation.getDirection("down"));
                    return;
                }

                if (event.key === "a") {
                    animateMove(tempBox, Rotation.getDirection("left"));
                    return;
                }

                if (event.key === "d") {
                    animateMove(tempBox, Rotation.getDirection("right"));
                    return;
                }
            }, animationDuration);
        }

        window.addEventListener("keydown", move);

        /**
         * @param {KeyboardEvent} event
         * **/
        function confirmMovement(event) {
            // Spacebar
            if (event.key === " " && !tempBox.userData.moving) {
                player.position.set(
                    tempBox.position.x,
                    tempBox.position.y,
                    tempBox.position.z
                );
                scene.remove(tempBox);
                window.removeEventListener("keydown", move);
                window.removeEventListener("keydown", confirmMovement);
                removePlayerSelector(player, selector);
                resolve();
            }
        }

        // Detect spacebar to confirm the movement
        window.addEventListener("keydown", confirmMovement);
    });
}
