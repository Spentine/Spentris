const defaultStorage = {
  handling: {
    das: 86.66, arr: 0, sdf: Infinity, msg: 1000,
  },
  keybinds: {
    play: {
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
    },
    meta: {
      resetInput: [{
        keyCode: 82,
        code: "KeyR"
      }],
    },
  },
  language: "en",
};

// another stupid singleton (there is no point)
class LocalStorageHandler {
  constructor() {
    const data = localStorage.getItem("Spentris2");
    if (data === null) {
      this.values = {};
      this.save();
    } else {
      this.load(data);
    }
    
    this.init();
    
    console.log("LocalStorageHandler initialized", this);
  }
  
  /**
   * saves the current values to localStorage
   */
  save() {
    this.jsonCompatible(this.values);
    
    localStorage.setItem("Spentris2", JSON.stringify(this.values));
    
    this.gameCompatible(this.values);
  }
  
  /**
   * loads the values from localStorage
   */
  load(data) {
    this.values = JSON.parse(data ?? localStorage.getItem("Spentris2"));
    
    this.gameCompatible(this.values);
  }
  
  jsonCompatible(v) {
    // stringify handling
    const handling = v.handling;
    for (let key in handling) {
      handling[key] = String(handling[key]);
    }
  }
  
  gameCompatible(v) {
    // parse handling
    const handling = v.handling;
    for (let key in handling) {
      handling[key] = Number(handling[key]);
    }
  }
  
  /**
   * reset localStorage
   */
  reset() {
    this.values = {};
    this.save();
  }
  
  /**
   * initialize localStorage
   */
  init() {
    // copy everything from defaultStorage if those values do not exist already
    
    const copyObj = (head, copy) => {
      for (let key of Object.keys(copy)) {
        if (head[key] === undefined) {
          head[key] = copy[key];
        } else if (typeof head[key] === "object" && !Array.isArray(head[key])) {
          copyObj(head[key], copy[key]);
        }
      }
    };
    
    copyObj(this.values, defaultStorage);
  }
}

const ls = new LocalStorageHandler();

// console.log(ls);

export { ls, LocalStorageHandler };