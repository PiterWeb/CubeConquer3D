import { OrthographicCamera } from "three";
import { mapSize, zOrigin, xOrigin } from "./map/map.js";
import { Tween } from "@tweenjs/tween.js";

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
    document.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();

        const rotation = Rotation.getRotation();

        if (rotation == 0) {
            new Tween({ z: camera.position.z })
                .to({ z: camera.position.z - mapSize }, 1000)
                .onUpdate((object) => {
                    camera.position.z = object.z;
                    camera.lookAt(xOrigin, 0, zOrigin);
                })
                .start();
        } else if (rotation == 1) {
            new Tween({ x: camera.position.x })
                .to({ x: camera.position.x - mapSize }, 1000)
                .onUpdate((object) => {
                    camera.position.x = object.x;
                    camera.lookAt(xOrigin, 0, zOrigin);
                })
                .start();
        } else if (rotation == 2) {
            new Tween({ z: camera.position.z })
                .to({ z: camera.position.z + mapSize }, 1000)
                .onUpdate((object) => {
                    camera.position.z = object.z;
                    camera.lookAt(xOrigin, 0, zOrigin);
                })
                .start();
        } else if (rotation == 3) {
            new Tween({ x: camera.position.x })
                .to({ x: camera.position.x + mapSize }, 1000)
                .onUpdate((object) => {
                    camera.position.x = object.x;
                    camera.lookAt(xOrigin, 0, zOrigin);
                })
                .start();

            Rotation.setRotation(-1);
        }

        Rotation.incrementRotation();
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
}
