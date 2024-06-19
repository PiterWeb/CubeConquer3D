import { Scene, WebGLRenderer} from "three";
import { controllPlayer, renderPlayerBox } from "./entities/player/player.js";
import { renderMap } from "./map/map.js";
import setupCamera from "./camera.js";
import { update as tweenUpdate } from "@tweenjs/tween.js";

export const scene = new Scene();

export default function main() {
    const renderer = new WebGLRenderer({ antialias: true });

    // Enable shadows
    renderer.shadowMap.enabled = true;
    // Set the pixel ratio to 2 for pixelated effect
    renderer.setPixelRatio(window.devicePixelRatio / 2);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Resize the renderer when the window is resized
    window.addEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.body.appendChild(renderer.domElement);

    const terrain = renderMap();
    // console.log("Terrain", terrain.getMap());

    const playerBox = renderPlayerBox("blue", "tank");

    // Control the playerBox (one time only)
    controllPlayer(playerBox);

    const camera = setupCamera();

    function animate(t) {
        renderer.render(scene, camera);
        tweenUpdate(t);
    }

    renderer.setAnimationLoop(animate);

    // Applying blur to the canvas
    const canvas = document.querySelector("canvas");
    canvas.style.filter = "blur(1px)";
}
