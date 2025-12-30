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
    "hold": "hold",
    "garbage": "garbage",
    "unclearableGarbage": "unclearableGarbage",
  },
}

class RenderGameState {
  constructor(data) {
    data = data ?? {};
    
    this.language = data.language;
    
    this.board = null;
    this.next = null;
    this.hold = null;
    this.current = null;
    this.ghost = null;
    this.values = null;
    this.clears = [];
  }
  
  // handles in-game rendering state
  static inGame = {
    /**
     * adds event listeners to the game to update the game state
     * @param {Object} game - current game object
     * @param {Object} gameState - current game state object
     */
    addListeners: function(game, gameState) {
      // add clear event listeners
      game.event.on("clear", (e) => {
        if (e.lines > 0) {
          // console.log(e);
          const convertedClear = RenderGameState.inGame.convertClear(e, gameState);
          // console.log(convertedClear);
          gameState.clears.push(convertedClear);
        };
      });
      
      // when the game is reset
      game.event.on("reset", (e) => {
        gameState.clears = [];
      });
    },
    
    /**
     * converts a clear object into a renderer-digestible format
     * @param {Object} clear - clear object
     * @param {Object} gameState - current game state
     * @returns {Object} - digestible clear object
     */
    convertClear: function (clear, gameState) {
      return {
        time: clear.time, // for expiry
        original: clear, // for debugging
        text: translations[gameState.language].translations.game.clearConvert(clear),
      }
    },
    
    /**
     * converts a piece object into a renderer-digestible format
     * @param {Object} piece - piece object
     * @returns {Object} - digestible piece object
     **/
    convertPiece: function (piece) { // can be static
      if (!piece) return {
        matrix: [],
        position: {x: 0, y: 0},
        rotation: 0,
        type: null,
      };
      
      const matrix = [];
      
      // convert piece matrix to string matrix
      for (let rowIndex=0; rowIndex<piece.matrix.length; rowIndex++) {
        const row = [];
        
        for (let columnIndex=0; columnIndex<piece.matrix[0].length; columnIndex++) {
          const mino = piece.matrix[rowIndex][columnIndex];
          
          row.push(
            ttMap[mino.type].hasOwnProperty(mino.texture)
            ? ttMap[mino.type][mino.texture]
            : mino.texture
          );
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
    },
    
    /**
     * updates the game state to match the current game
     * @param {Object} game - current game object
     * @param {Object} gameState - current game state object
     * @returns {Object} - updated game state object
     */
    update: function (game, gameState) {
      const matrix = [];

      for (let rowIndex=0; rowIndex<game.board.height; rowIndex++) {
        const row = [];
        
        for (let columnIndex=0; columnIndex<game.board.width; columnIndex++) {
          const mino = game.board.matrix[rowIndex][columnIndex];
          
          row.push(
            ttMap[mino.type].hasOwnProperty(mino.texture)
            ? ttMap[mino.type][mino.texture]
            : mino.texture
          );
        }
        
        matrix.push(row);
      }
      
      const ghostPiece = game.calculateGhostPiece(
        game.currentPiece, game.board
      );
      
      // set values
      gameState.board = {
        width: game.board.width,
        height: game.board.height,
        matrix: matrix,
      }
      gameState.renderHeight = 20;
      gameState.next = game.nextQueue;
      gameState.nextAmount = 5; // max number of next pieces
      gameState.hold = game.hold;
      gameState.current = RenderGameState.inGame.convertPiece(
        game.currentPiece
      );
      gameState.currentLockdown = game.currentPieceLockdown / game.lockDelay;
      gameState.ghost = RenderGameState.inGame.convertPiece(
        ghostPiece
      );
      gameState.values = {
        score: {
          title: translations[gameState.language].translations.game.scoreTitle,
          value: game.score,
          
          side: "left",
          height: 0,
        },
        lines: {
          title: translations[gameState.language].translations.game.linesTitle,
          value: game.lines,
          
          side: "left",
          height: 1,
        },
        level: {
          title: translations[gameState.language].translations.game.levelTitle,
          value: game.level,
          
          side: "left",
          height: 2,
        },
        time: {
          title: translations[gameState.language].translations.game.timeTitle,
          value: game.time,
          
          side: "left",
          height: 3,
        },
        
        // debug
        // i will keep these ones for future debugging
        /*
        spin: {
          title: translations[gameState.language].translations.game.spinTitle,
          value: game.spin,
          
          side: "right",
          height: -1,
        },
        */
        /*
        leftInput: {
          title: "left",
          value: game.leftInput,
          
          side: "right",
          height: 0,
        },
        rightInput: {
          title: "right",
          value: game.rightInput,
          
          side: "right",
          height: 1,
        },
        */
        /*
        gravity: {
          title: "gravity",
          value: game.gravity,
          
          side: "right",
          height: 0,
        },
        arrOffset: {
          title: "arr",
          value: game.gaEventHandler.arrOffset,
          
          side: "right",
          height: 1,
        },
        */
        lockDelay: {
          title: "lockDelay",
          // master level lock delay numbers are not clean
          value: Math.round(game.lockDelay * 1000) / 1000,
          
          side: "right",
          height: 0,
        },
        piecesPlaced: {
          title: translations[gameState.language].translations.game.ppsTitle,
          value: Math.round(1000000 * game.piecesPlaced / game.time) / 1000,
          
          side: "right",
          height: 1,
        }
      };
      
      gameState.textTitleSize = 20 / 24;
      gameState.textValueSize = 24 / 24;
      gameState.textMargin = 6 / 24;
      
      gameState.textClearPrimarySize = 20 / 24;
      gameState.textClearSecondarySize = 16 / 24;
      gameState.textClearMargin = 10 / 24;
      
      gameState.textFont = translations[gameState.language].font.gameStats;
      
      gameState.rs = SRSData; // rs = rotation system
      
      gameState.time = game.time;
      gameState.clearRemovalTime = 3000;
      
      // remove outdated clears
      while (gameState.clears[0] && gameState.clears[0].time < gameState.time - gameState.clearRemovalTime) {
        gameState.clears.shift();
      }
      
      return gameState;
    },
  };
  
  // handles puzzle menu rendering state
  static puzzleMenu = {
    update: function (puzzleModifier, gameState, language) {
      gameState.board = puzzleModifier.board;
      
      gameState.next = puzzleModifier.nextQueue;
      gameState.nextAmount = 5; // max number of next pieces
      
      gameState.hold = {
        piece: puzzleModifier.holdPiece,
        allowed: true,
      };
      
      // implement current piece later
      gameState.current = {
        matrix: [],
        position: {x: 0, y: 0},
        rotation: 0,
        type: null,
      };
      gameState.ghost = {
        matrix: [],
        position: {x: 0, y: 0},
        rotation: 0,
        type: null,
      };
      
      gameState.renderHeight = 20;
      gameState.currentLockdown = 0;
      
      gameState.values = {};
      
      gameState.textTitleSize = 20 / 24;
      gameState.textValueSize = 24 / 24;
      gameState.textMargin = 6 / 24;
      
      gameState.textClearPrimarySize = 20 / 24;
      gameState.textClearSecondarySize = 16 / 24;
      gameState.textClearMargin = 10 / 24;
      
      gameState.textFont = translations[language].font.gameStats;
      
      gameState.rs = SRSData; // consider removal
      
      gameState.time = 0;
      gameState.clearRemovalTime = 3000;
      
      gameState.clears = [];
      
      return gameState;
    }
  };
}

export { RenderGameState };