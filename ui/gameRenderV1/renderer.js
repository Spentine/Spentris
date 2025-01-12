import { TileMap, GameSkin, tetrioSkin } from './skin.js';

class GameRenderer {
  constructor(data) {
    data = data ?? {};
    
    this.time = data.time ?? 0;
    this.skin = data.skin ?? tetrioSkin;
    
    // number of next pieces to render
    this.nextPieces = data.nextPieces ?? 5;
    
    this.canvas = data.canvas ?? document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
  }
  
  /**
   * return the game metrics (with offset)
   * @param {object} state - the game state
   * @param {object} data - additional data
   */
  gameMetrics(state, data) {
    data = data ?? {};
    
    const offset = data.position ?? {x: 0, y: 0};
    const tileSize = data.tileSize ?? 96;
    const sideMargin = 6 * tileSize;
    
    const canvasMetrics = {
      x: offset.x,
      y: offset.y,
      width: 2 * sideMargin + tileSize * state.board.width,
      height: 2 * tileSize + tileSize * state.renderHeight,
    };
    canvasMetrics.xEnd = canvasMetrics.x + canvasMetrics.width;
    canvasMetrics.yEnd = canvasMetrics.y + canvasMetrics.height;
    
    const boardMetrics = {
      x: offset.x + sideMargin,
      y: offset.y + tileSize,
      width: tileSize * state.board.width,
      height: tileSize * state.renderHeight,
    };
    boardMetrics.xEnd = boardMetrics.x + boardMetrics.width;
    boardMetrics.yEnd = boardMetrics.y + boardMetrics.height;
    
    return {
      offset: offset,
      tileSize: tileSize,
      sideMargin: sideMargin,
      
      canvasMetrics: canvasMetrics,
      boardMetrics: boardMetrics,
    };
  }
  
  /**
   * renders the board on the canvas
   * @param {object} state - the game state
   * @param {object} data - additional data
   */
  renderBoard(state, data) {
    data = data ?? {
      position: {x: 0, y: 0},
      tileSize: 96,
    };
    
    const offset = data.position;
    const tileSize = data.tileSize;
    
    // render board
    const board = state.board;
    for (let row=0; row<board.height; row++) {
      for (let column=0; column<board.width; column++) {
        const mino = board.matrix[row][column];
        
        if (mino === null) {
          
        } else {
          
          // get data for tile
          const tile = this.skin.tilemaps.minos.getTile(mino, 0);
          
          this.ctx.drawImage(
            ...tile,
            (tileSize * column) + offset.x,
            // row 0 is lowest
            (tileSize * (state.renderHeight - row - 1)) + offset.y,
            tileSize,
            tileSize,
          );
        }
      }
    }
  }
  
  /**
   * renders a piece on the board
   * @param {object} state - the game state
   * @param {object} data - additional data
   */
  renderPiece(state, data) {
    data = data ?? {
      position: {x: 0, y: 0},
      tileSize: 96,
      piece: null, // object
    };
    
    const offset = data.position;
    const tileSize = data.tileSize;
    const piece = data.piece;
    
    const position = this.getPosition(piece.position.y, piece.position.x, {
      tileSize: tileSize,
      renderHeight: state.renderHeight,
    });
    
    // render piece
    for (let rowIndex=0; rowIndex<piece.matrix.length; rowIndex++) {
      const row = piece.matrix[rowIndex];
      for (let columnIndex=0; columnIndex<row.length; columnIndex++) {
        const mino = row[columnIndex];
        
        if (mino === null) {
          
        } else {
          // get data for tile
          const tile = this.skin.tilemaps.minos.getTile(mino, 0);
          
          this.ctx.drawImage(
            ...tile,
            position.x + (tileSize * columnIndex) + offset.x,
            // row 0 is lowest, so subtract rowIndex
            position.y - (tileSize * rowIndex) + offset.y,
            tileSize,
            tileSize,
          );
        }
      }
    }
  }
  
  /**
   * renders a piece on the ui
   * @param {object} state - the game state
   * @param {object} data - additional data
   */
  renderPieceUI(state, data) {
    data = data ?? {
      position: {x: 0, y: 0},
      tileSize: 96,
      piece: null, // string
      centered: false,
      rotation: 0,
    };
    
    const offset = data.position;
    const matrix = state.rs.matrices[data.piece][data.rotation];
    
    // change offset to center piece
    if (data.centered) {
      // calculate corners of matrix
      
      // min values for row and column
      const bottomLeft = {row: matrix.length - 1, column: matrix[0].length - 1};
      const topRight = {row: 0, column: 0};
      
      for (let rowIndex=0; rowIndex<matrix.length; rowIndex++) {
        const row = matrix[rowIndex];
        for (let columnIndex=0; columnIndex<row.length; columnIndex++) {
          const mino = row[columnIndex];
          
          if (mino === null) {
            
          } else {
            bottomLeft.row = Math.min(bottomLeft.row, rowIndex);
            bottomLeft.column = Math.min(bottomLeft.column, columnIndex);
            topRight.row = Math.max(topRight.row, rowIndex);
            topRight.column = Math.max(topRight.column, columnIndex);
          }
        }
      }
      
      // calculate offset
      offset.x -= data.tileSize * (topRight.column + bottomLeft.column) / 2;
      offset.y += data.tileSize * (topRight.row + bottomLeft.row) / 2;
    }
    
    // render piece on ui
    for (let rowIndex=0; rowIndex<matrix.length; rowIndex++) {
      const row = matrix[rowIndex];
      for (let columnIndex=0; columnIndex<row.length; columnIndex++) {
        const mino = row[columnIndex];
        
        if (mino === null) {
          
        } else {
          const tile = this.skin.tilemaps.minos.getTile(mino, 0);
          
          this.ctx.drawImage(
            ...tile,
            offset.x + (data.tileSize * columnIndex),
            offset.y - (data.tileSize * rowIndex),
            data.tileSize,
            data.tileSize,
          );
        }
      }
    }
  }
  
  /**
   * return the screen position (without offset) given a row and a column
   * @param {number} row - the row
   * @param {number} column - the column
   * @param {object} data - the data
   */
  getPosition(row, column, data) {
    data = data ?? {
      tileSize: 96,
      renderHeight: 20,
    };
    
    return {
      x: column * data.tileSize,
      y: (data.renderHeight - row - 1) * data.tileSize,
    };
  }
  
  /**
   * render the game state
   * @param {object} state - the game state
   * @param {object} data - additional data
   */
  render(state, data) {
    data = data ?? {};
    
    const metrics = this.gameMetrics(state, data);
    
    const offset = metrics.offset;
    const tileSize = metrics.tileSize;
    const sideMargin = metrics.sideMargin;
    
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(
      metrics.canvasMetrics.x,
      metrics.canvasMetrics.y,
      metrics.canvasMetrics.width,
      metrics.canvasMetrics.height,
    );
    
    this.ctx.fillStyle = "#222222";
    this.ctx.fillRect(
      metrics.boardMetrics.x,
      metrics.boardMetrics.y,
      metrics.boardMetrics.width,
      metrics.boardMetrics.height,
    );
    
    // render board
    this.renderBoard(state, {
      position: {
        x: metrics.boardMetrics.x,
        y: metrics.boardMetrics.y,
      },
      tileSize: tileSize,
    });
    
    // render current piece
    this.ctx.filter = `brightness(${1 - state.currentLockdown * 0.8})`;
    this.renderPiece(state, {
      position: {
        x: metrics.boardMetrics.x,
        y: metrics.boardMetrics.y,
      },
      tileSize: tileSize,
      piece: state.current,
    });
    this.ctx.filter = "none";
    
    // render ghost piece
    const ghostPiece = state.ghost;
    if (ghostPiece !== null) {
      this.ctx.globalAlpha = 0.3;
      this.renderPiece(state, {
        position: {
          x: metrics.boardMetrics.x,
          y: metrics.boardMetrics.y,
        },
        tileSize: tileSize,
        piece: ghostPiece,
      });
      this.ctx.globalAlpha = 1
    }
    
    // render hold
    if (state.hold.piece !== null) {
      this.renderPieceUI(state, {
        position: {
          x: metrics.canvasMetrics.x + tileSize * 2.5,
          y: metrics.canvasMetrics.y + tileSize * 2.5,
        },
        tileSize: tileSize,
        piece: state.hold.piece,
        rotation: 0,
        centered: true,
      });
    }
    
    // render next pieces
    const nextAmount = Math.min(state.nextAmount, state.next.length);
    for (let pieceIndex=0; pieceIndex<nextAmount; pieceIndex++) {
      this.renderPieceUI(state, {
        position: {
          x: metrics.canvasMetrics.xEnd - sideMargin + tileSize * 2.5,
          y: metrics.canvasMetrics.y + tileSize * (2.5 + pieceIndex * 3),
        },
        tileSize: tileSize,
        piece: state.next[pieceIndex],
        rotation: 0,
        centered: true,
      });
    }
    
    // return canvas
    return this.canvas;
  }
}

export { GameRenderer };