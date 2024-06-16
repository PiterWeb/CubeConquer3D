import { OrthographicCamera } from "three";
import { mapSize, zOrigin, xOrigin } from "./map/map.js";

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

export default camera;
