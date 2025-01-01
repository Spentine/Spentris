import { renderState, createDemoState } from "./ui/debug/debugRenderField.js";
import { addKeyboardListeners, keybinds } from "./interaction/keyboard.js";
import { Stacker } from "./engine/stacker.js";
import { standardFunctions } from "./engine/standardRules.js";
import { functionLocationAccessor } from "./engine/util.js";

function main() {
  const renderCanvas = document.getElementById("renderCanvas");
  const ctx = renderCanvas.getContext("2d");
  
  function render() {
    // ensure the canvas is the same size as the screen
    updateCanvasDimensions();
    
    // render the current board state
    game.update();
    ctx.drawImage(renderState(createDemoState(game)), 0, 0);
    
    window.requestAnimationFrame(render);
  }
  
  function updateCanvasDimensions() {
    if ( // if the dimensions isn't the same as the screen
      window.innerWidth !== renderCanvas.width ||
      window.innerHeight !== renderCanvas.height
    ) { // make it the same as the screen
      renderCanvas.width = window.innerWidth;
      renderCanvas.height = window.innerHeight;  
    }
  }
  
  // set game functions
  const functionLocations = {
    update: {file: "standardRules.js", name: "update"},
    tick: {file: "standardRules.js", name: "tick"},
    initialize: {file: "standardRules.js", name: "initialize"},
    
    lehmerRNG: {file: "standardRules.js", name: "lehmerRNG"},
    
    isBoardMinoSolid: {file: "standardRules.js", name: "isBoardMinoSolid"},
    isPieceMinoSolid: {file: "standardRules.js", name: "isPieceMinoSolid"},
    boardPieceMinoIntersect: {file: "standardRules.js", name: "boardPieceMinoIntersect"},
    inBounds: {file: "standardRules.js", name: "inBounds"},
    
    validPiecePosition: {file: "standardRules.js", name: "validPiecePosition"},
    isTouchingGround: {file: "standardRules.js", name: "isTouchingGround"},
    generateNext: {file: "standardRules.js", name: "generateNext"},
    clearLines: {file: "standardRules.js", name: "clearLines"},
    SRS: {file: "standardRules.js", name: "SRS"},
    rotationSystem: {file: "standardRules.js", name: "rotationSystem"},
    spawnPiece: {file: "standardRules.js", name: "spawnPiece"},
    refillNextQueue: {file: "standardRules.js", name: "refillNextQueue"},
    
    movePiece: {file: "standardRules.js", name: "movePiece"},
    placePiece: {file: "standardRules.js", name: "placePiece"},
    
    moveLeft: {file: "standardRules.js", name: "moveLeft"},
    moveRight: {file: "standardRules.js", name: "moveRight"},
    softDrop: {file: "standardRules.js", name: "softDrop"},
    hardDrop: {file: "standardRules.js", name: "hardDrop"},
    isTspin: {file: "standardRules.js", name: "isTspin"},
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
    
    // supplementary functions
    calculateGhostPiece: {file: "standardRules.js", name: "calculateGhostPiece"},
  };
  
  const gameFunctions = functionLocationAccessor(functionLocations);
  
  // create game
  const game = new Stacker({
    version: 1,
    functions: gameFunctions,
    settings: {
      functionLocations: functionLocations,
      initialization: {
        variableOverrides: {
          
        },
        parameters: {
          
        }
      }
    }
  });
  
  // set input functions
  const inputForward = {
    moveLeftInput: {
      keyDown: game.moveLeftInputDown.bind(game),
      keyUp: game.moveLeftInputUp.bind(game)
    },
    moveRightInput: {
      keyDown: game.moveRightInputDown.bind(game),
      keyUp: game.moveRightInputUp.bind(game)
    },
    softDropInput: {
      keyDown: game.softDropInputDown.bind(game),
      keyUp: game.softDropInputUp.bind(game)
    },
    hardDropInput: {
      keyDown: game.hardDropInputDown.bind(game),
      keyUp: game.hardDropInputUp.bind(game)
    },
    rotateCWInput: {
      keyDown: game.rotateCWInputDown.bind(game),
      keyUp: game.rotateCWInputUp.bind(game)
    },
    rotateCCWInput: {
      keyDown: game.rotateCCWInputDown.bind(game),
      keyUp: game.rotateCCWInputUp.bind(game)
    },
    rotate180Input: {
      keyDown: game.rotate180InputDown.bind(game),
      keyUp: game.rotate180InputUp.bind(game)
    },
    holdPieceInput: {
      keyDown: game.holdPieceInputDown.bind(game),
      keyUp: game.holdPieceInputUp.bind(game)
    }
  };
  
  // add keyboard listeners
  addKeyboardListeners(inputForward, keybinds);
  console.log(game);
  
  window.requestAnimationFrame(render);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}