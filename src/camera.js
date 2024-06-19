import { OrthographicCamera, DirectionalLight } from "three";
import { mapSize, zOrigin, xOrigin } from "./map/map.js";
import { Tween } from "@tweenjs/tween.js";
import Debouncer from "./debouncer.js";
import { scene } from "./setup.js";

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

    const light = new DirectionalLight("white", 4.8);
    light.position.set(
        camera.position.x - mapSize,
        camera.position.y,
        camera.position.z
    );
    light.target.position.set(xOrigin, 0, zOrigin);
    light.castShadow = true;
    scene.add(light);
    scene.add(light.target);

    setupCameraRotation(camera, light);

    return camera;
}

export default setupCamera;

/**
 * @param {OrthographicCamera} camera
 * @param {DirectionalLight} light
 * **/
function setupCameraRotation(camera, light) {
    const rotationDebouncer = new Debouncer();

    const rotationAnimationDuration = 750;

    document.addEventListener("click", (e) => {
        rotationDebouncer.debounce(() => {
            e.stopPropagation();
            e.preventDefault();

            const rotation = Rotation.getRotation();
            const initialCameraX = camera.position.x;
            const initialCameraZ = camera.position.z;

            console.log("Rotation", rotation);
            console.log( camera.position.z,light.position.z, camera.position.x, light.position.x)

            if (rotation == 0) {
                new Tween({ z_camera: camera.position.z, x_light: light.position.x})
                    .to({ z_camera: camera.position.z - mapSize, x_light: initialCameraX }, rotationAnimationDuration)
                    .onUpdate((object) => {
                        camera.position.z = object.z_camera;
                        light.position.x = object.x_light;
                        camera.lookAt(xOrigin, 0, zOrigin);
                    })
                    .start();
            } else if (rotation == 1) {
                new Tween({ x_camera: camera.position.x, z_light: light.position.z })
                    .to({ x_camera: camera.position.x - mapSize, z_light: initialCameraZ }, rotationAnimationDuration)
                    .onUpdate((object) => {
                        camera.position.x = object.x_camera;
                        light.position.z = object.z_light;
                        camera.lookAt(xOrigin, 0, zOrigin);
                    })
                    .start();
            } else if (rotation == 2) {
                new Tween({ z_camera: camera.position.z, x_light: light.position.x })
                    .to({ z_camera: camera.position.z + mapSize, x_light: initialCameraX }, rotationAnimationDuration)
                    .onUpdate((object) => {
                        camera.position.z = object.z_camera;
                        light.position.x = object.x_light;
                        camera.lookAt(xOrigin, 0, zOrigin);
                    })
                    .start();
            } else if (rotation == 3) {
                new Tween({ x_camera: camera.position.x, z_light: light.position.z })
                    .to({ x_camera: camera.position.x + mapSize, z_light: initialCameraZ }, rotationAnimationDuration)
                    .onUpdate((object) => {
                        camera.position.x = object.x_camera;
                        light.position.z = object.z_light;
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
