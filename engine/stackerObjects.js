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
  constructor() {
    this.matrix = []; // the matrix representing wtthe piece
    this.position = {x: 0, y: 0}; // the position of the piece
    this.rotation = 0; // the rotation of the piece
    this.type = null; // the type of the piece
  }
}

export { Board, Piece, BoardMino };