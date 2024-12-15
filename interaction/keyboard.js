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
  placePieceInput: [{
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
  }]
}

/**
  @param {object} data // contains mappings from actions to functions
*/
function addKeyboardListeners(data, keybinds) {
  // which one to use (better for compatibility)
  const internalKey = "keyCode";
  
  // keyboard input as key rather than action
  const keybindMap = {};
  
  for (let action in data) {
    const keys = keybinds[action];
    for (let key of keys) {
      keybindMap[key[internalKey]] = {
        keyDown: data[action].keyDown,
        keyUp: data[action].keyUp
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

export { addKeyboardListeners, keybinds };