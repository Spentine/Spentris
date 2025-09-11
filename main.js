// render
import { RenderGameState } from "./ui/gameRenderV1/converter.js";
import { GameRenderer } from "./ui/gameRenderV1/renderer.js";
import { tetrioSkin } from './ui/gameRenderV1/skin.js';

// handle inputs
import { KeyboardInput, bindInputFunctions } from "./interaction/keyboard.js";

// game engine
import { Stacker } from "./engine/stacker.js";

// game start
import { gameStart } from "./unified/gameHandler.js";

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
  
  let game; // current game instance
  
  // start game
  menus.event.on("gameStart", (startEvent) => {
    game = gameStart(startEvent, {
      canvas: document.getElementById("renderCanvas"),
      updateCanvasDimensions: true,
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}