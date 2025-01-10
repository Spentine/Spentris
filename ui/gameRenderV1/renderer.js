import { TileMap, GameSkin, tetrioSkin } from './skin.js';

class gameRender {
  constructor(settings) {
    settings = settings ?? {};
    
    this.time = settings.time ?? 0;
    this.skin = settings.skin ?? tetrioSkin;
    
    // number of next pieces to render
    this.nextPieces = settings.nextPieces ?? 5;
    
    // create canvas
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    
    // TODO: change canvas size to fit the board
  }
  
  renderBoard(state, settings) {
    settings = settings ?? {
      position: {x: 0, y: 0},
      tileSize: 96,
    };
    
    const offset = settings.position;
    const tileSize = settings.tileSize;
    
    // render board
    const board = state.board;
    for (let row=0; row<board.height; row++) {
      for (let column=0; column<board.width; column++) {
        const mino = board.matrix[row][column];
        
        if (mino.type === 0) {
          
        } else if (mino.type === 1) {
          
          // get data for tile
          const tile = this.skin.tilemaps.minos.getTile(mino.texture, 0);
          
          this.ctx.drawImage(
            ...tile,
            // row 0 is lowest
            (tileSize * column) + offset.x,
            (tileSize * (board.height - row - 1)) + offset.y,
            tileSize,
            tileSize,
          );
        }
      }
    }
  }
  
  render(state) {
    // clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // render board
    this.renderBoard(state, {
      position: {x: 0, y: 0},
      tileSize: 24,
    });
    
    // return canvas
    return this.canvas;
  }
}

export { gameRender };