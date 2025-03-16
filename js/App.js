import Grid from "./Grid.js";
import Rules from "./Rules.js";

class App {
    static minSize = 3;
    static maxSize = 8;

    /** @type {number} */
    #gridSize;

    /** @type {Grid} */
    #grid;

    /** @type {HTMLInputElement} */
    #gridSizeElement;
    /** @type {HTMLButtonElement} */
    #createGridBtn;
    /** @type {HTMLTableElement} */
    #gridTable;
    /** @type {HTMLButtonElement} */
    #runRulesBtn;
    /** @type {HTMLButtonElement} */
    #runRestartBtn;
    /** @type {HTMLButtonElement} */
    #runClearBtn;
    /** @type {HTMLButtonElement} */
    #showAboutBtn;


    constructor() {
        // --- Setup elements ---
        this.#gridSizeElement = document.getElementById('gridSize')
        this.#createGridBtn = document.getElementById('createGridBtn');
        this.#gridTable = document.getElementById('grid');
        this.#runRulesBtn = document.getElementById('runRulesBtn');
        this.#runRestartBtn = document.getElementById('runRestartBtn');
        this.#runClearBtn = document.getElementById('runClearBtn');
        this.#showAboutBtn = document.getElementById('showAboutBtn');

        // --- Setup listeners ---

        // The 'Create grid' button
        this.#createGridBtn.addEventListener('click', this.#createGrid.bind(this));

        // The input elements in the table
        this.#gridTable.addEventListener('input', this.#checkForReady.bind(this));

        // The calculate line buttons
        this.#gridTable.addEventListener('click', event => {
            const target = event.target;
            if (target.tagName === 'BUTTON') {
                const lineType = target.dataset.lineType;
                const lineIndex = parseInt(target.dataset.lineIndex);
                const line = lineType === 'col' ? this.#grid.cols[lineIndex] : this.#grid.rows[lineIndex];
                Rules.runForLine(line);
            }
        });

        // The 'Solve' button
        this.#runRulesBtn.addEventListener('click', () => Rules.run(this.#grid));

        // The 'Restart' button
        this.#runRestartBtn.addEventListener('click', () => {
            this.#grid.cols.forEach((col) => col.restart());
            this.#grid.rows.forEach((row) => row.restart());
        });
    }

    #createGrid() {
        const size = parseInt(this.#gridSizeElement.value) || 0;
        if (size < App.minSize || size > App.maxSize) {
            alert(`Grid size must be between ${App.minSize} and ${App.maxSize}`);
            return;
        }

        this.#gridTable.classList.add('started');

        this.#gridSize = size;

        this.#gridTable.innerHTML = '';

        const colTr = document.createElement('tr');
        colTr.appendChild(this.#getCell('empty'));
        for (let i = 0; i < size; i++) {
            colTr.appendChild(this.#getCell('result'));
        }
        colTr.appendChild(this.#getCell('empty'));

        this.#gridTable.appendChild(colTr);

        for (let y = 0; y < size; y++) {
            const tr = document.createElement('tr');

            tr.appendChild(this.#getCell('result'));

            for (let x = 0; x < size; x++) {
                tr.appendChild(this.#getCell('cell', x, y));
            }
            tr.appendChild(this.#getCell('calc', undefined, y));
            this.#gridTable.appendChild(tr);
        }

        const rowTr = document.createElement('tr');
        rowTr.appendChild(this.#getCell('empty'));
        for (let i = 0; i < size; i++) {
            rowTr.appendChild(this.#getCell('calc', i));
        }
        rowTr.appendChild(this.#getCell('empty'));
        this.#gridTable.appendChild(rowTr);
    }

    #getCell(type, x, y) {
        const cell = document.createElement('td');
        if (x !== undefined && y !== undefined) {
            cell.dataset.x = x;
            cell.dataset.y = y;
        }

        if (type === 'empty') {
            return cell;
        }

        if (type === 'calc') {
            const btn = document.createElement('button');
            btn.textContent = '\u{1F5A9}';
            btn.classList.add('btn');
            btn.classList.add('btn-outline-primary');

            const isCol = y === undefined;
            btn.dataset.lineType = isCol ? 'col' : 'row';
            btn.dataset.lineIndex = isCol ? x : y;

            cell.appendChild(btn);
            cell.classList.add('calc');
            return cell;
        }

        const input = document.createElement('input');
        input.type = 'number';
        input.tabIndex = 0;
        if (type === 'cell') {
            input.min = '1';
            input.max = '9';
        } else if (type === 'result') {
            input.min = '1';
            input.max = (this.#gridSize * 9) + '';
        }
        cell.appendChild(input);

        if (type) {
            cell.classList.add(type);
        }

        return cell;
    }

    #checkForReady(event) {
        const target = event.target;

        // Ensure that the value is within the min and max values
        if (target.tagName === 'INPUT') {
            const val = parseInt(target.value);
            if (val < target.min || val > target.max) {
                event.target.value = '';
            }
        }

        // Check if all inputs have a value
        const cells = Array.from(this.#gridTable.querySelectorAll('input'));
        let ready = cells.every(cell => cell.value);

        if (ready) {
            this.#grid = new Grid(this.#gridTable, this.#gridSize);
        }

        this.#gridTable.classList.toggle('ready', ready);
        this.#runRulesBtn.disabled = !ready;
        this.#runRestartBtn.disabled = !ready;
    }
}

export default App;
