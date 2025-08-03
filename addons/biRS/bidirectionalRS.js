import { functionMap } from "../../engine/util.js";

/**
 * uses BiRS to rotate the piece
 * implements the "kick system" of the rotation system
 * calculates the piece position after rotation
 * taken from Techmino's BiRS implementation
 * @param {Piece} piece
 * @param {Board} board
 * @param {number} newRotation
 * @returns {boolean} whether the piece was successfully rotated
 */
const bidirectionalKickSystem = function(piece, board, newRotation) {
  // this.softDropFlag // whether soft drop is active
  // this.leftInput // whether left input is active
  // this.rightInput // whether right input is active
  
  const previousRotation = piece.rotation;
  
  // copy the piece with new rotation
  const newPiece = piece.copy();
  
  // important: bidirectional part
  /*
    for each direction (left, right, down):
      if the input is active, push the piece in that direction
      if the piece intersects with a board, then good
      otherwise push it back
  */
  let cX = 0; // cumulative offset for x
  let cY = 0; // cumulative offset for y
  if (this.leftInput) {
    newPiece.position.x = piece.position.x - 1;
    if (!this.validPiecePosition(newPiece, board)) {
      cX -= 1;
    }
    newPiece.position.x = piece.position.x; // undo
  }
  if (this.rightInput) {
    newPiece.position.x = piece.position.x + 1;
    if (!this.validPiecePosition(newPiece, board)) {
      cX += 1;
    }
    newPiece.position.x = piece.position.x; // undo
  }
  if (this.softDropFlag) {
    newPiece.position.y = piece.position.y - 1;
    if (!this.validPiecePosition(newPiece, board)) {
      cY -= 1;
    }
    newPiece.position.y = piece.position.y; // undo
  }
  
  // apply the cumulative offset
  newPiece.position.x += cX;
  newPiece.position.y += cY;
  
  // apply the new rotation
  newPiece.rotation = newRotation;
  newPiece.updateMatrix();

  // retrieve kick data
  const kicks = this.currentRotationSystem.kicks[piece.type][previousRotation][newRotation];
  
  while (true) {
    // loop over kick data
    for (let kickIndex=0; kickIndex<kicks.length; kickIndex++) {
      const kick = kicks[kickIndex];
      
      // perform some checks to ensure bidirectionality is valid
      if (
        (kick.x + cX) * cX >= 0 && // idk it was in the original code
        Math.pow(kick.x + cX, 2) + Math.pow(kick.y + cY, 2) <= 5 && // distance check
        (this.currentPieceLockdown > 0 || this.maxCurrentPieceLockdown > 0 || (kick.y + cY) <= 0) // lockdown check
      )  {
        // apply kick
        newPiece.position.x += kick.x;
        newPiece.position.y += kick.y;
        
        if (this.validPiecePosition(newPiece, board)) {
          piece.position = newPiece.position;
          piece.rotation = newPiece.rotation;
          piece.updateMatrix();
          
          return {
            success: true,
            kick: kickIndex,
            previousRotation: previousRotation,
            newRotation: newRotation,
          };
        }
        
        // undo kick
        newPiece.position.x -= kick.x;
        newPiece.position.y -= kick.y;
      }
    }
    
    // try to release left/right, then softdrop, then fail otherwise
    if (cX !== 0) {
      newPiece.position.x -= cX; // undo cumulative x offset
      cX = 0; // release left/right
    } else if (cY !== 0) {
      newPiece.position.y -= cY; // undo cumulative y offset
      cY = 0; // release softdrop
    } else {
      // no more kicks to try, fail
      break;
    }
  }
  
  return {
    success: false,
    previousRotation: previousRotation,
    newRotation: newRotation,
  };
}

const functions = [
  bidirectionalKickSystem,
];

const bidirectionalRSFunctions = functionMap(functions);

export { bidirectionalRSFunctions };