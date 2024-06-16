export default class Debouncer {
    #timeout;

    constructor() {
        this.#timeout = null;
    }

    debounce(callback, delay) {
        clearTimeout(this.#timeout);
        this.#timeout = setTimeout(callback, delay);
    }
}
