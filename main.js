// render
import { RenderGameState } from "./ui/gameRenderV1/converter.js";
import { GameRenderer } from "./ui/gameRenderV1/renderer.js";
import { tetrioSkin } from './ui/gameRenderV1/skin.js';

// handle inputs
import { KeyboardInput, bindInputFunctions } from "./interaction/keyboard.js";

// game engine
import { Stacker } from "./engine/stacker.js";

// menus
import { MenuHandler, spentrisMenus, redirectionIds, functionIds, values } from "./ui/menu/menu.js";

function main() {
  // initialize menus
  const menus = new MenuHandler({
    menus: spentrisMenus,
    redirects: redirectionIds,
    functions: functionIds,
    values: values,
    currentMenu: "home",
  });
  menus.addRedirects();
  menus.addFunctions();
  
  // start game
  menus.event.on("gameStart", (startEvent) => {
    console.log("Game Start Event", startEvent);
    
    const values = Stacker.generateSettings(
      startEvent.settings
    );
    
    // create game
    const game = new Stacker(values.gameValues);
    startEvent.initFunction(game);
    let gamePlaying = true;
    
    // create rendering engine
    const renderCanvas = menus.menus.global.renderCanvas;
    const ctx = renderCanvas.getContext("2d");
    const rState = new RenderGameState({ // converter
      game: game,
    });
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
      inputForward, values.keybinds.play
    );
    const metaKeyboardListener = new KeyboardInput(
      inputForward, values.keybinds.meta
    );
    playKeyboardListener.addListeners();
    metaKeyboardListener.addListeners();
    
    // add basic listeners
    // probably should be moved to a function
    const addListeners = function () {
      game.event.on("reset", (e) => {
        gamePlaying = true;
        addListeners();
        startEvent.initFunction(game);
        rState.addListeners();
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
      const visualGameState = rState.update();
      
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
      
      const gameRenderCanvas = gRender.render(visualGameState, {
        position: offset,
        tileSize: tileSize,
      });
      ctx.drawImage(gameRenderCanvas, 0, 0);
      
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