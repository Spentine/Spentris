import { renderState, demoStates } from "./ui/debug/debugRenderField.js";

function main() {
  const renderCanvas = document.getElementById("renderCanvas");
  const ctx = renderCanvas.getContext("2d");
  
  function render() {
    updateCanvasDimensions();
    
    ctx.drawImage(renderState(demoStates[0]), 0, 0);
    
    window.requestAnimationFrame(render);
  }
  
  function updateCanvasDimensions() {
    if (
      window.innerWidth !== renderCanvas.width ||
      window.innerHeight !== renderCanvas.height
    ) {
      renderCanvas.width = window.innerWidth;
      renderCanvas.height = window.innerHeight;  
    }
  }
  
  window.requestAnimationFrame(render);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}