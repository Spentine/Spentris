// converts Stacker object to renderGameState object

import { SRSData } from "./rsData.js";

// texture type map
const ttMap = {
  // types
  0: { // textures
    0: null,
  },
  1: { // textures
    "Z": "Z",
    "L": "L",
    "O": "O",
    "S": "S",
    "I": "I",
    "J": "J",
    "T": "T",
  },
}

class RenderGameState {
  constructor(data) {
    data = data ?? {};
    
    this.game = data.game ?? null;
    
    this.board = null;
    this.next = null;
    this.hold = null;
    this.current = null;
    this.ghost = null;
    this.values = null;
    
    this.update();
    
    // for effects or animations that persist across multiple frames
    // this.persistentValues = {};
  }
  
  static convertPiece(piece) {
    const matrix = [];
    
    // convert piece matrix to string matrix
    for (let rowIndex=0; rowIndex<piece.matrix.length; rowIndex++) {
      const row = [];
      
      for (let columnIndex=0; columnIndex<piece.matrix[0].length; columnIndex++) {
        const mino = piece.matrix[rowIndex][columnIndex];
        
        row.push(ttMap[mino.type][mino.texture]);
      }
      
      matrix.push(row);
    }
    
    const digestiblePiece = {
      matrix: matrix,
      position: piece.position,
      rotation: piece.rotation,
      type: piece.type,
    }
    
    return digestiblePiece;
  }
  
  update() {
    const matrix = [];
    
    for (let rowIndex=0; rowIndex<this.game.board.height; rowIndex++) {
      const row = [];
      
      for (let columnIndex=0; columnIndex<this.game.board.width; columnIndex++) {
        const mino = this.game.board.matrix[rowIndex][columnIndex];
        
        row.push(ttMap[mino.type][mino.texture]);
      }
      
      matrix.push(row);
    }
    
    const ghostPiece = this.game.calculateGhostPiece(
      this.game.currentPiece, this.game.board
    );
    
    // set values
    this.board = {
      width: this.game.board.width,
      height: this.game.board.height,
      matrix: matrix,
    }
    this.renderHeight = 20;
    this.next = this.game.nextQueue;
    this.nextAmount = 5; // max number of next pieces
    this.hold = this.game.hold;
    this.current = RenderGameState.convertPiece(
      this.game.currentPiece
    );
    this.currentLockdown = this.game.currentPieceLockdown / this.game.lockDelay;
    this.ghost = RenderGameState.convertPiece(
      ghostPiece
    );
    this.values = {
      "score": this.game.score,
      "lines": this.game.lines,
      "level": this.game.level,
      "time": this.game.time,
      "spin": this.game.spin,
    };
    this.rs = SRSData; // rs = rotation system
    
    return this;
  }
}

export { RenderGameState };