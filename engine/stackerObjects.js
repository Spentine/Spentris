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
  
  static fromArray(data) {
    data ??= {};
    
    const arr = data.matrix;
    const width = data.width;
    const height = data.height;
    
    const board = new Board(width, height);
    
    for (let i=0; i<height; i++) {
      if (!arr[i]) break;
      for (let j=0; j<width; j++) {
        board.matrix[i][j] = arr[i][j];
      }
    };
    
    return board;
  }
  
  static fromSimpleArray(data) {
    data ??= {};
    
    const arr = data.matrix;
    const width = data.width;
    const height = data.height;
    
    // modify array
    for (let row of arr) {
      for (let mino in row) {
        const m = row[mino];
        
        if (m === null) {
          // empty
          row[mino] = new BoardMino(0, 0);
        } else {
          // mino
          row[mino] = new BoardMino(1, row[mino]);
        }
      }
    }
    
    return Board.fromArray({width, height, matrix: arr});
  }
}

// The Block Stacker Piece
class Piece {
  constructor(data) {
    data = data ?? {};
    
    this.type = data.type ?? null; // the type of the piece
    this.position = data.position ?? {x: 0, y: 0}; // the position of the piece
    this.rotation = data.rotation ?? 0; // the rotation of the piece
    this.matrix = null; // the matrix representing the piece
    
    if (data.updateMatrix ?? true) {
      this.updateMatrix();
    }
  }
  
  /**
   * Only update the matrix when the rotation changes.
   */
  updateMatrix() {
    this.matrix = SRSData.matrices[this.type][this.rotation];
    
    for (let row of this.matrix) {
      for (let i in row) {
        if (row[i] === 0) {
          row[i] = new PieceMino(0, 0, this.rotation);
        } else if (row[i] === 1) {
          row[i] = new PieceMino(1, this.type, this.rotation);
        }
      }
    }
  }
  
  /**
   * @returns {Piece}
   */
  copy(data) {
    data = data ?? {};
    return new Piece({
      type: data.type ?? this.type,
      position: data.position ?? {x: this.position.x, y: this.position.y},
      rotation: data.rotation ?? this.rotation
    });
  }
}

export { Board, Piece, BoardMino, PieceMino };