import { Mesh } from "three";


/** @implements  */
export class Cube extends Mesh {

    /** @type {string} */
    cube_type

    getType() {
        this.userData.cube_type
    }

    /** @type {Cube} */
    userData

}