// generic keybind mappings
const keybinds = {
  moveLeftInput: [{
    keyCode: 37,
    code: "ArrowLeft"
  }],
  moveRightInput: [{
    keyCode: 39,
    code: "ArrowRight"
  }],
  softDropInput: [{
    keyCode: 40,
    code: "ArrowDown"
  }],
  hardDropInput: [{
    keyCode: 32,
    code: "Space"
  }],
  rotateCCWInput: [{
    keyCode: 90,
    code: "KeyZ"
  }],
  rotateCWInput: [{
    keyCode: 38,
    code: "ArrowUp"
  }, {
    keyCode: 88,
    code: "KeyX"
  }],
  rotate180Input: [{
    keyCode: 65,
    code: "KeyA"
  }],
  holdPieceInput: [{
    keyCode: 67,
    code: "KeyC"
  }],
  resetInput: [{
    keyCode: 82,
    code: "KeyR"
  }],
}

/**
  @param {object} inputForward // contains mappings from actions to functions
  @param {object} keybinds // contains mappings from actions to keys
*/
function addKeyboardListeners(inputForward, keybinds) {
  // which one to use (better for compatibility)
  const internalKey = "keyCode";
  
  // keyboard input as key rather than action
  const keybindMap = {};
  
  // create a map of keybinds to actions
  for (let action in inputForward) {
    const keys = keybinds[action];
    for (let key of keys) {
      keybindMap[key[internalKey]] = {
        keyDown: inputForward[action].keyDown,
        keyUp: inputForward[action].keyUp
      };
    }
  }
  
  const keyDown = function(e) {
    if (e.repeat) return;
    
    if (e[internalKey] in keybindMap) {
      keybindMap[e[internalKey]].keyDown();
    }
  }
  
  const keyUp = function(e) {
    if (e.repeat) return;
    
    if (e[internalKey] in keybindMap) {
      keybindMap[e[internalKey]].keyUp();
    }
  }
  
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);
}

/*
  example of inputForward:
  
  {
    moveLeftInput: {keyDown: () => {console.log("left")}, keyUp: () => {console.log("left up"}},
    moveRightInput: {keyDown: () => {console.log("right")}, keyUp: () => {console.log("right up"}}
  }
*/

export { addKeyboardListeners, keybinds };