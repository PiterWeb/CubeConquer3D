import { Scene, WebGLRenderer, AmbientLight } from "three";
import { controllBox, renderBox as renderPlayerBox } from "./box.js";
import { renderMap } from "./map/map.js";
import camera from "./camera.js";
import {update as tweenUpdate} from "@tweenjs/tween.js";

export const scene = new Scene();

export default function main() {
    const renderer = new WebGLRenderer();

    renderer.setPixelRatio(window.devicePixelRatio / 2);
    renderer.setSize(window.innerWidth, window.innerHeight);

    window.addEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.body.appendChild(renderer.domElement);

    renderMap();
    const box = renderPlayerBox("blue", "tank");

    // Control the box (one time only)
    controllBox(box);

    function animate(t) {
        renderer.render(scene, camera);
        tweenUpdate(t);
    }

    renderer.setAnimationLoop(animate);

        
    // Applying blur to the canvas
    const canvas = document.querySelector("canvas")
    canvas.style.filter = "blur(1px)"
    canvas.style.filter += " brightness(1.5)"
}
