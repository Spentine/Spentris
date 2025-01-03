import { functionMap } from "./util.js";

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
    console.log(direction, validPosition);
    
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
 * @returns {string | null} the type of t-spin or null if it isn't a t-spin
 */
const isMiniSpin = function(piece, board) {
  console.log(piece);
  if (piece.type === "T") {
    return this.isTspin(piece, board);
  } else {
    const immobile = this.immobilityRule(piece, board);
    return immobile ? "mini" : null;
  }
};

/**
 * all-spin ruleset
 * @param {Piece} piece
 * @param {Board} board
 * @returns {string | null} the type of t-spin or null if it isn't a t-spin
 */
const isAllSpin = function(piece, board) {
  if (piece.type === "T") {
    return this.isTspin(piece, board);
  } else {
    return this.immobilityRule(piece, board) ? "full" : null;
  }
};

const functions = [
  immobilityRule,
  
  isMiniSpin,
  isAllSpin,
];

const allSpinFunctions = functionMap(functions);

export { allSpinFunctions };