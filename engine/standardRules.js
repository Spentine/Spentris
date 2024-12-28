import { gaEventHandler } from "./nextEvent.js";
import { Board, Piece, BoardMino } from "./stackerObjects.js";

/**
 * @param {number} time // number of time to elapse
 */
const update = function (time) {
  
};

/**
 * @param {number} time // number of time to elapse
 * @param {object} inputs // the inputs for the game
 */
const tick = function (time, inputs) {
  
};

/**
 * @param {object} params
 */
const initialize = function (params) {
  params = params ?? {};
  
  this.score = 0;
  this.lines = 0;
  this.board = new Board(
    params.width ?? 10,
    params.height ?? 40
  );
  this.nextQueue = [];
  this.rng = this.lehmerRNG(params.seed ?? 0);
  
  this.generateNext("7-bag");
  
  this.currentPiece = null;
  this.spawnPiece(this.nextQueue.shift());
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
      if (row[j].type) {
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
  
  return true;
};

/**
 * @param {number} seed
 * @returns {object}
 */
const lehmerRNG = function(seed) {
  // https://github.com/Poyo-SSB/tetrio-bot-docs/blob/master/Piece_RNG.md
  let t = seed % 2147483647;

  if (t <= 0) {
      t += 2147483646;
  }

  return {
      next: function () {
          return t = 16807 * t % 2147483647;
      },
      nextFloat: function () {
          return (this.next() - 1) / 2147483646;
      },
      shuffleArray: function (array) {
          if (array.length == 0) {
              return array;
          }

          for (let i = array.length - 1; i != 0; i--) {
              const r = Math.floor(this.nextFloat() * (i + 1));
              [array[i], array[r]] = [array[r], array[i]];
          }

          return array;
      }
  }
}

/**
 * @param {string} mode
 */
const generateNext = function(mode) {
  if (mode === "7-bag") {
    this.nextQueue.push(...this.rng.shuffleArray(["Z", "L", "O", "S", "I", "J", "T"]));
  }
};

// super rotation system
const SRS = function(piece, board) {
  
}


const rotationSystem = function(piece, board) {
  return SRS(piece, board);
}

/**
 * @param {string} piece
 * @param {object} settings
 * @param {object} settings.position
 * @param {number} settings.rotation
 * @returns {boolean} whether the piece was successfully spawned
 */
const spawnPiece = function(piece, settings) {
  settings = settings ?? {};
  const newPiece = new Piece({
    type: piece,
    position: settings.position ?? {x: 3, y: 22},
    rotation: settings.rotation ?? 0,
  });
  
  if (!validPiecePosition(newPiece, this.board)) {
    return false;
  }
  
  this.currentPiece = newPiece;
  
  return true;
}

// all the functions to export
const functions = [update, tick, initialize, lehmerRNG, validPiecePosition, generateNext, spawnPiece];

// create a map from string to function using their name
const standardFunctions = {};
for (let fn of functions) {
  standardFunctions[fn.name] = fn;
}

export { standardFunctions, values };