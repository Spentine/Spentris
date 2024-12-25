import { gaEventHandler } from "./nextEvent.js";
import { Board, Piece, BoardMino } from "./stackerObjects.js";

/**
  @param {number} time // number of time to elapse
*/
const update = function (time) {
  
};

/**
  @param {number} time // number of time to elapse
  @param {object} inputs // the inputs for the game
*/
const tick = function (time, inputs) {
  
};

/**
  @param {object} params
*/
const initialize = function (params) {
  this.score = 0;
}

const values = {
  update: [
    // variables `update` requires
  ],
  tick: [
    // variables `tick` requires
  ],
  initialize: {
    width: 10,
    height: 40,
    // other stuff
  }
};

/**
 * @param {Piece} piece
 * @param {Board} board
 */
const validPiecePosition = function(piece, board) {
  // loop over piece matrix
  for (let i=0; i<piece.matrix.length; i++) {
    const row = piece.matrix[i];
    for (let j=0; j<row.length; j++) {
      // if this index is a mino
      if (row[j]) {
        // calculate the position of this mino
        const x = piece.position.x + j;
        const y = piece.position.y + i;
        
        // if this mino is out of bounds
        if (
          x < 0 ||
          x >= board.width ||
          y >= board.height ||
          y < 0
        ) {
          return false;
        }
        
        // if this mino is colliding with a board mino
        if (board.matrix[y][x].type) {
          return false;
        }
      }
    }
  }
};

// all the functions to export
const functions = [update, tick, initialize, validPiecePosition];

// create a map from string to function using their name
const standardFunctions = {};
for (let fn of functions) {
  standardFunctions[fn.name] = fn;
}

export { standardFunctions, values };