// render
// import { renderState, createDemoState } from "./ui/debug/debugRenderField.js";
import { RenderGameState } from "./ui/gameRenderV1/converter.js";
import { GameRenderer } from "./ui/gameRenderV1/renderer.js";
import { tetrioSkin } from './ui/gameRenderV1/skin.js';

// handle inputs
import { KeyboardInput, keybinds } from "./interaction/keyboard.js";

// game engine
import { Stacker } from "./engine/stacker.js";

// utilities
import { files } from "./engine/functionLibrary.js";
import { functionLocationAccessor } from "./engine/util.js";
import { SRSPlusData } from "./engine/rsData.js";

// menus
import { menus, MenuHandler } from "./ui/menu/menu.js";

function main() {
  const renderCanvas = document.getElementById("renderCanvas");
  const ctx = renderCanvas.getContext("2d");
  
  // temporary solution
  var gameEnd = false;
  
  function render() {
    // ensure the canvas is the same size as the screen
    updateCanvasDimensions();
    
    // if the game has ended, don't render
    // if the game ends then the screen won't respond to size changes
    if (gameEnd) return;
    
    game.update();
    
    // clear the canvas
    ctx.clearRect(0, 0, renderCanvas.width, renderCanvas.height);
    
    // render the game
    
    // get the visual game state
    const visualGameState = rState.update();
    
    // get the tile size
    const tileSize = gRender.getContainingScale(
      visualGameState,
      renderCanvas.width,
      renderCanvas.height
    );
    
    // center game
    const offset = gRender.getCenterOffset(
      visualGameState,
      renderCanvas.width,
      renderCanvas.height,
      tileSize // dependent on the tile size
    );
    
    const gameRenderCanvas = gRender.render(visualGameState, {
      position: offset,
      tileSize: tileSize,
    });
    ctx.drawImage(gameRenderCanvas, 0, 0);
    
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
    immobilityRule: {file: "allSpin.js", name: "immobilityRule"},
    // isSpin: {file: "standardRules.js", name: "isSpin"},
    // isSpin: {file: "allSpin.js", name: "isAllSpin"},
    isSpin: {file: "allSpin.js", name: "isMiniSpin"},
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
  
  const gameFunctions = functionLocationAccessor(functionLocations, files);
  
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
          seed: "random",
          rotationSystem: SRSPlusData,
          // state: {
          //   das: 133.33, arr: 16.67, sdf: 60, msg: 1000,
          //   gravity: 1000, lockDelay: 500, maxLockDelay: 5000,
          //   startingLevel: 1, levelling: true, masterLevels: true,
          // },
          // state: {
          //   das: 100, arr: 0, sdf: Infinity, msg: 1000,
          //   gravity: 1000, lockDelay: 500, maxLockDelay: 5000,
          //   startingLevel: 1, levelling: true, masterLevels: true,
          // },
        }
      }
    }
  });
  
  // render state
  const rState = new RenderGameState({
    game: game,
  });
  
  // game render
  const gRender = new GameRenderer({
    time: 0,
    skin: tetrioSkin,
    canvas: renderCanvas,
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
    },
    
    resetInput: {
      keyDown: game.resetGameInputDown.bind(game),
      keyUp: game.resetGameInputUp.bind(game)
    },
  };
  
  // add keyboard listeners
  const keyboardListener = new KeyboardInput(
    inputForward, keybinds
  );
  keyboardListener.addListeners();
  console.log(game);
  
  const addListeners = () => {
    // add game listeners
    game.event.on("reset", (e) => {
      gameEnd = false;
      addListeners();
      rState.addListeners();
      window.requestAnimationFrame(render);
    });
    
    game.event.on("end", (e) => {
      gameEnd = true;
      console.log("Game Over");
    });
  }
  
  addListeners();
  
  window.requestAnimationFrame(render);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}