# Spentris Documentation

This document will contain all the documentation for Spentris. It is intended as a reference while developing.

## About Spentris

Spentris is a game of the Block Stacker genre. It will contain a variety of features primarily directed towards helping players improve their gameplay and learn new strategies.

The code should be relatively modular with lots of documentation. It should be able to be expanded upon without much fuss or issues. There must be a lot of foresight before continual development.

Performance and memory aren't things I am worrying about at the moment, but I may optimize later. Right now, I'm focusing on keeping the code readable.

This document is the centralized documentation of the game. It will contain information about the various object formats, the processes of the game, structures of the files, and other useful information.

Planning will be relegated to other documents that may be created spontaneously and moved to the deprecation list once the creation has been completed. The updated information about the script or part may be added to this document afterwards.

## Documentation Standards

I don't really have any standards at the moment, but I still want some level of consistency within the project. When documenting, follow these general rules:

- Two-space indents
- Use mathematics when necessary
- Use a reasonable amount of headers to make navigation easier
- Reference other relevant parts of the document such as dependencies
- Keep everything up-to-date!

## Object Formats (Stacker)

Default values will automatically be filled in and marked as defaults. Keys may be optional.

### Stacker Parameters

```js
new Stacker(initializationData);
```

```js
initializationData = {
  version: 1, // {number | string} the version number (current is 1)
  functions: { // contains maps from keys to functions
    update: // {function}
    tick: // {function}
    
    // each function used within the program (as accessed by `this.[...]`)
    
    foo: // {function},
    // this.foo could be called by the other functions
  },
  settings: {
    functionLocations: // use the format specified by *Standard Function Locations*
    initialization: {
      /*
       * variableOverrides: {
       *   foo: bar
       *   // after initialization replace
       * }
       */
      // was previously intended to override variables
      // but was made obsolete by initialization parameters
      
      paramType: "standardInitializeParams", // {string}
      // the format of the parameters
      /* 
       * - standardInitializeParams (regular format)
       * - standardJsonParams (JSON-friendly format)
       */
      
      parameters: {
        // each key is optional and may be omitted
        // if a key is omitted the game will use predefined default values
        
        seed: 0, // {"random" | number}
        rotationSystem: // use the format specified by *Rotation System Data*
        state: {
          // keys are optional
          
          // if the handling settings are set to null, it will be overriden by the user settings
          // all of type {(number | null)}
          arr: null // ms/repeat
          das: null, // ms/delay
          sdf: null, // factor (× gravity, higher number is faster)
          dcd: null,
          msg: null, // ms/drop (minimum sdf gravity)
          are: null,
          lca: null,
          
          gravity: Infinity, // {number} ms/drop
          lockDelay: 500, // {number} ms/lock
          maxLockDelay: 5000, // {number} ms/lock
          
          startingLevel: 1, // {number} starting level for the game
          levelling: false, // {boolean} whether levelling would influence the game
          masterLevels: false, // {boolean} decides whether levels above 20 are master levels
        },
        
        // only takes action if params.board is undefined
        width: 10, // {number} width of the board
        height: 40, // {number} height of the board
        
        // standardInitializeParams
        board: new Board(
          params.width, // default 10
          params.height, // default 40
        ), // Board type defined by *Object `Board`*
        
        // standardJsonParams
        board: {
          type: // {string} the type of board format
          
          // simpleArray
          width: // {number}
          height: // {number}
          matrix: // {string[][]} where string is piece name or mino color
        },
        
        nextQueue: [], // {string[]} where each string represents a piece
        refillQueue: 5, // {number} mininum number of pieces in the queue at any given time
        currentPiece: // {Piece} where it is the current piece
        
        holdPiece: // {(string | null) the current hold piece represented by a string
        
        eventEmitter: new EventEmitter(); // {EventEmitter}
      }
    }
  }
}
```

> **Reference Directory**
> - [Standard Function Locations](#standard-function-locations)
> - [Rotation System Data](#rotation-system-data)
> - [Object `Board`](#object-board)

### Standard Function Locations
Only used to make defining the functions in `initializationData.functions` easier than creating a bunch of functions. It also has a greater possibility of modularity and exporting because it uses all regular JSON objects. In `engine/util.js`, `function functionLocationAccessor();` could be used to convert `standardFunctionLocations` into a `initializationData.functions` format.

```js
standardFunctionLocations = {
  update: {file: "standardRules.js", name: "update"},
  tick: {file: "standardRules.js", name: "tick"},
  
  // each key will be converted to a function
  
  foo: {
    file: "bar.js", // {string} file to access from
    name: "foo" // {string} function name
  },
  
  // the file to name object is defined in `engine/functionLibrary.js`.
  // the file name is chosen to make it easier to remember, but it's really arbitrary.
}

// how to convert to gameFunctions for use in initializationData.functions
const gameFunctions = functionLocationAccessor(
  standardFunctionLocations, // object of functions
  files // file to object mapping
);
```

### Rotation System Data

```js
rotationSystemData = {
  // contains an array of the piece names
  pieces: [ // {string[]} where each string is a piece name
    "Z", "L", "O", "S", "I", "J", "T" // standard tetromino pieces
  ],
  
  // contains the data for the piece matrices (where the minos are)
  matrices: {
    // {key: matrix[]} where matrix is {(0 or 1)[][]}
    
    Z: [
      // there will only be 4 matrices for the 4 possible rotations
      // the first item is the spawn rotation
      // each successive item is a rotation clockwise 90 degrees
      [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
        
        // note how it's flipped across the x-axis
        // lower index is lower on the board
        // it will actually display as:
        
        /*
         * [][]__
         * __[][]
         * ______
         */
        
        // where 1 is represented as [] and 0 as __
      ],
      [ /* ... */ ],
      [ /* ... */ ],
      [ /* ... */ ],
    ],
    L: /* ... */
  },
  
  // contains piece kicks
  kicks: {
    // {key: kicks[][]} where kicks is {kick[]} and kick is {x:..., y:...}
    
    Z: [
      // outer array contains 4 arrays for 4 starting rotations
      // each array contains 4 more arrays for the 4 ending rotations
      // the very inner `kicks` array contains a list of testing kicks
      [
        [{x: 0, y: 0}], // will only try moving to the same position
        [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: 1}, {x: 0, y: -2}, {x: -1, y: -2}],
        [ /* ... */ ],
        [ /* ... */ ],
      ],
      [ /* ... */ ],
      [ /* ... */ ],
      [ /* ... */ ],
    ],
    L: /* ... */
    
    // to access a particular piece's kicks
    // kicks = rotationSystem.kicks[pieceName][startingRotation][endingRotation]
    // kicks[0] is the first position test
    // kicks[1] is the second position test
    // ... etc ...
  },
  
  // contains the spawn positions for each piece
  spawnPositions: {
    // {key: {x:..., y:...}}
    
    Z: {x: 3, y: 20}, // spawn Z piece at (3, 20)
    L: /* ... */
  }
}
```

### Object `Board`

```js
// constructor
// width: board width
// height: board height
board = new Board(width, height);
```

```js
// board object keys
board = {
  width: // {number} width of board
  height: // {number} height of board
  matrix: // {BoardMino[][]} board matrix
}
```

### Object `Puzzle`

```js
puzzle = new Puzzle({
  parameters: // {object} becomes `this.parameters`
  values: // {object} stacker initialization values
  
  winConditions: // {puzzleFunction[]}
  lossConditions: // {puzzleFunction[]}
  // prioritizeWinCondition: true, // {boolean}
  initFunction: // {puzzleFunction}
});
```

```js
puzzle = {
  version: 1, // {number | string} puzzle version
  // not to be confused with parameter versions, those are separate
  
  parameters: {
    // the parameters as specified by *Stacker Parameters*
  },
  
  // if any of the conditions are true the game will end on a win
  winConditions: // {puzzleFunction[]}
  
  // if any of the conditions are false the game will end on a loss
  lossConditions: // {puzzleFunction[]}
  
  // if both end functions activate at the same time
  // will the player win?
  // prioritizeWinCondition: true, // {boolean}
  
  // init function to run before the game starts
  initFunction: // {puzzleFunction}
}
```

```js
puzzleFunction = {
  version: 1, // version of puzzle function
  type: // {string} the type of end condition or function
  parameters: // {object} the data for end condition or function
  func: // {function} function generated or provided
}
```
When the puzzle is saved as a JSON file, the `func` functions cannot be represented. The `type` and `parameters` should hopefully be enough to reconstruct the `func` function.

Both `initFunction` and `(win/loss)Conditions[i]` should use the exact same format, including for the list of valid types. Although it may not make sense, it's all just functions in the end, just ran at different points in time.

`prioritizeWinCondition` is not really possible to enforce, so consider removing its existence from all the comments.

> **Reference Directory**
> - [Stacker Parameters](#stacker-parameters)

### `clearsFinish` Puzzle Function Format

```js
const puzzleFunction = {
  clears: [
    // clear objects with omitted keys
    // if the keys are omitted, then it can be any value
    
    { // TSD
      lines: 2,
      piece: "T",
      spin: "full"
    },
    
    { // PC with I
      piece: "I",
      perfectClear: true
    }
  ],
  
  type: "all", // {string} how to handle the clears
  
  type: "all", // all clears must be cleared in any order
  type: "sequential", // all clears must be cleared in order
  
  endType: "clearsFinish", // {string} type of end event to emit
}
```

> **Reference Directory**
> - [Event `clear`](#standard-stacker)

### `Stacker.generateSettings` Data Format

```js
static generateSettings(data) {} ==> result
```

```js
data = {
  standard: // {initializationData} the base mode
  initFunction: // {function} the initialization function (?)
  settings: { // modifications to the standard rule
    // nothing
    // keybinds (?)
    // the keybinds don't really have to be passed in it's useless to the Stacker class
  }
}
```

```js
result = {
  initData: // {initializationData} the ready initialization data
  initFunction: // {function} the initialization function
}
```

> **Reference Directory**
> - [Object `initializationData`](#stacker-parameters)

## Future Object Formats

### Puzzle Set

```js
puzzleSet = {
  name: // {string}
  
  // keys will map to puzzles
  // it is not an array because it's easier to organize keys
  puzzles: {
    // {key: Puzzle}
  },
  
  // randomization distribution
  // the key refers to the puzzle and the default weighing is 1
  // change to a higher number for a better chance at being chosen
  distribution: // {key: Number}
}
```

## Object Formats (UI)

### Translations

```js
translations = {  // {Key: string} each string is 2-letter language code
  en: { // {object} contains data for language
    translations: { // {object} contains translation data
      game: {
        scoreTitle, linesTitle, levelTitle,
        timeTitle, spinTitle, ppsTitle
        
        clearConvert: (clear) => {} // {function} converts clear to string
      }
      ui: { // {object} where each key is an id for a particular UI element
        // {string} key: {string} translation
        // may also contain functions in the future but they will be indicated
      }
    },
    font: {
      ui: // {string} the font-family style for the ui
      gameStats: // {string} the font-family style for the game
    }
  }
}
```

> **Reference Directory**
> - [UI Menu](#menu)

### Menu Values
A new approach should be taken when considering the interaction between the UI and game engine. To emphasize modularity, the UI and game engine data structures should be largely separate. The only data the UI should store are values only it has control over, whereas another function will help provide the bridge between the UI data type and game engine data type.

The UI data type should be, in many ways, similar to the `LocalStorageHandler` data type.

### Puzzle Menu `createHeader` Data Format
The data format specifies how the `PuzzleMenuHandler` creates a complex header with many options.

```js
puzzleUiFunctions.createHeader(data) {
  
}
```

```js
data = {
  type: "menuBar" // {string} specifies a menu bar with a hierarchical structure
  
  // type: "menuBar"
  root: [ // {object[]} start of hierarchy
    {
      text: // {string} button text
      
      type: "button", // an interactable button
      interact: // {function} when pressed
      
      type: "tree", // more buttons
      sub: // {array} "sublevel" (same type as root)
    },
    /* ... */
  ],
}
```

## Object Formats (Misc)

### `LocalStorageHandler`

```js
this.values = {
  handling: // {handling}
  keybinds: {
    /**
     * {
     *   type: {
     *     action: {
     *       keycode: integer, code: string}[]
     *     }
     *   }
     */
    play: {
      moveLeftInput, moveRightInput, softDropInput, hardDropInput,
      rotateCCWInput, rotateCWInput, rotate180Input, holdPieceInput
    },
    meta: {
      resetInput
    }
  },
  language: // {string} two letter code for language
}
```

> **Reference Directory**
> - [Handling](#handling)

### Handling

```js
handling = { // {key: {number}}
  arr: 0,         // Auto Repeat Rate
                  // ms / repeat
  
  das: 100,       // Delayed Auto Shift
                  // ms / delay
  
  sdf: Infinity,  // Soft Drop Factor
                  // factor (× gravity, higher number is faster)
  
  dcd: 0,         // DAS Cut Delay
                  // ms / delay
  
  msg: 1000,      // Minimum SDF Gravity
                  // ms / line
  
  are: 0,         // Entry Delay
                  // ms / delay
  
  lca: 0          // Line Clear ARE
                  // ms / delay
}
```

Note that *ARE* isn't an acronym. It is actually a romanization of the Japanese word あれ used to refer to the entry delay.

## Puzzles

Puzzles are an important component of the project mainly because it provides purpose and reason to play the game. It is also sufficiently complex to warrant having an independent section on this documentation.

### JSON Compliance

Puzzles contain many abstracts that aren't easy to replicate in JSON, most particularly, functions. To resolve this issue, a separate class `PuzzleFunction` has been created that takes in JSON parameters and outputs a function. In this sense, a function can be effectively encoded as if it were a JSON.

## Current File Structure

- `.github`
  - `workflows`
    - `static.yml`
      - *deploys Spentris to GitHub Pages*
- `addons` (empty)
  - *currently does not contain anything*
- `deprecated` (deprecated)
  - `docs.md`
    - *contains a markdown-converted document that was used to plan the game for the first two or three months*
  - `events.md`
    - *planning out the types of events that would exist*
  - `menu.js`
    - *was made deprecated on 20250603 due to the changes made from replacing the entire ui system*
    - *kept as a reference*
  - `standardRulesPlan.md`
    - *a plan about the hierarchy of functions to be implemented into `standardRules.js` while it was in development*
- `documentation`
  - `docs.md`
    - *documentation for the entire game*
    - *this file*
- `engine`
  - `modes`
    - *contains scripts that contain data to run different game modes*
    - `standardModes.js`
      - *contains three simple guideline modes*
  - `stackerFunctions`
    - *contains scripts with functions that modify the stacker*
    - `standardRules.js`
      - *contains all the functions to power a standard block stacker game*
      - *basically the heart of everything*
    - `allSpin.js`
      - *contains functions important for All-Spin mechanics*
  - `functionLibrary.js`
    - *combines all the `Stacker` functions into one object that can be readily accessed*
  - `nextEvent.js`
    - *contains a class that powers the time-based system to handle gravity and ARR*
    - *was difficult to fully comprehend so I put it in a different file*
  - `rsData.js`
    - *contains rotation system data for SRS and SRS+*
  - `stacker.js`
    - *contains the base `Stacker` class*
  - `stackerObjects.js`
    - *contains important `Stacker` objects like `BoardMino`s and `PieceMino`s
  - `util.js`
    - *contains utilities (like functions or constants) that are not dependent on any other file*
- `interaction`
  - `gamepad.js` (empty)
    - *will contain a class to handle inputs provided by the Gamepad API*
  - `keyboard.js`
    - *contains a class to handle keyboard inputs*
- `localization` (needs reworking)
  - `language.js`
    - *contains language data for translations*
    - *is a .js file because there are functions within the language object*
    - *JP language was just an example to test it with multiple languages but it was primarily translated by GitHub Copilot's autocomplete because I was too lazy to look up the actual terms myself*
    - *please help contribute <3*
- `localStorage`
  - *will contain scripts to manage reading and writing with the `localStorage` property*
  - *must be backwards compatible so that local settings aren't reset on a refactor*
  - localStorage.js
    - *contains a singleton class to manage `localStorage`*
- `mmOutput` (unused)
  - *multimedia output*
  - `audio` (empty)
    - *will contain files that will handle audio*
- `planning`
  - *will contain files that will plan the future of the game*
  - `Spentris Puzzle Editor.penpot`
    - *planning the UI of the puzzle editor*
    - *has to be viewed with penpot, a design tool*
- `ui`
  - `debug` (deprecated)
    - `debugRenderField.js` (deprecated)
      - *a basic rendering system that was made before the engine purely for debugging and testing purposes*
  - `fonts`
    - `Bloxyl.otf`
      - *a font I made a while ago that fits the style of this game*
      - *doesn't really adhere to font standards so beware*
    - `GN-Kin-iro_SansSerif.ttf` (unused)
      - *a Japanese font*
    - `Kaisotai-Next-UP-B.otf`
      - *a Japanese font*
  - `gameRenderV1`
    - *the first iteration of the rendering engine*
    - *uses `CanvasRenderingContext2D` to render, which may not be very performant*
    - `converter.js`
      - *contains a `RenderGameState` class to convert a `Stacker` object into a renderer-digestible format*
      - *exists only for the sake of modularity*
    - `renderer.js`
      - *processes a `RenderGameState` object and renders the board state to a canvas*
    - `rsData.js`
      - *contains simple rotation system data (really only the matrices) which are necessary for the renderer to function*
      - *consider removing it in place of using the actual data from the rotation system which would reduce modularity but would be better*
        - *also consider converting the rotation system data used by the engine into a digestible format to fix the modularity*
        - *modularity is my pookie <3*
    - `skin.js`
      - *contains `TileMap` and `GameSkin` classes which help facilitate the rendering of minos*
      - *will also render other stuff besides minos but not now*
  - `menu` (in development)
    - *contains scripts to process the menu UIs*
    - *current (and 2nd) version of the menus with more centralization and a function-based approach*
    - *do not mention v2 any more when referencing it, it is a bit redundant to keep repeating it*
    - *in the future, if this is replaced, use V3 at the end of class names (or not depending on how much i change)*
    - `puzzles`
      - *contains a UI designated specifically for the puzzle feature of the game (`PuzzleMenuHandler`)*
      - `puzzleMenu.js`
        - *contains the functions used to render the menus for `PuzzleMenuHandler`*
      - `puzzleMenuHandler.js`
        - *contains the core definition of `PuzzleMenuHandler` as an extension of `MenuHandler`*
    - `converter.js`
      - *converts formats between the `MenuHandler` and the game engine, particularly `Stacker`.*
    - `defaultValues.js`
      - *contains the default values `MenuHandler` will contain, which it can then use to generate values for the game engine*
    - `menu.js`
      - *contains the functions used to render the menus for `MenuHandler`*
    - `menuHandler.js`
      - *contains the core definition of `MenuHandler`*
  - `skins`
    - *contains images with texture data*
    - *ghost.png also contains images for the next piece spawn*
    - `TETRIO`
      - `ghost.png`
      - `minos.png`
    - `TETRIOconnected` (unused)
      - `ghost.png`
      - `minos.png`
- `puzzles`
  - `engine`
    - *contains scripts that handle running the puzzles using the engine*
    - `puzzle.js`
      - *contains puzzle objects*
    - `puzzleFunctions.js`
      - *contains all the puzzle functions*
  - `ui` (empty)
    - *contains scripts that present puzzles to the user*
- `unitTests`
  - *contains scripts to perform unit tests.*
  - `copyObjByTraversal.js`
    - *performs various unit tests on the function `copyObjByTraversal` in `util.js`. it is a bit redundant now, but it is good to keep!
- `eventEmitter.js`
  - *contains a class to emit events much like `addEventListener` but for objects*
- `index.html`
  - *the web page with the actual game on it*
- `mainV2.html`
  - *second version of `index.html` but with v2 menus*
- `main.js`
  - *the only script `index.html` imports, should load everything else*
- `README.md`
  - *GitHub readme*

## Events

### Standard Stacker

- `update`
  - *emitted every time `update()` is called*
  - ```js
    this.event.emit("update", {
      time: this.time, // {number} the time at which the event occurred
      success: true, // {boolean} whether the placement succeeded (always true)
    });
- `move`
  - *emitted whenever the piece is moved left or right*
  - ```js
    this.event.emit("move", {
      time: this.time, // {number} the time at which the event occurred
      direction: // {number} the amount of x movement (1 for right, -1 for left)
      
      origin: // {string} the origin of the movement
      
      // triggered by ARR
      origin: "arr", // auto repeat rate
      speed: this.state.arr, // {number} speed of arr
      
      // triggered by keypress
      origin: "userInput", // initial keypress
      
      success: true, // {boolean} whether the movement succeeded
    });
    ```
- `rotate`
  - *emitted when the piece rotates*
  - ```js
    this.event.emit("rotate", {
      time: this.time, // {number} the time at which the event occurred
      
      // 0: spawn rotation
      // 1: 90° clockwise from spawn rotation
      // 2: 180° clockwise from spawn rotation
      // 3: 270° clockwise from spawn rotation
      
      oldRotation: oldRotation, // {number} the previous rotation value
      newRotation: newRotation, // {number} the new current rotation value
      
      spin: this.spin, // {null | "full" | "mini"} whether the rotation resulted in a spin bonus
      origin: "userInput", // {string} origin of rotation (only "userInput")
      success: rotation.success, // {boolean} whether the rotation was successful
    });
    ```
- `hold`
  - *emitted when the piece is held*
  - ```js
    this.event.emit("hold", {
      time: this.time, // {number} the time at which the event occurred
      origin: "userInput", // the origin of the hold (only "userInput")
      success: true, // {boolean} whether the hold was successful
    });
    ```
- `drop`
  - *emitted whenever the piece is moved down*
  - ```js
    this.event.emit("drop", {
      time: this.time, // {number} the time at which the event occurred
      type: "gravity", // {string} the type of drop
      
      // {string} the origin of the drop
      origin: "gravity", // soft drop not active
      origin: "userInput", // soft drop active
      
      speed: this.gravity, // {number} speed of the soft drop
      
      success: true, // {boolean} whether the drop succeded
    });
    ```
- `place`
  - *emitted whenever the piece is placed*
  - ```js
    this.event.emit("place", {
      time: this.time, // {number} the time at which the event occurred
      
      type: // the reason for the placement
      origin: // the origin of the placement
      
      // triggered by lock delay
      type: "lockDelay", // placed by lock delay
      origin: "lockDelay", // placed because of lock delay
      
      // triggered by hard drop
      type: "hardDrop", // placed by hard drop
      origin: "userInput", // placed because of user input
      
      success: true, // {boolean} whether the placement succeeded
      // (whether it was successful in placement, doesn't factor in next piece spawn)
    });
- `clear`
  - *emitted every piece placement with piece clear data*
  - ```js
    this.event.emit("clear", {
      time: this.time, // {number} the time at which the event occurred
      lines: linesCleared, // {number} number of lines cleared
      spin: this.spin, // {null | "full" | "mini"} current spin
      b2b: this.b2b, // {number} current b2b (+1)
      combo: this.combo, // {number} current combo (+2)
      piece: this.currentPiece.type, // {string} current piece type / name
      perfectClear: perfectClear, // {boolean} whether the clear resulted in a perfect clear
      success: linesCleared > 0, // {boolean} whether any lines were cleared
    });
    ```
- `end`
  - *emitted when the game ends*
  - The game may also have custom ending types as specified by puzzles or modes upon completion or failure which do not fit into the typical definitions of when the game ends.
  - ```js
    this.event.emit("end", {
      time: this.time, // {number} the time at which the event occurred
      type: "blockOut", // {string} the type of ending
      success: true, // {boolean} whether the game ended (always true)
    });
    ```

### Menu
- `menuChange`
  - *emitted on every menu change*
  - ```js
    this.event.emit("menuChange", {
      time: Date.now(), // {number} the timestamp of occurrence
      previousMenu: // {string} the previous menu name
      currentMenu: // {string} the current menu name
    });
- `gameStart`
  - *emitted when the menu requests for a game to start*
  - ```js
    this.event.emit("gameStart", {
      time: Date.now(), // {number} the timestamp of occurrence
      mode: // {string} the mode that is being played
      settings: { // {object} the settings for the game
        handling: // {handling}
        keybinds: // keybinds
        puzzle: // puzzle
      }
    });
    ```

> **Reference Directory**
> - [Handling](#handling)

## Menu

The string in the parathensized monospaced format is the corresponding translation key. *Italic menu options are planned and not in the game.*

Main Menu
- Game (`menuHomeButtonGame`)
  - Back (`menuGameButtonBack`)
  - Standard Gamemodes (`menuGameButtonStandardGamemodes`)
    - Back (`menuStandardGamemodesButtonBack`)
    - Marathon (`menuStandardGamemodesButtonMarathon`)
    - Sprint (`menuStandardGamemodesButtonSprint`)
    - Ultra (`menuStandardGamemodesButtonUltra`)
  - Puzzles (`menuGameButtonPuzzles`)
    - Back (`menuPuzzlesButtonBack`)
    - Play (`menuPuzzlesButtonPlay`)
      - Back (`menuPlayPuzzlesButtonBack`)
      - Listing (`menuPlayPuzzlesButtonListing`)
      - Import (`menuPlayPuzzlesButtonImport`)
    - Create (`menuPuzzlesButtonCreate`)
      - Back (`menuCreatePuzzlesButtonBack`)
      - New (`menuCreatePuzzlesButtonNew`)
      - Template (`menuCreatePuzzlesButtonTemplate`)
      - Import (`menuCreatePuzzlesButtonImport`)
- Settings (`menuHomeButtonSettings`)
  - Back (`menuSettingsButtonBack`)
  - Handling (`menuSettingsButtonHandling`)
    - Back (`menuHandlingButtonBack`)
    - ARR (`menuHandlingARRLabel`)
    - DAS (`menuHandlingDASLabel`)
    - SDF (`menuHandlingSDFLabel`)
    - DCD (`menuHandlingDCDLabel`)
    - MSG (`menuHandlingMSGLabel`)
    - ARE (`menuHandlingARELabel`)
    - LCA (`menuHandlingLCALabel`)
  - Keybinds (`menuSettingsButtonKeybinds`)
    - Back (`menuKeybindsButtonBack`)
    - Left (`menuKeybindsLeftLabel`)
    - Right (`menuKeybindsRightLabel`)
    - Soft Drop (`menuKeybindsSoftDropLabel`)
    - Hard Drop (`menuKeybindsHardDropLabel`)
    - Rotate CCW (`menuKeybindsRotateCCWLabel`)
    - Rotate CW (`menuKeybindsRotateCWLabel`)
    - Rotate 180 (`menuKeybindsRotate180Label`)
    - Hold Piece (`menuKeybindsHoldPieceLabel`)
    - Reset Game (`menuKeybindsResetGameLabel`)
- Language (`menuHomeButtonLanguage`)
  - Back (`menuLanguageButtonBack`)
  - English (`menuLanguageButtonEnglish`)
  - 日本語 (Japanese) (`menuLanguageButtonJapanese`)

> **Reference Directory**
> - [Object `translations`](#translations)

## Mathematics

### Current Level
The current level, as determined from a function of the number of lines cleared, $l$, is equal to:

$$\left\lfloor 10l \right\rfloor$$

### Drop Speed
The current drop speed in $\text{ms} \times \text{lines}^{-1}$ is equal to:

$$\frac{1000 \text{ms}}{\text{lines}} \times \left(0.8 - 0.7\left(\text{level} - 1\right)\right)^{\text{level}-1}$$

### Lock Delay
The lock delay is a function of the form $\frac{1}{bx + c}$ where it is defined to intersect two points $\alpha$ and $\beta$. In the game, $\alpha$ is chosen to be at $(\text{level}\,20, 500\text{ms})$ and $\beta$ at $(\text{level}\,40, 150\text{ms})$. In terms of $x$, $x_l$ will denote the level and $x_d$ will denote the lock *d*elay.  To solve for $b$ and $c$ in terms of $\alpha$ and $\beta$, just isolate it.

$$
\begin{cases}
  \frac{1}{\alpha_l b + c} = \alpha_d \\
  \frac{1}{\beta_l b + c} = \beta_d \\
\end{cases}
$$

$$
\begin{cases}
  1 = \alpha_d \left(\alpha_l b + c \right) \\
  1 = \beta_d \left(\beta_l b + c \right) \\
\end{cases}
$$

I deleted all the solution steps because it was just unnecessary. Answer:

$$
c = \frac{\alpha_d \alpha_l - \beta_l \beta_d}{\beta_d \alpha_d \left(\alpha_l - \beta_l \right)}
$$

$$
b = \frac{1 - \alpha_d c}{\alpha_d \alpha_l}
$$

Plugging the specified values for $\alpha$ and $\beta$ yields these values: $c = - \frac{1}{375}$, $b = \frac{7}{30000}$

### Score

- $1$ point for every line moved down by soft drop
- $2$ points for every line moved down by hard drop

#### Line Clears
- *the number of line clears is equal to $l$*
- *the number of combo is equal to $c$*
- **0** lines cleared
  - $+0 \text{ points}$ for no spin
  - $+100 \text{ points}$ for mini spin
  - $+400 \text{ points}$ for full spin
- **≥1** line cleared
  - *no spin*
    - $
      \begin{cases} 
        100 \text{ points}, & \text{if } l = 1 \\
        300 \text{ points}, & \text{if } l = 2 \\
        500 \text{ points}, & \text{if } l = 3 \\
        800 \text{ points}, & \text{if } l = 4
      \end{cases}
      $ 
  - *mini spin*
    - $+200l \text{ points}$
  - *full spin*
    - $+400(l+1) \text{ points}$
- **afterwards**
  1. multiply number of points gained by $1.5$ if there is b2b
  2. add $50c$ if there is combo
  3. check for perfect clear and add the corresponding score if necessary
  4. multiply number of points (after steps 1-3) by the level count
- **perfect clear**
  - add $
    \begin{cases} 
      800 \text{ points}, & \text{if } l = 1 \\
      1200 \text{ points}, & \text{if } l = 2 \\
      2000 \text{ points}, & \text{if } l = 3 \\
      3200 \text{ points}, & \text{if } l = 4
    \end{cases}
    $ 

## To-do

- [ ] UI
  - [x] Create `MenuHandler` Class
  - [x] Create menu interface that allows for users to play
  - [x] Create settings interface that allows for users to change handling and keybinds
    - [x] Handling
    - [x] Keybinds
      - [ ] Fix keybinds for different keyboard layouts
  - [x] Update localization support for the UI
  - [ ] Create ending screen for games 
  - [x] Prevent SDF from going below 1
  - [x] V2
    - [x] Create `MenuHandlerV2` Class
    - [x] Implement all current features of `MenuHandler` Class
    - [x] Deprecate V1 and try to remove traces of it
- [ ] Persistent Data
  - [x] Save data with `localStorage`
  - [ ] Save data to a file
    - [ ] Export data
    - [ ] Import data
- [ ] Game
  - [x] Create more modes
    - [x] 40L
      - [ ] make time start when you move first piece
    - [x] Blitz / Ultra
  - [ ] Ability to create a custom mode
  - [x] Add all-spin+ with T-piece immobility
  - [x] Remove `mode` parameter from `generateNext`
- [ ] Puzzles
  - [ ] Create puzzle selection interface
  - [ ] Create designated puzzle creator
    - [ ] Support the creation of puzzles with a particular clear as the win requirement
    - [ ] Support the creation of puzzles with particular piece placements as the win requirement
  - [ ] Automatically generate puzzles
  - [x] Make puzzle format JSON-compliant
- [ ] Lessons
  - *too far ahead, give it a year at this pace*
- [ ] Code
  - [ ] Centralize all values
  - [x] Enforce D.R.Y. principle
  - [ ] Remove logic from input handler functions in engine
  - [x] Move value change conversion from menu scripts to engine
  - [ ] Test `clearsFinish` puzzle function
- [ ] URL
  - [ ] Redirect users with URL-specified parameters
  - [ ] Dynamically update URL with current menu