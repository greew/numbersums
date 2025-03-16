import Grid from './Grid.js';
import Cell from './Cell.js';
import Line from './Line.js';

class Rules {

    /**
     * @param {Grid} grid
     */
    static run(grid) {
        let checksum = '';
        while (checksum !== grid.getChecksum()) {
            checksum = grid.getChecksum();
            grid.lines.forEach(Rules.runForLine);
        }
    }

    /**
     * @param {Line} line
     */
    static runForLine(line) {
        if (line.done) {
            return;
        }

        // Create a list of all possible combinations of non-removed and non-selected cells where the sum of the values match the result
        const combinations = Rules.getAllCellCombinationsThatMatchesTheRemainingResult(line);

        // If only one of the combinations match the remaining result, that combination will be the only
        // possibility left, and we will select all the cells in that combination and remove all other cells
        if (combinations.length === 1) {
            combinations[0].forEach(cell => cell.setSelected());
        } else if (combinations.length > 1) {
            // Else, more than one combination match the remaining result

            // For each cell in the line
            line.cells
                .forEach(cell => {
                    // If the cell is present in all the combinations, we can be sure that it is part of the solution
                    if (combinations.every(set => set.includes(cell))) {
                        cell.setSelected();
                    } else if (!cell.selected && !combinations.some(set => set.includes(cell))) {
                        // If the cell has not previously been selected and is not present in any of the combinations,
                        // we can be sure that it is not part of the solution
                        cell.setRemove();
                    }
                });
        }

        line.checkResult();
    }

    /**
     * Given a line, return all possible combinations of the cells in the line
     * where the sum of the values match the remaining result
     *
     * @param {Line} line
     * @returns {Cell[][]}
     */
    static getAllCellCombinationsThatMatchesTheRemainingResult(line) {
        // Create a list of all possible combinations of non-removed and non-selected cells
        return Rules.getCombinations(line.getRemainingCells())
            // Create a list of all possible combinations of non-removed and non-selected cells
            // together with the sum of their values
            .map(combination => [combination, combination.reduce((acc, cell) => acc + cell.value, 0)])
            // Find all combinations where the sum of the combinations match the remaining result
            .filter(set => set[1] === line.getSumRemaining())
            // Return the combinations
            .map(set => set[0]);
    }

    /**
     * Given an array, return all possible combinations of the elements in the array
     *
     * @param {Array} array
     * @returns {Array<Array<int>>}
     */
    static getCombinations(array) {
        const result = [];

        const f = (prefix, array) => {
            for (let i = 0; i < array.length; i++) {
                result.push(prefix.concat(array[i]));
                f(prefix.concat(array[i]), array.slice(i + 1));
            }
        };

        f([], array);

        return result;
    }
}

export default Rules;
