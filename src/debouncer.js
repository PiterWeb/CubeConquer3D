export default class Debouncer {
    /** @type {number | undefined} */
    #timeout;

    constructor() {
        this.#timeout = undefined;
    }

    /**
     * 
     * @param {Function} callback
     * @param {number} delay
     */
    debounce(callback, delay) {
        clearTimeout(this.#timeout);
        this.#timeout = setTimeout(callback, delay);
    }
}
