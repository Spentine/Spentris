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
  }, {
    keyCode: 16,
    code: "ShiftLeft"
  }],
  resetInput: [{
    keyCode: 82,
    code: "KeyR"
  }],
}

// const keybinds = {
//   moveLeftInput: [{
//     keyCode: 65,
//     code: "KeyA"
//   }],
//   moveRightInput: [{
//     keyCode: 68,
//     code: "KeyD"
//   }],
//   softDropInput: [{
//     keyCode: 83,
//     code: "KeyS"
//   }],
//   hardDropInput: [{
//     keyCode: 87,
//     code: "KeyW"
//   }],
//   rotateCCWInput: [{
//     keyCode: 37,
//     code: "ArrowLeft"
//   }],
//   rotateCWInput: [{
//     keyCode: 39,
//     code: "ArrowRight"
//   }],
//   rotate180Input: [{
//     keyCode: 40,
//     code: "ArrowDown"
//   }],
//   holdPieceInput: [{
//     keyCode: 38,
//     code: "ArrowUp"
//   }],
//   resetInput: [{
//     keyCode: 107,
//     code: "NumpadAdd"
//   }, {
//     keyCode: 13,
//     code: "NumpadEnter"
//   }],
// }

class KeyboardInput {
  /**
    @param {object} inputForward // contains mappings from actions to functions
    @param {object} keybinds // contains mappings from actions to keys
  */
  constructor(inputForward, keybinds) {
    this.internalKey = "keyCode";
    this.keybindMap = {};
    
    // create a map of keybinds to actions
    for (let action in inputForward) {
      const keys = keybinds[action];
      for (let key of keys) {
        this.keybindMap[key[this.internalKey]] = {
          keyDown: inputForward[action].keyDown,
          keyUp: inputForward[action].keyUp
        };
      }
    }
    
    this.keyDown = (e) => {
      if (e.repeat) return;
      
      const identifier = e[this.internalKey];
      if (identifier in this.keybindMap) {
        this.keybindMap[identifier].keyDown();
      }
    };
    
    this.keyUp = (e) => {
      if (e.repeat) return;
      
      const identifier = e[this.internalKey];
      if (identifier in this.keybindMap) {
        this.keybindMap[identifier].keyUp();
      }
    };
  }
  
  addListeners() {
    document.addEventListener("keydown", this.keyDown);
    document.addEventListener("keyup", this.keyUp);
  }
  
  removeListeners() {
    document.removeEventListener("keydown", this.keyDown);
    document.removeEventListener("keyup", this.keyUp);
  }
}

/*
  example of inputForward:
  
  {
    moveLeftInput: {keyDown: () => {console.log("left")}, keyUp: () => {console.log("left up"}},
    moveRightInput: {keyDown: () => {console.log("right")}, keyUp: () => {console.log("right up"}}
  }
*/

export { keybinds, KeyboardInput };