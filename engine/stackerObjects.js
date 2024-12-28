import { SRSData } from "./rsData.js";

class BoardMino {
  static types = {
    "empty": 0,
    "block": 1,
    // "bomb": 2
  };
  
  /**
   * @param {string | number} type
   * @param {string | number} texture
   */
  constructor(type=0, texture=0) {
    this.type = type;
    this.texture = texture;
  }
  
  clear() {
    this.type = 0;
    this.texture = 0;
  }
}

class PieceMino {
  static types = {
    "empty": 0,
    "block": 1,
    // "bomb": 2
  };
  
  /**
   * @param {string | number} type
   * @param {string | number} texture
   * @param {string | number} rotation
   */
  constructor(type=0, texture=0, rotation=0) {
    this.type = type;
    this.texture = texture;
    this.rotation = rotation;
  }
  
  clear() {
    this.type = 0;
    this.texture = 0;
    this.rotation = 0;
  }
}

// The Block Stacker Matrix
class Board {
  /**
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height) {
    this.matrix = [];
    
    for (let i = 0; i < height; i++) {
      this.matrix.push([]);
      for (let j = 0; j < width; j++) {
        this.matrix[i].push(new BoardMino());
      }
    }
    
    this.width = width;
    this.height = height;
  }
}

// The Block Stacker Piece
class Piece {
  constructor(settings) {
    settings = settings ?? {};
    
    this.type = settings.type ?? null; // the type of the piece
    this.position = settings.position ?? {x: 0, y: 0}; // the position of the piece
    this.rotation = settings.rotation ?? 0; // the rotation of the piece
    this.matrix = null; // the matrix representing the piece
    
    this.updateMatrix();
  }
  
  updateMatrix() {
    this.matrix = SRSData.matrices[this.type][this.rotation];
    
    for (let row of this.matrix) {
      for (let i in row) {
        if (row[i] === 0) {
          row[i] = new PieceMino(0, 0, this.rotation);
        } else if (row[i] === 1) {
          row[i] = new PieceMino(this.type, 1, this.rotation);
        }
      }
    }
  }
}

export { Board, Piece, BoardMino, PieceMino };