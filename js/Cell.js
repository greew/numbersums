export default class {
    /** @type {?boolean} */
    #status = null;
    /** @type {number} */
    #value;
    /** @type {HTMLTableDataCellElement} */
    #element;

    constructor(value, element) {
        this.#value = value;
        this.#element = element;
    }

    get value() {
        return this.#value;
    }

    get remove() {
        return this.#status === false;
    }

    get selected() {
        return this.#status === true;
    }

    setRemove() {
        this.#status = false;
        this.#element.classList.toggle('removed', true);
    }

    setSelected() {
        this.#status = true;
        this.#element.classList.toggle('selected', true);
    }

    restart() {
        this.#status = null;
        this.#element.classList.toggle('removed', false);
        this.#element.classList.toggle('selected', false);
    }
}
