// handle running game

// copy object by traversal
import { copyObjByTraversal } from "../util.js";

// render
import { RenderGameState } from "../ui/gameRenderV1/converter.js";
import { GameRenderer } from "../ui/gameRenderV1/renderer.js";
import { tetrioSkin } from '../ui/gameRenderV1/skin.js';

// handle inputs
import { KeyboardInput, bindInputFunctions } from "../interaction/keyboard.js";

// game engine
import { Stacker } from "../engine/stacker.js";

// convert game start event
import { convertGameStartEvent } from "../ui/menu/converter.js";

const gameStart = (
  startEvent, inputData
) => {
  const data = {
    canvas: document.getElementById("renderCanvas"),
    updateCanvasDimensions: false,
  };
  copyObjByTraversal(data, inputData);
  
  data.ctx = data.canvas.getContext("2d");
  data.running = true;
  
  console.log("Game Start Event", startEvent);
  
  const gameStart = convertGameStartEvent(startEvent);
  const keybinds = startEvent.settings.keybinds;
  
  const values = Stacker.generateSettings(gameStart);
  const initData = values.initData;
  const initFunction = values.initFunction;
  
  console.log(initData);
  
  // create game
  const game = new Stacker(initData);
  initFunction(game);
  let gamePlaying = true;
  
  const rState = new RenderGameState({ // converter
    language: startEvent.settings.language,
  });
  RenderGameState.inGame.addListeners(game, rState);
  
  const gRender = new GameRenderer({ // renderer
    time: 0,
    skin: tetrioSkin,
    canvas: data.canvas,
  });
  function updateCanvasDimensions() {
    if ( // if the dimensions isn't the same as the screen
      window.innerWidth !== data.canvas.width ||
      window.innerHeight !== data.canvas.height
    ) { // make it the same as the screen
      data.canvas.width = window.innerWidth;
      data.canvas.height = window.innerHeight;  
    }
  }
  
  // create keyboard input system
  const inputForward = bindInputFunctions(game);
  const playKeyboardListener = new KeyboardInput(
    inputForward, keybinds.play
  );
  const metaKeyboardListener = new KeyboardInput(
    inputForward, keybinds.meta
  );
  playKeyboardListener.addListeners();
  metaKeyboardListener.addListeners();
  
  // add basic listeners
  // probably should be moved to a function
  const addListeners = function () {
    game.event.on("reset", (e) => {
      gamePlaying = true;
      addListeners();
      initFunction(game);
      RenderGameState.inGame.addListeners(game, rState);
      if (!playKeyboardListener.listenersAttached) {
        playKeyboardListener.addListeners();
      }
    });
    game.event.on("end", (e) => {
      gamePlaying = false;
      playKeyboardListener.removeListeners();
      console.log("game end");
    });
  };
  addListeners();
  
  function render() {
    // update canvas dimensions
    if (data.updateCanvasDimensions) updateCanvasDimensions();
    
    if (gamePlaying) game.update();
    data.ctx.clearRect(0, 0, data.canvas.width, data.canvas.height);
    
    // get visual game state
    const visualGameState = RenderGameState.inGame.update(game, rState);
    
    // get tile size
    const tileSize = gRender.getContainingScale(
      visualGameState,
      data.canvas.width,
      data.canvas.height
    );
    
    // center game
    const offset = gRender.getCenterOffset(
      visualGameState,
      data.canvas.width,
      data.canvas.height,
      tileSize
    );
    
    gRender.render(visualGameState, {
      position: offset,
      tileSize: tileSize,
    });
    
    if (data.running) window.requestAnimationFrame(render);
  }
  
  window.requestAnimationFrame(render);
  
  const functions = {
    forceEnd: () => {
      // stop game
      gamePlaying = false;
      data.running = false;
      
      // remove keyboard input
      playKeyboardListener.removeListeners();
      metaKeyboardListener.removeListeners();
    },
  };
  
  return functions;
}

export { gameStart };