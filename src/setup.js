import { Scene, WebGLRenderer, HemisphereLight} from "three";
import { renderMap } from "./map/map.js";
import setupCamera from "./camera.js";
import { update as tweenUpdate } from "@tweenjs/tween.js";
import setupGui, { refreshGameGui } from "./gui/gui.js";    

// Applying canvas default styles
import './canvas/canvas.css'

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

    const light = new HemisphereLight(0xffffbb, 0x080820, 0.2);
    scene.add(light);

    const terrain = renderMap(0.829387539471165);

    const camera = setupCamera();

    setupGui();

    function generalLoop(t) {
        renderer.render(scene, camera);
        tweenUpdate(t);
        refreshGameGui();
    }

    renderer.setAnimationLoop(generalLoop);


}
