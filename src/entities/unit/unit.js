import { Mesh, BoxGeometry, MeshPhongMaterial } from 'three';
import { Tween } from '@tweenjs/tween.js';
/**
 * @import {teamType} from "@/game/teamController"
 * @import { color as Color } from "@/entities/unit/color"
 * @import IUnit from "@/entities/interfaces/IUnit"
 */

/**
 * @class Unit - A class to represent a unit in the scene
 * @extends Mesh
 * @implements {IUnit}
 */
export class Unit extends Mesh {

    static #MAX_HEALTH = 250;

    /**
     * @param {BoxGeometry} geometry
     * @param {MeshPhongMaterial} material
     * @param {Object} userData
     * @param {boolean} userData.dead
     * @param {teamType} userData.team
     * @param {Color} userData.color
     * @param {boolean} userData.moving
     * @param {Tween<any>?} userData.selector_animation
     * @param {number?} userData.current_health
     * @param {boolean} userData.attack_mode
     */
    constructor(geometry, material, userData) {
        super(geometry, material);
        this.userData = userData;
        if (this.userData.current_health === null) {
            this.userData.current_health = Unit.#MAX_HEALTH;
        }
    }
    stop() {
        throw new Error('Method not implemented.');
    }

    /**
     * @returns {boolean}
     */
    isMoving() {
        throw new Error('Method not implemented.');
    }

    /**
     * @returns {boolean}
     * 
     * */
    isFalling() {
        throw new Error('Method not implemented.');
    }
    /**
     * @returns {number}
     */
    get health() {
        throw new Error('Method not implemented.');
    }

    /**
     * @param {number} newHealth
     * @returns {void}
     */
    set health(newHealth) {
        throw new Error('Method not implemented.');
    }

    /**
     * 
     * @param {string} targetID 
     * @param {number} damage 
     */
    attack(targetID, damage) {
        throw new Error('Method not implemented.');
    }

    /**
     * 
     * @param {number} healthCure 
     */
    cure(healthCure) {
        throw new Error('Method not implemented.');
    }

    /**
     * 
     * @param {number} damage 
     */
    receiveDamage(damage) {
        throw new Error('Method not implemented.');
    }

    /**
     *  @returns {boolean}
     */
    isDead() {
        throw new Error('Method not implemented.');
    }

    /**
    * @param {number} x
    * @param {number} y
    * @returns {void}
    *  
    */
    move(x, y) {

    }

}