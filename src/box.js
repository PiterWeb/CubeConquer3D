import {
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    EdgesGeometry,
    LineBasicMaterial,
    LineSegments,
} from "three";
import { scene } from "./setup";
import { xOrigin, zOrigin, yOrigin, mapConstraints } from "./map/map";
import Tween from "@tweenjs/tween.js";
import Debouncer from "./debouncer";
import { roleColors } from "./player/role";
import { Rotation } from "./camera";

/**
 *  Render a box in the scene
 *  @import Team from "./player/team"
 *  @import Role from "./player/role"
 *  @param {Team} team
 *  @param {Role} role
 * **/
export function renderBox(
    team = "blue",
    role = "dps",
    { x = xOrigin, y = yOrigin, z = zOrigin } = {}
) {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({
        color: team,
    });
    const cube = new Mesh(geometry, material);
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;

    // Add the team and role to the cube
    cube.userData = { team, role };

    // Create the edges of the cube
    const edges = new EdgesGeometry(geometry);
    const line = new LineBasicMaterial({ color: roleColors[role] });
    const edgesCube = new LineSegments(edges, line);

    // Add the edges to the cube
    cube.add(edgesCube);

    scene.add(cube);

    return cube;
}

const animationDuration = 150;

/**
 *
 * Animate the box movement
 *
 * @param {Mesh} box
 * @param {'up' | 'down' | 'left' | 'right'} dir
 * **/
function animateMove(box, dir) {
    if (dir === "up") {
        if (box.position.z <= mapConstraints.z.min) return;

        new Tween.Tween({ x_rotation: box.rotation.x, z: box.position.z })
            .to(
                {
                    x_rotation: box.rotation.x - Math.PI / 2,
                    z: box.position.z - 1,
                },
                animationDuration
            )
            .onUpdate((object) => {
                box.rotation.x = object.x_rotation;
                box.position.z = object.z;
            })
            .start()
            .onComplete(() => {
                box.rotation.x = 0;
            });
        return;
    }

    if (dir === "down") {
        if (box.position.z >= mapConstraints.z.max) return;
        new Tween.Tween({ x_rotation: box.rotation.x, z: box.position.z })
            .to(
                {
                    x_rotation: box.rotation.x + Math.PI / 2,
                    z: box.position.z + 1,
                },
                animationDuration
            )
            .onUpdate((object) => {
                box.rotation.x = object.x_rotation;
                box.position.z = object.z;
            })
            .start()
            .onComplete(() => {
                box.rotation.x = 0;
            });
        return;
    }

    if (dir === "left") {
        if (box.position.x <= mapConstraints.x.min) return;
        new Tween.Tween({ z_rotation: box.rotation.z, x: box.position.x })
            .to(
                {
                    z_rotation: box.rotation.z + Math.PI / 2,
                    x: box.position.x - 1,
                },
                animationDuration
            )
            .onUpdate((object) => {
                box.rotation.z = object.z_rotation;
                box.position.x = object.x;
            })
            .start()
            .onComplete(() => {
                box.rotation.z = 0;
            });
        return;
    }

    if (dir === "right") {
        if (box.position.x >= mapConstraints.x.max) return;

        new Tween.Tween({ z_rotation: box.rotation.z, x: box.position.x })
            .to(
                {
                    z_rotation: box.rotation.z - Math.PI / 2,
                    x: box.position.x + 1,
                },
                animationDuration
            )
            .onUpdate((object) => {
                box.rotation.z = object.z_rotation;
                box.position.x = object.x;
            })
            .start()
            .onComplete(() => {
                box.rotation.z = 0;
            });
    }
}

/**
 * Move the box with the keyboard
 *
 * @param {Mesh} box
 * **/
export function controllBox(box) {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({
        color: box.userData.team,
        opacity: 0.5,
        transparent: true,
    });
    const tempBox = new Mesh(geometry, material);
    tempBox.position.set(box.position.x, box.position.y, box.position.z);

    const tempEdges = new EdgesGeometry(geometry);
    const line = new LineBasicMaterial({
        color: roleColors[box.userData.role],
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
        if (event.key === " ") {
            box.position.set(
                tempBox.position.x,
                tempBox.position.y,
                tempBox.position.z
            );
            scene.remove(tempBox);
            window.removeEventListener("keydown", move);
            window.removeEventListener("keydown", confirmMovement);
        }
    }

    // Detect spacebar to confirm the movement
    window.addEventListener("keydown", confirmMovement);
}
