import {
    BoxGeometry,
    Mesh,
    MeshPhongMaterial,
    MeshBasicMaterial,
    BackSide,
} from "three";
import { scene } from "../../setup";
import { xOrigin, zOrigin, yOrigin, mapSize } from "../../map/map";
import { roleColors, roleStats } from "./role";
import { Tween } from "@tweenjs/tween.js";
import controllPlayer from "./move";
import attackMode from "./attack";
import animate_spawn from "./animations/animate_spawn";
import Terrain from "../../map/terrain";
/**
 * @import {teamType} from "../../game/teamController"
 * @import { role as Role } from "./role"
 */

/**
 * @class Player - A class to represent a player in the scene
 * @extends Mesh
 */
export class Player extends Mesh {
    /**
     * @param {BoxGeometry} geometry
     * @param {MeshPhongMaterial} material
     * @param {Object} userData
     * @param {teamType} userData.team
     * @param {Role} userData.role
     * @param {boolean} userData.moving
     * @param {Tween?} userData.selector_animation
     * @param {number?} userData.current_health
     * @param {boolean} userData.attack_mode
     */
    constructor(geometry, material, userData) {
        super(geometry, material);
        this.userData = userData;
        if (this.userData.current_health === null) {
            this.userData.current_health = roleStats[userData.role].health;
        }
    }

    /**
     *
     */
    attackMode() {
        this.userData.attack_mode = !this.userData.attack_mode;
        attackMode(this);
    }

    /**
     * Move the player with the keyboard (WASD) and confirm the movement with the spacebar
     * @returns {Promise<void>} The promise resolves when the movement is confirmed
     * **/
    async controll() {
        await controllPlayer(this);
    }

    /**
     * @param {number} damage
     * @returns {void}
     */
    receiveDamage(damage) {
        if (!this.userData.current_health) return;

        const remeaningHealth = this.userData.current_health - damage;

        if (remeaningHealth <= 0) this.userData.current_health = 0;
        else this.userData.current_health = remeaningHealth;

        if (this.userData.current_health === 0) this.#death();
    }

    /**
     * @param {number} heal
     * @returns {void}
     */
    receiveHeal(heal) {
        if (!this.userData.current_health) return;
        this.userData.current_health += heal;
        if (
            this.userData.current_health > roleStats[this.userData.role].health
        ) {
            this.userData.current_health = roleStats[this.userData.role].health;
        }
    }

    #death() {
        this.userData.role = "dead";
        console.log("Player is dead");
    }
}

/**
 *  Render a box in the scene
 *  @param {teamType} team The team color
 *  @param {Role} role The role of the player
 *  @param {Object} position The position of the box
 *  @param {number} position.x The x position of the box
 *  @param {number} position.y The y position of the box
 *  @param {number} position.z The z position of the box
 * @returns {Player} The player box
 **/
export function renderPlayerBox(
    team = "blue",
    role = "dps",
    { x = xOrigin, y = yOrigin, z = zOrigin } = {
        x: xOrigin,
        y: yOrigin,
        z: zOrigin,
    }
) {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshPhongMaterial({
        color: team,
    });

    const player = new Player(geometry, material, {
        team,
        role,
        moving: false,
        selector_animation: null,
        current_health: null,
        attack_mode: false,
    });

    player.position.x = x;
    player.position.y = y + 20; // The player is above the terrain to fall
    player.position.z = z;

    // Player can receive shadows
    player.receiveShadow = true;

    // Create the edges of the cube
    const edges = new BoxGeometry(1.1, 1.1, 1.1);

    const materialEdges = new MeshBasicMaterial({
        color: roleColors[role],
        side: BackSide,
    });

    const meshEdges = new Mesh(edges, materialEdges);

    // Add the edges to the cube
    player.add(meshEdges);

    scene.add(player);

    // Normalize the position of the player
    const normalizedX = Math.abs(Math.round(x));
    const normalizedZ = Math.abs(Math.round(z));

    // Get the Y position of the cube in the terrain plus one to spawn the player above the terrain
    const spawnY = Terrain.getMap()[normalizedX][normalizedZ] + 1;

    animate_spawn(player, spawnY, 750).start();

    return player;
}
