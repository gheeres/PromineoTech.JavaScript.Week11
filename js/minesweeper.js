(function($, undefined) {
  'use strict'

  /**
   * Generates a random number.
   * @param {Number} max The maximum value to include.
   * @returns The random number
   */
  function random(max) {
    return Math.floor(Math.random() * max);
  }

  /**
   * Represents a cell or clicable lcoation in the game.
   */
  class Cell {
    row;
    column;
    status = [];

    /**
     * Creates an instance of the Cell class.
     * @param {HTMLElement} $element 
     */
    constructor($element) {
      this.$el = $element;
      this.row = this.$el.data('row');
      this.column = this.$el.data('column');
    }

    /**
     * Adds a mark to the cell.
     */
    mark() {
      if ((! this.isMarked()) && (! this.isRevealed())) {
        this.status.push('mark');
        this.render();
      }
    }

    /**
     * Removes the mark or flag on the cell.
     */
    unmark() {
      if (this.isMarked()) {
        this.status.pop();
        this.render();
      }
    }

    /**
     * Reveals the specified cell and any adjacent cells that meet criteria.
     * @param {Array.Cell} The collection of cells.
     */
    reveal(cells) {
      if (! this.isRevealed()) {
        this.unmark();
        this.status.push('reveal');

        let adjacentCells = this.getAdjacentCells(cells || []);
        adjacentCells.forEach(cell => {
          if (cell.canReveal(cell.getAdjacentCells(cells || []))) {
            cell.reveal(cells);
          }
        });
        this.render();
      }
    }

    /**
     * Places a mine into the cell.
     * @returns The current instance
     */
    placeMine() {
      this.status.push('mine');
      return this;
    }

    /**
     * Checks to see if the cell contains a mine.
     * @returns {Boolean} True if the cell contains a mine, false if otherwise.
     */
    isMine() {
      return (this.status.length > 0) &&
             (this.status[0] === 'mine');
    }

    /**
     * Checks to see if the cell is marked.
     * @returns {Boolean} True if the cell contains is marked.
     */
    isMarked() {
      return (this.status.length > 0) &&
             (this.status[this.status.length - 1] === 'mark');
    }

    /**
     * Checks to see if the cell is revealed or expanded.
     * @returns {Boolean} True if the cell contains is revealed.
     */
    isRevealed() {
      return (this.status.length > 0) &&
             (this.status[this.status.length - 1] === 'reveal');
    }

    /**
     * Retrieves the current mine count in the adjacent cells.
     * @returns {Number} The number of mines in the adjacent squares
     */
    getAdjacentMineCount() {
      return parseInt(this.status[0], 10) || 0;
    }

    /**
     * Retrieves all of the adjacent cells next to the current cell.
     * @param {Array.Cell} cells The collection of cells.
     * @returns {Array.Cell} The adjacent cells.
     */
    getAdjacentCells(cells) {
      return (cells || []).filter((c) => {
        return ((c !== this) &&
                ((c.row === this.row - 1) || (c.row === this.row) || (c.row === this.row + 1)) &&
                ((c.column === this.column - 1) || (c.column === this.column) || (c.column === this.column + 1)));
      });
    }    

    /**
     * Checks to see if the specified call can be revealed.
     * @param {Array.Cell} adjacentCells The cells immediately surrounding the current cell.
     * @returns {Boolean} True if can be revealed, false if otherwise.
     */
    canReveal(adjacentCells) {
      if ((! this.isMarked()) && (! this.isMine()) && (! this.isRevealed())) {
        if (this.getAdjacentMineCount() === 0) {
          return true;
        }

        return adjacentCells.some((cell) => {
          return (cell.isRevealed() && (cell.getAdjacentMineCount() === 0));
        });
      }
      return false;
    }

    /**
     * Returns the string representation of the object.
     * @returns The string representation of the instance.
     */
    toString() {
      return `[row:${ this.row },col:${ this.column }] => [ ${ this.status.join(',') } ]`;
    }

    /**
     * Simulates a click event on a cell.
     */
    click() {
      if (! this.isRevealed()) {
        if (this.isMarked()) {
          this.unmark();
        }
        else {
          this.mark();
        }
      }
    }

    /**
     * Retrieves the desire icon for the cell based on the current status.
     * @param {Boolean} isGameOver Indicates if the game has ended.
     * @returns {HTMLElement} The icon to use for the cell.
     */
    getIcon(isGameOver) {
      let className = '';
      
      if (this.isMarked()) {
        className = 'bi-flag-fill';
      }
      else if ((isGameOver) && (this.isMine())) {
        className = 'bi-radioactive';
      }
      else {
        let adjacentMineCount = this.getAdjacentMineCount();
        if (adjacentMineCount) {
          className = `bi-${ adjacentMineCount }-circle`;
        }
      }
      
      if (className) {
        return $(`<i class="position-absolute top-50 start-50 translate-middle bi ${ className }"></i>`);
      }
      return null;
    }

    /**
     * Renders or updates the state of the cell.
     * @param {Boolean} isGameOver Indicates if the game has ended.
     * @returns {HTMLElement} The currently rendered cell.
     */
    render(isGameOver) {
      this.$el.empty();
      if (this.isMarked() || this.isRevealed() || isGameOver) {
        let $icon = this.getIcon(isGameOver);
        if ($icon) {
          $icon.appendTo(this.$el);
        }
      }
      if (this.isRevealed() || isGameOver) {
        this.$el.css('background-color', '#fff');
      }
      return this.$el;
    }
  }

  /**
   * The game of minesweeper
   */
  class Game {
    mineCount = 12;
    rows = 10;
    columns = 10;
    cells = [];

    /**
     * Creates an instance of the Game class.
     * @param {HTMLElement} $element 
     */
    constructor($element) {
      this.$el = $element;
      this.initialize();
    }

    /**
     * Initializes the game / cells.
     * @param {Object} options The configured game options.
     */
    initialize(options) {
      const $cells = $('.game-cell', this.$el).toArray();
      $cells.forEach((cell, index) => {
        let $cell = $(cell)
        $cell.empty();

        this.cells.push(new Cell($cell));
      });

      this.#placeMines(this.mineCount);

      // Update mine / adjacent counts.
      this.cells.forEach(cell => {
        if (! cell.isMine()) {
          let adjacentCells = cell.getAdjacentCells(this.cells);
          let mineCount = adjacentCells.reduce((prev,current) => prev + (current.isMine() ? 1 : 0), 0);
          cell.status.push(mineCount);
        }
      });      
    }

    /**
     * Randomly places the mines on the screen.
     * @param {Number} mineCount The desired number of mines.
     * @returns {Object.Cell} The Cell objects that contain mines.
     */
    #placeMines(mineCount) {
      let i = 0;
      let mines = [];
      while ((mines.length < mineCount) && (i < 100)) {
        let mine = {
          row : random(this.rows),
          column: random(this.columns)
        };
        // Find the corresponding mine / cell
        let cell = this.getCell(mine.row, mine.column);
        if (cell) {
          if (! cell.isMine()) {
            mines.push(cell.placeMine());
          }
        }
        i++;
      }
      return mines;
    }

    /**
     * Retrieves the game cell at the specified location.
     * @param {Number} row The row number starting from 1.
     * @param {Number} column The column number starting from 1.
     * @returns {Cell} The instance of Cell if found, otherwise returns null.
     */
    getCell(row, column) {
      return this.cells.find((cell) => (cell.row === row) && (cell.column === column));
    }

    /**
     * Starts handling events for the game.
     */
    start() {
      console.log('Game starting...');
      this.render();
      
      this.$el.on('click', '.game-cell', (e) => {
        const $cell = $(e.target).closest('.game-cell');
        if ($cell.length) {
          let cell = this.getCell($cell.data('row'), $cell.data('column'));
          if (cell) {
            cell.click();
          }
        }
      });
      this.$el.on('dblclick', '.game-cell', (e) => {
        const $cell = $(e.target).closest('.game-cell');
        if ($cell.length) {
          let cell = this.getCell($cell.data('row'), $cell.data('column'));
          if (cell) {
            if (! cell.isMine()) {
              cell.reveal(this.cells);
            }
            else this.gameOver();
          }
        }
      });
    }

    /**
     * Ends the game and reveals all of the cells.
     */
    gameOver() {
      this.cells.forEach((cell,index) => {
        if ((! cell.isMarked()) && (! cell.isRevealed())) {
          cell.reveal();
        }
      });
      this.render(true);
    }

    /**
     * Renders all of the game cells.
     * @param {Boolean} isGameOver Indicates if the game has ended.
     * @returns {HTMLElement} The currently rendered cell.
     */
    render(isGameOver) {
      this.cells.forEach((cell,index) => {
        cell.render(isGameOver);
      });
    }
  }

  $(document).ready(function() {
    const $gameBoard = $('#game-board');

    const game = new Game($gameBoard);
    game.start();
  });
})(jQuery);