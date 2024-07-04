import { Mesh, Raycaster, Vector3 } from "three";
import { scene } from "../../setup";
import { yOrigin } from "../../map/map";

/**
 * @class Raycast
 * @classdesc A class to cast rays from the player's position
 */
export default class Raycast {
    /** @type {Mesh} **/ #player;

    /** @param {Mesh} player */
    constructor(player) {
        this.#player = player;
    }

    /**
     *  Cast a ray from the player's position
     *  @param {Vector3} direction The direction of the ray (normalized)
     *  @param {number} distance The distance of the ray
     *  @param {Vector3 | null} customPosition The position to cast the ray from (default is the player's position)
     *  @param {string | null} targetName The name of the target object (default is "terrain") (if null, it will be an empty string)
     *  @returns The coordinates of the first object that intersects with the ray and has the target name (null if there is no object)
     *  **/
    #cast(direction, distance, customPosition = null, targetName = "terrain") {
        const raycaster = new Raycaster();

        if (customPosition !== null) {
            raycaster.set(customPosition, direction);
        } else {
            raycaster.set(this.#player.position, direction);
        }

        if (targetName === null) {
            targetName = "";
        }

        // Get the first object that intersects with the ray and has the target name
        const intersects = raycaster
            .intersectObjects(scene.children)
            .filter((object) => object.object.name === targetName);

        if (intersects.length > 0) {
            const point = intersects[0].point;
            const distanceToPoint = this.#player.position.distanceTo(point);
            if (distanceToPoint < distance) {
                return point;
            }
        }
        return null;
    }

    /**
     * @param {Vector3} direction The direction to check if the player have to fall
     * @param {number} distance Default value is 1.5 to avoid the player to fall when moving ()
     */
    boxHaveToFall(direction, distance = 1.5) {
        if (this.#player.position.y <= yOrigin) return false;
        const nextPlayerPosition = this.#player.position.clone();

        //Move the player to the new direction to check if there is a block below
        nextPlayerPosition.z += direction.z;
        nextPlayerPosition.x += direction.x;

        //Check if there is a block below
        const directionToCheck = new Vector3(0, -1, 0);

        return (
            this.#cast(directionToCheck, distance, nextPlayerPosition) === null
        );
    }

    /**
     * @param {Vector3} direction The direction to check if the player have to climb
     * @param {number} distance Default value is 1
     */
    boxHaveToClimb(direction, distance = 1) {
        const terrainCords = this.#cast(direction, distance);

        const isTerrainForward = terrainCords !== null;
        if (!isTerrainForward) return false;

        const climbDirection = new Vector3(0, 1, 0);
        const isTerrainAbove =
            this.#cast(climbDirection, 2, terrainCords) !== null;

        return isTerrainForward && !isTerrainAbove;
    }

     /**
     * @param {Vector3} direction The direction to check if the player have to climb
     * @param {number} distance Default value is 1
     */
    boxHaveToColide(direction, distance = 1) {
        const terrainCords = this.#cast(direction, distance);

        if (terrainCords === null) return false;

        const isTerrainForward = terrainCords !== null;
        const notHaveToClimb = !this.boxHaveToClimb(direction, 1.5);

        if (isTerrainForward && notHaveToClimb) return true;

        //Check if there is a block below
        const directionToCheck = new Vector3(0, -1, 0);

        const isTerrainBelowNextPosition =
            this.#cast(directionToCheck, 10, terrainCords) !== null;

        // if (!isTerrainBelowNextPosition) console.log("colide");

        return !isTerrainBelowNextPosition;
    }
}
