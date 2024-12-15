import { renderState, demoStates } from "./ui/debug/debugRenderField.js";
import { addKeyboardListeners, keybinds } from "./interaction/keyboard.js";
import { Stacker } from "./engine/stacker.js";
import { standardFunctions } from "./engine/standardRules.js";

function main() {
  const renderCanvas = document.getElementById("renderCanvas");
  const ctx = renderCanvas.getContext("2d");
  
  function render() {
    // ensure the canvas is the same size as the screen
    updateCanvasDimensions();
    
    // render the current board state
    ctx.drawImage(renderState(demoStates[0]), 0, 0);
    
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
  
  // add event listeners so the input is precise
  /*
  addKeyboardListeners(
    {
      moveLeftInput: {keyDown: () => {console.log("left")}, keyUp: () => {console.log("left up")}},
      moveRightInput: {keyDown: () => {console.log("right")}, keyUp: () => {console.log("right up")}}
    },
    keybinds
  );
  */
  
  const game = new Stacker({
    version: 1,
    functions: {
      update: standardFunctions.update,
      tick: standardFunctions.tick,
      initialize: standardFunctions.initialize,
    },
    settings: {
      functionLocations: {
        update: {file: "standardFules.js", name: "update"},
        tick: {file: "standardFules.js", name: "tick"},
        initialize: {file: "standardFules.js", name: "initialize"},
      },
      initialization: {
        variableOverrides: {
          
        },
        parameters: {
          
        }
      }
    }
  });
  
  console.log(game);
  
  window.requestAnimationFrame(render);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}