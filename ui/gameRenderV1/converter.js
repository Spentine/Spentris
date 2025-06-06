// converts Stacker object to renderGameState object

import { SRSData } from "./rsData.js";
import { translations } from "../../localization/language.js";

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
    this.language = data.language
    
    this.board = null;
    this.next = null;
    this.hold = null;
    this.current = null;
    this.ghost = null;
    this.values = null;
    this.clears = [];
    
    this.addListeners();
  }
  
  addListeners() {
    // add clear event listeners
    this.game.event.on("clear", (e) => {
      if (e.lines > 0) {
        // console.log(e);
        const convertedClear = this.convertClear(e);
        // console.log(convertedClear);
        this.clears.push(convertedClear);
      };
    });
    
    // when the game is reset
    this.game.event.on("reset", (e) => {
      this.clears = [];
    });
  }
  
  /**
   * converts a clear object into a renderer-digestible format
   * @param {object} clear - clear object
   * @returns {object} - digestible clear object
   */
  convertClear(clear) {
    return {
      time: clear.time, // for expiry
      original: clear, // for debugging
      text: translations[this.language].translations.game.clearConvert(clear),
    }
  }
  
  /**
   * converts a piece object into a renderer-digestible format
   * @param {object} piece - piece object
   * @returns {object} - digestible piece object
   **/
  convertPiece(piece) { // can be static
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
    this.current = this.convertPiece(
      this.game.currentPiece
    );
    this.currentLockdown = this.game.currentPieceLockdown / this.game.lockDelay;
    this.ghost = this.convertPiece(
      ghostPiece
    );
    this.values = {
      score: {
        title: translations[this.language].translations.game.scoreTitle,
        value: this.game.score,
        
        side: "left",
        height: 0,
      },
      lines: {
        title: translations[this.language].translations.game.linesTitle,
        value: this.game.lines,
        
        side: "left",
        height: 1,
      },
      level: {
        title: translations[this.language].translations.game.levelTitle,
        value: this.game.level,
        
        side: "left",
        height: 2,
      },
      time: {
        title: translations[this.language].translations.game.timeTitle,
        value: this.game.time,
        
        side: "left",
        height: 3,
      },
      
      // debug
      // i will keep these ones for future debugging
      /*
      spin: {
        title: translations[this.language].translations.gameSpinTitle,
        value: this.game.spin,
        
        side: "right",
        height: 0,
      },
      */
      /*
      leftInput: {
        title: "left",
        value: this.game.leftInput,
        
        side: "right",
        height: 0,
      },
      rightInput: {
        title: "right",
        value: this.game.rightInput,
        
        side: "right",
        height: 1,
      },
      */
      /*
      gravity: {
        title: "gravity",
        value: this.game.gravity,
        
        side: "right",
        height: 0,
      },
      arrOffset: {
        title: "arr",
        value: this.game.gaEventHandler.arrOffset,
        
        side: "right",
        height: 1,
      },
      */
      lockDelay: {
        title: "lockDelay",
        // master level lock delay numbers are not clean
        value: Math.round(this.game.lockDelay * 1000) / 1000,
        
        side: "right",
        height: 0,
      },
      piecesPlaced: {
        title: translations[this.language].translations.game.ppsTitle,
        value: Math.round(1000000 * this.game.piecesPlaced / this.game.time) / 1000,
        
        side: "right",
        height: 1,
      }
    };
    
    this.textTitleSize = 20 / 24;
    this.textValueSize = 24 / 24;
    this.textMargin = 6 / 24;
    
    this.textClearPrimarySize = 20 / 24;
    this.textClearSecondarySize = 16 / 24;
    this.textClearMargin = 10 / 24;
    
    this.textFont = translations[this.language].font.gameStats;
    
    this.rs = SRSData; // rs = rotation system
    
    this.time = this.game.time;
    this.clearRemovalTime = 3000;
    
    // remove outdated clears
    while (this.clears[0] && this.clears[0].time < this.time - this.clearRemovalTime) {
      this.clears.shift();
    }
    
    return this;
  }
}

export { RenderGameState };