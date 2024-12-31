import { gaEventHandler } from "./nextEvent.js";
import { Board, Piece, BoardMino } from "./stackerObjects.js";
import { SRSData } from "./rsData.js";

/**
 * updates the game state from (a, b] where a is the previous time and b is the current time
 * @param {number} tDelta // number of time to elapse
 * @param {object} iter // the number of iterations
 */
const update = function(tDelta, iter=0) {
  // TODO: make sure the lock delay works because i'm not completely sure if i did it properly
  
  // if tDelta is null then calculate it with Date.now();
  tDelta = tDelta ?? Date.now() - this.startTime - this.time;
  
  // update time
  const endTime = this.time + tDelta;
  const beginningTime = this.time;
  
  const overrides = {
    time: beginningTime,
  }
  
  var arrDirection = null;
  if (!this.leftInput && !this.rightInput) {
    // if the left and right key isn't pressed don't regard arr
    overrides.arrSpeed = Infinity;
    overrides.arrOffset = 0;
    this.gaEventHandler.arrPriority = false;
  } else {
    // calculate the arr values
    overrides.arrSpeed = this.state.arr;
    
    // prioritize the later input
    if (this.leftInput && this.rightInput) {
      if (this.leftInput > this.rightInput) {
        overrides.arrOffset = this.leftInput;
        arrDirection = -1;
      } else {
        overrides.arrOffset = this.rightInput;
        arrDirection = 1;
      }
    } else if (this.leftInput) {
      overrides.arrOffset = this.leftInput;
      arrDirection = -1;
    } else if (this.rightInput) {
      overrides.arrOffset = this.rightInput;
      arrDirection = 1;
    }
    
    // add das
    overrides.arrOffset += this.state.das;
  }
  
  // gravity
  this.gaEventHandler.gravSpeed = this.gravity;
  
  // override values
  this.gaEventHandler.override(overrides);
  
  var touchingGround = this.isTouchingGround(this.currentPiece, this.board);
  
  if (!touchingGround) {
    this.currentPieceLockdown = 0;
  }
  
  var pieceLockedDown = false;
  
  // handle gravity and arr
  var nextEvent = this.gaEventHandler.next();
  var lastTime = beginningTime;
  
  let maxIterations = 100;
  while (endTime >= nextEvent.time) {
    if (nextEvent.action === "finish") {
      break;
    }
    
    if (touchingGround) {
      // add the difference in time to the current piece lockdown
      this.currentPieceLockdown += nextEvent.time - beginningTime;
      
      // check if the piece locks in place
      if (this.currentPieceLockdown >= this.lockDelay) {
        pieceLockedDown = true;
        break;
      }
    }
    
    lastTime = nextEvent.time;
    if (nextEvent.action === "gravity") {
      // move down once
      const movement = this.movePiece(
        this.currentPiece,
        {x: 0, y: -1},
        this.board
      );
      
      // properly decide next event
      if (movement) {
        nextEvent = this.gaEventHandler.next();
        this.currentPieceLockdown = 0;
        touchingGround = false;
      } else {
        nextEvent = this.gaEventHandler.skip();
        touchingGround = true;
      }
    } else if (nextEvent.action === "arr") {
      // move in the correct direction once
      const movement = this.movePiece(
        this.currentPiece,
        {x: arrDirection, y: 0},
        this.board
      );
      
      // properly decide next event
      if (movement) {
        nextEvent = this.gaEventHandler.next();
        this.currentPieceLockdown = 0;
      } else {
        nextEvent = this.gaEventHandler.skip();
      }
      touchingGround = this.isTouchingGround(this.currentPiece, this.board);
    }
    
    maxIterations--;
    if (maxIterations <= 0) {
      console.error("max iterations reached");
      break;
    }
  }
  
  this.time = lastTime;
  
  if (touchingGround) {
    const elapsedTime = Math.min(
      endTime - lastTime,
      this.lockDelay - this.currentPieceLockdown
    );
    
    // add the difference in time to the current piece lockdown
    this.currentPieceLockdown += elapsedTime;
    this.time += elapsedTime;
    
    // check if the piece locks in place
    if (this.currentPieceLockdown >= this.lockDelay) {
      pieceLockedDown = true;
    }
  }
  
  if (pieceLockedDown) {
    const placement = this.placePiece(this.currentPiece, this.board);
    
    if (placement) {
      if (this.time !== endTime) {
        if (iter > 10) {
          console.error("too many iterations");
        } else {
          this.update(endTime - this.time, iter+1);
        }
      }
    }
  }
  
  this.time = endTime;
};

/**
 * @param {number} tDelta // number of time to elapse
 * @param {object} inputs // the inputs for the game
 */
const tick = function(tDelta, inputs) {
  
};

/**
 * @param {object} params
 */
const initialize = function(params) {
  // get parameters
  params = params ?? {};
  
  // set beginning game state data (constant)
  this.state = params.state ?? {
    // delayed auto shift
    das: 83, // ms
    
    // auto repeat rate
    arr: 0, // ms
    
    // soft drop factor
    sdf: Infinity, // gravity is multiplied by this
    // well it's actually divided by this, but it's easier to think of it as multiplication
    
    // minimum sdf gravity
    msg: 1000, // min ms / block for sdf
    
    // gravity
    gravity: Infinity, // ms / block
    
    // lock delay
    lockDelay: 500, // ms
  };
  
  this.gravity = this.state.gravity;
  this.lockDelay = this.state.lockDelay;
  
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
  
  // debug
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
 * @param {Piece} piece
 * @param {Board} board
 * @returns {boolean}
 */
const isTouchingGround = function(piece, board) {
  let touching = false;
  // test position
  if (!this.movePiece(piece, {x: 0, y: -1}, board)) {
    touching = true;
  } else {
    // move piece back
    piece.position.y++;
  }
  return touching;
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
    const newRow = [];
    for (let j=0; j<board.width; j++) {
      newRow.push(new BoardMino());
    }
    board.matrix.push(newRow);
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
    position: settings.position ?? (
      piece === "O" ? {x: 4, y: 22} : {x: 3, y: 22}
    ),
    rotation: settings.rotation ?? 0,
  });
  
  if (!validPiecePosition(newPiece, this.board)) {
    return false;
  }
  
  this.currentPiece = newPiece;
  this.currentPieceLockdown = 0;
  
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
 * @returns {boolean} whether the next piece was successfully spawned
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
  const spawn = this.spawnPiece(this.nextQueue.shift());
  
  this.refillNextQueue();
  
  // make hold piece available
  this.hold.allowed = true;
  
  return spawn;
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
  
  this.currentPieceLockdown = 0;
  
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
  
  this.currentPieceLockdown = 0;
  
  return true;
};

/**
 * doesn't do anything at the moment
 */
const softDrop = function() {
  // temporary
  /*
  let movement = true;
  while (movement) {
    movement = this.movePiece(this.currentPiece, {x: 0, y: -1}, this.board);
  }
  */
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
  
  if (rotation) {
    this.currentPieceLockdown = 0;
  }
  
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

const moveLeftInputDown = function(time) {
  this.update();
  this.moveLeft();
  this.leftInput = Date.now() - this.startTime;
};

const moveLeftInputUp = function() {
  this.update();
  this.leftInput = null;
};

const moveRightInputDown = function() {
  this.update();
  this.moveRight();
  this.rightInput = Date.now() - this.startTime;
};

const moveRightInputUp = function() {
  this.update();
  this.rightInput = null;
};

const softDropInputDown = function() {
  this.update();
  this.softDrop();
  this.softDropFlag = true; // unsure if this is needed
  this.gravity = Math.min(this.state.msg, this.gravity) / this.state.sdf;
};

const softDropInputUp = function() {
  this.update();
  this.softDropFlag = false;
  this.gravity = this.state.gravity;
};

const hardDropInputDown = function() {
  this.update();
  this.hardDrop();
};

const hardDropInputUp = function() {
  // Don't do anything at the moment
};

const rotateCWInputDown = function() {
  this.update();
  const newRotation = (this.currentPiece.rotation + 1) % 4;
  this.rotate(newRotation);
};

const rotateCWInputUp = function() {
  // Don't do anything
};

const rotateCCWInputDown = function() {
  this.update();
  const newRotation = (this.currentPiece.rotation + 3) % 4;
  this.rotate(newRotation);
};

const rotateCCWInputUp = function() {
  // Don't do anything
};

const rotate180InputDown = function() {
  this.update();
  const newRotation = (this.currentPiece.rotation + 2) % 4;
  this.rotate(newRotation);
};

const rotate180InputUp = function() {
  // Don't do anything
};

const holdPieceInputDown = function() {
  this.update();
  this.holdPiece();
};

const holdPieceInputUp = function() {
  // Don't do anything
};

// supplementary functions

/**
 * calculate the ghost piece position
 * @param {Piece} piece
 * @param {Board} board
 * @returns {object} the ghost piece position
 */
const calculateGhostPiece = function(piece, board) {
  const ghostPiece = piece.copy();
  
  let movement = true;
  while (movement) {
    movement = movePiece(ghostPiece, {x: 0, y: -1}, board);
  }
  
  return ghostPiece;
}

// all the functions to export
const functions = [
  update,
  tick,
  initialize,
  
  lehmerRNG,
  
  validPiecePosition,
  isTouchingGround,
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
  
  // supplementary functions
  calculateGhostPiece,
];

// create a map from string to function using their name
const standardFunctions = {};
for (let fn of functions) {
  standardFunctions[fn.name] = fn;
}

export { standardFunctions, values };