// generic keybind mappings
const playKeybinds = {
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
};

const metaKeybinds = {
  resetInput: [{
    keyCode: 82,
    code: "KeyR"
  }],
};

class KeyboardInput {
  /**
    @param {Object} inputForward // contains mappings from actions to functions
    @param {Object} keybinds // contains mappings from actions to keys
  */
  constructor(inputForward, keybinds) {
    this.internalKey = "keyCode";
    this.keybindMap = {};
    this.listenersAttached = false;
    
    // create a map of keybinds to actions
    for (let action in inputForward) {
      const keys = keybinds[action];
      if (keys === undefined) continue; // not mapped
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
    this.listenersAttached = true;
  }
  
  removeListeners() {
    document.removeEventListener("keydown", this.keyDown);
    document.removeEventListener("keyup", this.keyUp);
    this.listenersAttached = false;
  }
}

/*
  example of inputForward:
  
  {
    moveLeftInput: {keyDown: () => {console.log("left")}, keyUp: () => {console.log("left up"}},
    moveRightInput: {keyDown: () => {console.log("right")}, keyUp: () => {console.log("right up"}}
  }
*/

/**
 * @param {Object} game
 * @returns {Object}
 */
function bindInputFunctions(game) {
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
  
  return inputForward;
}

export { playKeybinds, metaKeybinds, KeyboardInput, bindInputFunctions };