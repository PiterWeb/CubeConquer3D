import { OrthographicCamera } from "three";
import { mapSize, zOrigin, xOrigin } from "./map/map.js";
import { Tween } from "@tweenjs/tween.js";
import Debouncer from "./debouncer.js";

function setupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    const distance = mapSize / 2;

    /** @type {OrthographicCamera} **/
    const camera = new OrthographicCamera(
        -distance * aspect,
        distance * aspect,
        distance,
        -distance,
        1,
        1000
    );

    camera.position.y = mapSize / 2;
    camera.position.x = xOrigin + mapSize / 2;
    camera.position.z = zOrigin + mapSize / 2;

    camera.lookAt(xOrigin, 0, zOrigin);

    setupCameraRotation(camera);

    return camera;
}

export default setupCamera;

/**
 * @param {OrthographicCamera} camera
 * **/
function setupCameraRotation(camera) {
    const rotationDebouncer = new Debouncer();

    document.addEventListener("click", (e) => {
        rotationDebouncer.debounce(() => {
            e.stopPropagation();
            e.preventDefault();

            const rotation = Rotation.getRotation();

            if (rotation == 0) {
                new Tween({ z: camera.position.z })
                    .to({ z: camera.position.z - mapSize }, 750)
                    .onUpdate((object) => {
                        camera.position.z = object.z;
                        camera.lookAt(xOrigin, 0, zOrigin);
                    })
                    .start();
            } else if (rotation == 1) {
                new Tween({ x: camera.position.x })
                    .to({ x: camera.position.x - mapSize }, 750)
                    .onUpdate((object) => {
                        camera.position.x = object.x;
                        camera.lookAt(xOrigin, 0, zOrigin);
                    })
                    .start();
            } else if (rotation == 2) {
                new Tween({ z: camera.position.z })
                    .to({ z: camera.position.z + mapSize }, 750)
                    .onUpdate((object) => {
                        camera.position.z = object.z;
                        camera.lookAt(xOrigin, 0, zOrigin);
                    })
                    .start();
            } else if (rotation == 3) {
                new Tween({ x: camera.position.x })
                    .to({ x: camera.position.x + mapSize }, 750)
                    .onUpdate((object) => {
                        camera.position.x = object.x;
                        camera.lookAt(xOrigin, 0, zOrigin);
                    })
                    .start();

                Rotation.setRotation(-1);
            }

            Rotation.incrementRotation();
        }, 500);
    });
}

export class Rotation {
    static #rotation = 0;

    constructor() {}

    static getRotation() {
        return this.#rotation;
    }

    static setRotation(rotation) {
        this.#rotation = rotation;
    }

    static incrementRotation() {
        this.#rotation += 1;
    }

    /**
     *
     * Get direction based on the current rotation
     *
     * @param {'up' | 'down' | 'left' | 'right'} normalDirection
     * **/
    static getDirection(normalDirection) {
        switch (normalDirection) {
            case "up":
                return ["up", "left", "down", "right"][this.#rotation];
            case "down":
                return ["down", "right", "up", "left"][this.#rotation];
            case "left":
                return ["left", "down", "right", "up"][this.#rotation];
            case "right":
                return ["right", "up", "left", "down"][this.#rotation];
            default:
                throw new Error("Invalid direction");
        }
    }
}
