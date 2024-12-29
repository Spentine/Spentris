import { gaEventHandler } from "./nextEvent.js";
import { Board, Piece, BoardMino } from "./stackerObjects.js";
import { SRSData } from "./rsData.js";

/**
 * @param {number} time // number of time to elapse
 */
const update = function(time) {
  // if the left and right key isn't pressed
  // then set the arr data to be 0 speed, 0 offset
  this.gaEventHandler.override({
    
  });
};

/**
 * @param {number} time // number of time to elapse
 * @param {object} inputs // the inputs for the game
 */
const tick = function(time, inputs) {
  
};

/**
 * @param {object} params
 */
const initialize = function(params) {
  // get parameters
  params = params ?? {};
  
  // set basic information
  this.score = 0;
  this.lines = 0;
  this.time = 0; // Date.now() - this.startTime
  this.startTime = Date.now();
  
  // create the board
  this.board = new Board(
    params.width ?? 10,
    params.height ?? 40
  );
  
  // create the next queue
  this.nextQueue = [];
  
  // the minimum number of pieces in the queue at once
  this.refillQueue = params.refillQueue ?? 5;
  
  // create the random number generator
  this.rng = this.lehmerRNG(params.seed ?? 0);
  
  // generate the first 7 pieces
  this.generateNext("7-bag");
  
  // spawn the first piece
  this.currentPiece = null;
  this.spawnPiece(this.nextQueue.shift());
  
  // persistent gaEventHandler values
  this.gaEventHandler = new gaEventHandler(0, 0, 0, 0, 0);
  
  // softdrop flag
  this.softDropFlag = false;
  
  // left and right input time
  // only used for DAS and ARR
  this.leftInput = null;
  this.rightInput = null;
  
  // create hold piece
  this.hold = {
    piece: null,
    allowed: true,
  };
  
  // create the current piece lockdown
  this.currentPieceLockdown = 0;
  
  window.game = this;
};

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
};

/**
 * @param {string} mode
 */
const generateNext = function(mode) {
  if (mode === "7-bag") {
    this.nextQueue.push(...this.rng.shuffleArray(["Z", "L", "O", "S", "I", "J", "T"]));
  }
};

/**
 * checks for line clears
 * @param {Board} board
 * @returns {number} the number of lines cleared
 */
const clearLines = function(board) {
  var lineClears = 0;
  
  for (let i=0; i<board.matrix.length; i++) {
    if (board.matrix[i].every(mino => mino.type)) {
      board.matrix.splice(i, 1);
      lineClears++;
      i--;
    }
  }
  
  for (let i=0; i<lineClears; i++) {
    board.matrix.push(new Array(board.width).fill(new BoardMino()));
  }
  
  return lineClears;
};

/**
 * uses the Super Rotation System to rotate the piece
 * calculates the piece position after rotation
 * @param {Piece} piece
 * @param {Board} board
 * @param {number} newRotation
 * @returns {boolean} whether the piece was successfully rotated
 */
const SRS = function(piece, board, newRotation) {
  const previousRotation = piece.rotation;
  
  // copy the piece with new rotation
  const newPiece = piece.copy({
    rotation: newRotation,
  });
  
  // retrieve kick data
  const kicks = SRSData.kicks[piece.type][previousRotation][newRotation];
  
  // loop over kick data
  for (let kick of kicks) {
    // apply kick
    newPiece.position.x += kick.x;
    newPiece.position.y += kick.y;
    
    if (validPiecePosition(newPiece, board)) {
      piece.position = newPiece.position;
      piece.rotation = newPiece.rotation;
      piece.updateMatrix();
      
      return true;
    }
    
    // undo kick
    newPiece.position.x -= kick.x;
    newPiece.position.y -= kick.y;
  }
  
  return false;
};


const rotationSystem = function(data) {
  // function forwarder
  return SRS(
    data.piece,
    data.board,
    data.newRotation
  );
};

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
};

/**
 * will refill the next queue when appropriate
 */
const refillNextQueue = function() {
  if (this.nextQueue.length < this.refillQueue) {
    this.generateNext("7-bag");
  }
};

/**
 * Modifies piece in place.
 * 
 * @param {Piece} piece
 * @param {object} direction
 * @param {Board} board
 * 
 * @returns {boolean} whether the piece was successfully moved
 */
const movePiece = function(piece, direction, board) {
  piece.position.x += direction.x;
  piece.position.y += direction.y;
  
  if (!validPiecePosition(piece, board)) {
    piece.position.x -= direction.x;
    piece.position.y -= direction.y;
    
    return false;
  }
  
  return true;
};

/**
 * @param {Piece} piece
 * @param {Board} board
 */
const placePiece = function(piece, board) {
  // change the board matrix to reflect the piece placement
  for (let i=0; i<piece.matrix.length; i++) {
    const row = piece.matrix[i];
    for (let j=0; j<row.length; j++) {
      const pMino = row[j] // piece mino
      if (pMino.type) {
        const x = piece.position.x + j;
        const y = piece.position.y + i;
        
        const bMino = board.matrix[y][x]; // board mino
        bMino.type = pMino.type;
        bMino.texture = pMino.texture;
      }
    }
  }
  
  // clear lines
  this.clearLines(this.board);
  
  // spawn piece
  this.spawnPiece(this.nextQueue.shift());
  
  this.refillNextQueue();
  
  // make hold piece available
  this.hold.allowed = true;
};

/**
 * @returns {boolean} whether the piece was successfully moved
 */
const moveLeft = function() {
  if (!this.currentPiece) return false;
  
  const movement = movePiece(this.currentPiece, {x: -1, y: 0}, this.board);
  if (!movement) {
    this.gaEventHandler.arrPriority = true;
    return false;
  }
  
  return true;
};

/**
 * @returns {boolean} whether the piece was successfully moved
 */
const moveRight = function() {
  if (!this.currentPiece) return false;
  
  const movement = this.movePiece(this.currentPiece, {x: 1, y: 0}, this.board);
  if (!movement) {
    this.gaEventHandler.arrPriority = true;
    return false;
  }
  
  
  return true;
};

/**
 * doesn't do anything at the moment
 */
const softDrop = function() {
  // temprary
  let movement = true;
  while (movement) {
    movement = this.movePiece(this.currentPiece, {x: 0, y: -1}, this.board);
  }
};

/**
 * hard drops the piece
 */
const hardDrop = function() {
  let movement = true;
  while (movement) {
    movement = this.movePiece(this.currentPiece, {x: 0, y: -1}, this.board);
  }
  
  this.placePiece(this.currentPiece, this.board);
};

/**
 * @param {number} newRotation
 * @returns {boolean} whether the piece was successfully rotated
 */
const rotate = function(newRotation) {
  if (!this.currentPiece) return false;
  
  const rotation = rotationSystem({
    piece: this.currentPiece,
    board: this.board,
    newRotation: newRotation,
  });
  
  return rotation;
}

/**
 * 
 */
const holdPiece = function() {
  if (!this.hold.allowed) return false;
  
  if (!this.hold.piece) {
    this.hold.piece = this.currentPiece.type;
    this.spawnPiece(this.nextQueue.shift());
    this.refillNextQueue();
  } else {
    // swap hold and current piece
    const temp = this.currentPiece.type;
    this.spawnPiece(this.hold.piece, {rotation: 0});
    this.hold.piece = temp;
  }
  
  this.hold.allowed = false;
  return true;
};

// inputs

const moveLeftInputDown = function() {
  this.moveLeft();
  this.leftInput = Date.now() - this.startTime;
};

const moveLeftInputUp = function() {
  this.leftInput = null;
};

const moveRightInputDown = function() {
  this.moveRight();
  this.rightInput = Date.now() - this.startTime;
};

const moveRightInputUp = function() {
  this.rightInput = null;
};

const softDropInputDown = function() {
  this.softDrop();
  this.softDropFlag = true;
};

const softDropInputUp = function() {
  this.softDropFlag = false;
};

const hardDropInputDown = function() {
  this.hardDrop();
};

const hardDropInputUp = function() {
  // Don't do anything at the moment
};

const rotateCWInputDown = function() {
  const newRotation = (this.currentPiece.rotation + 1) % 4;
  this.rotate(newRotation);
};

const rotateCWInputUp = function() {
  // Don't do anything
};

const rotateCCWInputDown = function() {
  const newRotation = (this.currentPiece.rotation + 3) % 4;
  this.rotate(newRotation);
};

const rotateCCWInputUp = function() {
  // Don't do anything
};

const rotate180InputDown = function() {
  const newRotation = (this.currentPiece.rotation + 2) % 4;
  this.rotate(newRotation);
};

const rotate180InputUp = function() {
  // Don't do anything
};

const holdPieceInputDown = function() {
  this.holdPiece();
};

const holdPieceInputUp = function() {
  // Don't do anything
};

// all the functions to export
const functions = [
  update,
  tick,
  initialize,
  
  lehmerRNG,
  
  validPiecePosition,
  generateNext,
  clearLines,
  spawnPiece,
  refillNextQueue,
  
  movePiece,
  placePiece,
  
  moveLeft,
  moveRight,
  softDrop,
  hardDrop,
  rotate,
  holdPiece,
  
  // input functions
  moveLeftInputDown,
  moveLeftInputUp,
  moveRightInputDown,
  moveRightInputUp,
  softDropInputDown,
  softDropInputUp,
  hardDropInputDown,
  hardDropInputUp,
  rotateCWInputDown,
  rotateCWInputUp,
  rotateCCWInputDown,
  rotateCCWInputUp,
  rotate180InputDown,
  rotate180InputUp,
  holdPieceInputDown,
  holdPieceInputUp,
];

// create a map from string to function using their name
const standardFunctions = {};
for (let fn of functions) {
  standardFunctions[fn.name] = fn;
}

export { standardFunctions, values };