import { SRSPlusData } from "../rsData.js";

// addons
import { BiRSData } from "../../addons/biRS/biRSData.js";

const standardFunctionLocations = {
  update: {file: "standardRules.js", name: "update"},
  initialize: {file: "standardRules.js", name: "initialize"},
  jsonToInitialize: {file: "standardRules.js", name: "jsonToInitialize"},
  resetGame: {file: "standardRules.js", name: "resetGame"},
  
  lehmerRNG: {file: "standardRules.js", name: "lehmerRNG"},
  calculateDropSpeed: {file: "standardRules.js", name: "calculateDropSpeed"},
  calculateLockDelay: {file: "standardRules.js", name: "calculateLockDelay"},
  
  isBoardMinoSolid: {file: "standardRules.js", name: "isBoardMinoSolid"},
  isPieceMinoSolid: {file: "standardRules.js", name: "isPieceMinoSolid"},
  boardPieceMinoIntersect: {file: "standardRules.js", name: "boardPieceMinoIntersect"},
  inBounds: {file: "standardRules.js", name: "inBounds"},
  transferPieceToBoard: {file: "standardRules.js", name: "transferPieceToBoard"},
  lineClearHandler: {file: "standardRules.js", name: "lineClearHandler"},
  
  validPiecePosition: {file: "standardRules.js", name: "validPiecePosition"},
  isTouchingGround: {file: "standardRules.js", name: "isTouchingGround"},
  generateNext: {file: "standardRules.js", name: "generateNext"},
  clearLines: {file: "standardRules.js", name: "clearLines"},
  kickSystem: {file: "standardRules.js", name: "kickSystem"},
  // kickSystem: {file: "bidirectionalRS.js", name: "bidirectionalKickSystem"},
  rotationSystem: {file: "standardRules.js", name: "rotationSystem"},
  spawnPiece: {file: "standardRules.js", name: "spawnPiece"},
  refillNextQueue: {file: "standardRules.js", name: "refillNextQueue"},
  
  movePiece: {file: "standardRules.js", name: "movePiece"},
  placePiece: {file: "standardRules.js", name: "placePiece"},
  
  moveLeft: {file: "standardRules.js", name: "moveLeft"},
  moveRight: {file: "standardRules.js", name: "moveRight"},
  hardDrop: {file: "standardRules.js", name: "hardDrop"},
  isTspin: {file: "standardRules.js", name: "isTspin"},
  immobilityRule: {file: "allSpin.js", name: "immobilityRule"},
  // isSpin: {file: "standardRules.js", name: "isSpin"},
  isSpin: {file: "allSpin.js", name: "isAllSpin"},
  // isSpin: {file: "allSpin.js", name: "isMiniSpin"},
  isSpin: {file: "allSpin.js", name: "isMiniSpinPlus"},
  rotate: {file: "standardRules.js", name: "rotate"},
  holdPiece: {file: "standardRules.js", name: "holdPiece"},
  
  // input functions
  moveLeftInputDown: {file: "standardRules.js", name: "moveLeftInputDown"},
  moveLeftInputUp: {file: "standardRules.js", name: "moveLeftInputUp"},
  moveRightInputDown: {file: "standardRules.js", name: "moveRightInputDown"},
  moveRightInputUp: {file: "standardRules.js", name: "moveRightInputUp"},
  softDropInputDown: {file: "standardRules.js", name: "softDropInputDown"},
  softDropInputUp: {file: "standardRules.js", name: "softDropInputUp"},
  hardDropInputDown: {file: "standardRules.js", name: "hardDropInputDown"},
  hardDropInputUp: {file: "standardRules.js", name: "hardDropInputUp"},
  rotateCWInputDown: {file: "standardRules.js", name: "rotateCWInputDown"},
  rotateCWInputUp: {file: "standardRules.js", name: "rotateCWInputUp"},
  rotateCCWInputDown: {file: "standardRules.js", name: "rotateCCWInputDown"},
  rotateCCWInputUp: {file: "standardRules.js", name: "rotateCCWInputUp"},
  rotate180InputDown: {file: "standardRules.js", name: "rotate180InputDown"},
  rotate180InputUp: {file: "standardRules.js", name: "rotate180InputUp"},
  holdPieceInputDown: {file: "standardRules.js", name: "holdPieceInputDown"},
  holdPieceInputUp: {file: "standardRules.js", name: "holdPieceInputUp"},
  resetGameInputDown: {file: "standardRules.js", name: "resetGameInputDown"},
  resetGameInputUp: {file: "standardRules.js", name: "resetGameInputUp"},
  
  // supplementary functions
  calculateGhostPiece: {file: "standardRules.js", name: "calculateGhostPiece"},
};

const standardRotationSystem = SRSPlusData; // the standard rotation system is srs+
// const standardRotationSystem = BiRSData; // implemented for fun

const standardModes = {
  marathon: {
    values: {
      version: 1,
      settings: {
        functionLocations: standardFunctionLocations,
        initialization: {
          parameters: {
            state: {
              // null values for handling settings are replaced by the user preferences
              arr: null,
              das: null,
              sdf: null,
              dcd: null,
              msg: null,
              are: null,
              lca: null,
              
              gravity: 1000,
              lockDelay: 500,
              maxLockDelay: 5000,
              startingLevel: 1,
              levelling: true,
              masterLevels: true,
            },
            rotationSystem: standardRotationSystem,
          },
        },
      },
    },
    initFunction: function (game) {
      // nothing because marathon is normal
    },
  },
  sprint: {
    values: {
      version: 1,
      settings: {
        functionLocations: standardFunctionLocations,
        initialization: {
          parameters: {
            state: {
              arr: null,
              das: null,
              sdf: null,
              dcd: null,
              msg: null,
              are: null,
              lca: null,
              
              gravity: 1000,
              lockDelay: 500,
              maxLockDelay: 5000,
              startingLevel: 1,
              levelling: false,
              masterLevels: false,
            },
            rotationSystem: standardRotationSystem,
          },
        },
      },
    },
    initFunction: function (game) {
      game.event.on("clear", (e) => {
        if (game.lines >= 40) {
          game.event.emit("end", {
            time: game.time,
            type: "sprintFinish",
            success: true,
          });
        }
      });
    },
  },
  ultra: {
    values: {
      version: 1,
      settings: {
        functionLocations: standardFunctionLocations,
        initialization: {
          parameters: {
            state: {
              arr: null,
              das: null,
              sdf: null,
              dcd: null,
              msg: null,
              are: null,
              lca: null,
              
              gravity: 1000,
              lockDelay: 500,
              maxLockDelay: 5000,
              startingLevel: 1,
              levelling: true,
              masterLevels: true,
            },
            rotationSystem: standardRotationSystem,
          },
        },
      },
    },
    initFunction: function (game) {
      game.event.on("update", (e) => {
        if (e.time >= 2 * 60 * 1000) {
          game.event.emit("end", {
            time: game.time,
            type: "ultraFinish",
            success: true,
            // score: game.score,
          });
        }
      });
    },
  },
  zen: {
    values: {
      version: 1,
      settings: {
        functionLocations: standardFunctionLocations,
        initialization: {
          parameters: {
            state: {
              arr: null,
              das: null,
              sdf: null,
              dcd: null,
              msg: null,
              are: null,
              lca: null,
              
              gravity: 1000,
              lockDelay: 500,
              maxLockDelay: 5000,
              startingLevel: 1,
              levelling: false,
              masterLevels: false,
            },
            rotationSystem: standardRotationSystem,
          },
        },
      },
    },
    initFunction: function (game) {
      
    },
  },
};

export { standardModes, standardFunctionLocations };