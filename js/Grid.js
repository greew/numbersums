import Line from "./Line.js";
import Cell from "./Cell.js";

export default class {
    /** @type {number} */
    #gridSize = 0;

    /** @type {Array<Line>} */
    #rows = [];

    /** @type {Array<Line>} */
    #cols = [];

    /** @type {HTMLElement} */
    #gridTable = null;

    /**
     *
     * @param {HTMLTableElement} tableElement
     * @param {number} gridSize
     */
    constructor(tableElement, gridSize) {
        this.#gridTable = tableElement;
        this.#gridSize = gridSize;

        for (let i = 0; i < this.#gridSize; i++) {
            const rowCell = this.#gridTable.children[i + 1].children[0];
            this.#rows.push(new Line(rowCell));

            const colCell = this.#gridTable.children[0].children[i + 1];
            this.#cols.push(new Line(colCell));
        }

        for (let i = 0; i < this.#gridSize; i++) {
            const cells = this.#gridTable.children[i + 1].children;
            for (let j = 0; j < this.#gridSize; j++) {
                const el = cells[j + 1];
                const cell = new Cell(parseInt(el.children[0].value), el);
                this.#rows[i].cells.push(cell);
                this.#cols[j].cells.push(cell);
            }
        }
    }

    get rows() {
        return this.#rows;
    }

    get cols() {
        return this.#cols;
    }

    get lines() {
        return this.#rows.concat(this.#cols);
    }

    getChecksum() {
        return this.#rows.reduce((acc, rows) => acc + rows.cells.reduce((acc, cell) => {
            const status = [cell.remove ? 1 : 0, cell.selected ? 1 : 0].join('');
            return acc + status;
        }, ''), '');
    }
}
