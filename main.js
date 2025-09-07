// render
import { RenderGameState } from "./ui/gameRenderV1/converter.js";
import { GameRenderer } from "./ui/gameRenderV1/renderer.js";
import { tetrioSkin } from './ui/gameRenderV1/skin.js';

// handle inputs
import { KeyboardInput, bindInputFunctions } from "./interaction/keyboard.js";

// game engine
import { Stacker } from "./engine/stacker.js";

// menus
import {
  uiFunctions,
  spentrisMenus,
  uiDisplay,
  values,
} from "./ui/menu/menu.js";
import {
  MenuHandler
} from "./ui/menu/menuHandler.js";

// convert game start event
import { convertGameStartEvent } from "./ui/menu/converter.js";

function main() {
  // initialize menus
  const menus = new MenuHandler({
    currentMenu: "home",
    uiFunctions: uiFunctions,
    menus: spentrisMenus,
    uiDisplay: uiDisplay,
    values: values,
  });
  
  menus.showMenu("home");
  
  // start game
  menus.event.on("gameStart", (startEvent) => {
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
    
    // create rendering engine
    const renderCanvas = document.getElementById("renderCanvas");
    const ctx = renderCanvas.getContext("2d");
    
    const rState = new RenderGameState({ // converter
      language: startEvent.settings.language,
    });
    RenderGameState.inGame.addListeners(game, rState);
    
    const gRender = new GameRenderer({ // renderer
      time: 0,
      skin: tetrioSkin,
      canvas: renderCanvas,
    });
    function updateCanvasDimensions() {
      if ( // if the dimensions isn't the same as the screen
        window.innerWidth !== renderCanvas.width ||
        window.innerHeight !== renderCanvas.height
      ) { // make it the same as the screen
        renderCanvas.width = window.innerWidth;
        renderCanvas.height = window.innerHeight;  
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
      updateCanvasDimensions();
      
      if (gamePlaying) game.update();
      ctx.clearRect(0, 0, renderCanvas.width, renderCanvas.height);
      
      // get visual game state
      const visualGameState = RenderGameState.inGame.update(game, rState);
      
      // get tile size
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
        tileSize
      );
      
      gRender.render(visualGameState, {
        position: offset,
        tileSize: tileSize,
      });
      
      window.requestAnimationFrame(render);
    }
    
    window.requestAnimationFrame(render);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}