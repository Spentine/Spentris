import { functionMap } from "../util.js";

/**
 * immobility rule for all spin
 * @param {Piece} piece
 * @param {Board} board
 * @returns {boolean} whether it is a spin
 */
const immobilityRule = function(piece, board) {
  // check if the piece can't move (up), down, left, or right
  
  const directionChecks = [
    {x: 0, y: 1}, // up
    {x: 0, y: -1}, // down
    {x: -1, y: 0}, // left
    {x: 1, y: 0}, // right
  ];
  
  for (const direction of directionChecks) {
    piece.position.x += direction.x;
    piece.position.y += direction.y;
    
    const validPosition = this.validPiecePosition(piece, board);
    
    piece.position.x -= direction.x;
    piece.position.y -= direction.y;
    
    if (validPosition) {
      return false;
    }
  }
  
  return true;
};

/**
 * all-mini ruleset
 * @param {Piece} piece
 * @param {Board} board
 * @returns {string | null} the type of spin or null if it isn't a spin
 */
const isMiniSpin = function(piece, board) {
  if (piece.type === "T") {
    return this.isTspin(piece, board);
  } else {
    const immobile = this.immobilityRule(piece, board);
    return immobile ? "mini" : null;
  }
};

/**
 * all-mini+ ruleset
 * @param {Piece} piece
 * @param {Board} board
 * @returns {string | null} the type of spin or null if it isn't a spin
 */
const isMiniSpinPlus = function(piece, board) {
  if (piece.type === "T") {
    const tSpin = this.isTspin(piece, board);
    if (tSpin !== null) {
      return tSpin;
    }
  }
  const immobile = this.immobilityRule(piece, board);
  return immobile ? "mini" : null;
};

/**
 * all-spin ruleset
 * @param {Piece} piece
 * @param {Board} board
 * @returns {string | null} the type of spin or null if it isn't a spin
 */
const isAllSpin = function(piece, board) {
  if (piece.type === "T") {
    return this.isTspin(piece, board);
  } else {
    return this.immobilityRule(piece, board) ? "full" : null;
  }
};

/**
 * all-spin+ ruleset
 * @param {Piece} piece
 * @param {Board} board
 * @returns {string | null} the type of spin or null if it isn't a spin
 */
const isAllSpinPlus = function(piece, board) {
  if (piece.type === "T") {
    const tSpin = this.isTspin(piece, board);
    if (tSpin !== null) {
      return tSpin;
    }
  }
  return this.immobilityRule(piece, board) ? "full" : null;
}

const functions = [
  immobilityRule,
  
  isMiniSpin,
  isMiniSpinPlus,
  isAllSpin,
  isAllSpinPlus,
];

const allSpinFunctions = functionMap(functions);

export { allSpinFunctions };