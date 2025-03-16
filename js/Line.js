import Cell from "./Cell.js";

export default class {
    /** @type {HTMLInputElement} */
    #element;
    /** @type {Array<Cell>} */
    cells = [];
    /** @type {number} */
    #result = 0;
    /** @type {boolean} */
    #done = false;

    constructor(element) {
        this.#element = element;
        this.#result = parseInt(this.#element.children[0].value);
    }

    get done() {
        return this.#done;
    }

    get result() {
        return this.#result;
    }

    #getSumSelected() {
        return this.cells
            .reduce((acc, cell) =>
                cell.selected
                    ? acc + cell.value
                    : acc, 0);
    }

    checkResult() {
        if (this.#getSumSelected() === this.#result) {
            this.#done = true;
            this.#element.classList.add('done');
            this.cells.forEach(cell => {
                if (!cell.selected) {
                    cell.setRemove();
                }
            });
        }
    }

    /** @returns {Cell[]} */
    getRemainingCells() {
        return this.cells.filter(cell => !cell.remove && !cell.selected);
    }

    /** @returns {number} */
    getSumRemaining() {
        return this.#result - this.#getSumSelected();
    }

    /** @returns void */
    restart() {
        this.#done = false;
        this.#element.classList.remove('done');
        this.cells.forEach(cell => cell.restart());
    }
}
