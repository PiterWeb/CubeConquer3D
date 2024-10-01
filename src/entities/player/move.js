import { BoxGeometry, EdgesGeometry, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, Vector3 } from "three";
import Debouncer from "../../debouncer";
import { Rotation} from "../../camera";
import { scene } from "../../setup";
import { roleColors } from "./role";
import { createPlayerSelector, removePlayerSelector } from "./player_selector";
import { Player } from "./player";
import animate_left from "./animations/animate_left";
import animate_down from "./animations/animate_down";
import animate_right from "./animations/animate_right";
import animate_up from "./animations/animate_up";
import Raycast from "./raycast";
import { ShakeCamera } from "../../camera";

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

        if (fall) {
            // ShakeCamera(new Vector3(0.1, 0, 0), 350)
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
export default function controllPlayer(player) {
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

            if (event.key !== "w" && event.key !== "s" && event.key !== "a" && event.key !== "d") {
                return;
            }

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
         */
        function toogleAttackMode(event) {
            if (event.key === "Shift") {
                player.attackMode();
            }
        }

        window.addEventListener("keydown", toogleAttackMode);

        function resetMove(event) {
            console.log(event.key)
            if (event.key === "Escape" && !tempBox.userData.moving) {
                tempBox.position.set(
                    player.position.x,
                    player.position.y,
                    player.position.z
                );
            }
        }

        window.addEventListener("keydown", resetMove)

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
                window.removeEventListener("keydown", toogleAttackMode);
                window.removeEventListener("keydown", resetMove)
                removePlayerSelector(player, selector);
                resolve();
            }
        }



        // Detect spacebar to confirm the movement
        window.addEventListener("keydown", confirmMovement);

    });
}