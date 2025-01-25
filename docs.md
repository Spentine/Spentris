# Spentris Documentation

This document will contain all the documentation for Spentris. It is intended as a reference while developing.

## Object Formats

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
      // but was made obsolete by initialization parametsrs
      
      parameters: {
        // each key is optional and may be omitted
        // if a key is omitted the game will use predefined default values
        
        seed: 0, // {"random" | number}
        rotationSystem: // use the format specified by *Rotation System Data*
        state: {
          // keys are optional
          
          das: 83.33, // {number} ms/delay
          arr: 0, // {number} ms/repeat
          sdf: Infinity, // {number} factor (× gravity, higher number is faster)
          msg: 1000, // {number} ms/drop (minimum sdf gravity)
          
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
        
        board: new Board(
          params.width, // default 10
          params.height, // default 40
        ), // Board type defined by *Object `Board`*
        
        nextQueue: [], // {string[]} where each string represents a piece
        refillQueue: 5, // {number} mininum number of pieces in the queue at any given time
        
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

> **Reference Directory**
> - [Object `Puzzle`](#object-puzzle)

### Object `Puzzle`

```js
puzzle = new Puzzle({
  parameters: // {object} becomes `this.parameters`
  winConditions: // {puzzleFunction[]}
  lossConditions: // {puzzleFunction[]}
  prioritizeWinCondition: true, // {boolean}
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
  prioritizeWinCondition: true, // {boolean}
  
  // init function to run before the game starts
  initFunction: // {puzzleFunction}
}
```

```js
puzzleFunction: {
  version: 1, // version of puzzle function
  type: // {string} the type of end condition or function
  parameters: // {object} the data for end condition or function
  func: // {function} function generated or provided
}
```
When the puzzle is saved as a JSON file, the `func` functions cannot be represented. The `type` and `parameters` should hopefully be enough to reconstruct the `func` function.

Both `initFunction` and `(win/loss)Conditions[i]` should use the exact same format, including for the list of valid types. Although it may not make sense, it's all just functions in the end, just ran at different points in time.  

> **Reference Directory**
> - [Stacker Parameters](#stacker-parameters)

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
  - `standardRulesPlan.md`
    - *a plan about the hierarchy of functions to be implemented into `standardRules.js` while it was in development*
  - `main.js`
    - *an old version of main.js that would contain all the values and run everything necessary for the game engine to function*
    - *replaced in lieu of a new version with menu features and better code overall*
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
    - `defaultValues.js`
      - *contains the default values `MenuHandler` will contain, which it can then use to generate values for the game engine*
    - `menu.js`
      - *will handle the menus and integrate closely with the HTML and CSS*
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
  - `engine` (empty)
    - *contains scripts that handle running the puzzles using the engine*
  - `ui` (empty)
    - *contains scripts that present puzzles to the user*
- `docs.md`
  - *documentation for the entire game*
  - *this file*
- `eventEmitter.js`
  - *contains a class to emit events much like `addEventListener` but for objects*
- `index.html`
  - *the web page with the actual game on it*
- `archivedMain.js`
  - *an archived version of `main.js` that is used for future reference when trying to reoperate the main game engine*
- `main.js`
  - *the only script `index.html` imports, should load everything else*
- `README.md`
  - *GitHub readme*

## Menu

*Italic menu options are planned and not in the game.*

Main Menu
- Game
  - Standard Gamemodes
    - Marathon
    - Sprint
    - Ultra
  - Puzzles
    - Play
      - Listing
      - Import
    - Create
      - New
      - Template
      - Import
- Settings
  - Back
  - Handling
    - ARR
    - DAS
    - SDF
    - DCD
    - MSG
    - ARE
    - LCA
  - Keybinds
    - Left
    - Right
    - Soft Drop
    - Hard Drop
    - Rotate CCW
    - Rotate CW
    - Rotate 180
    - Hold Piece
    - Reset Game
- Language
  - Back
  - English
  - 日本語 (Japanese)

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
  - [ ] Remove `mode` parameter from `generateNext`
- [ ] Puzzles
  - [ ] Create puzzle selection interface
  - [ ] Create designated puzzle creator
  - [ ] Automatically generate puzzles
- [ ] Lessons
  - *too far ahead, give it a month or two*
- [ ] Code
  - [ ] Centralize all values
  - [x] Enforce D.R.Y. principle
  - [ ] Remove logic from input handler functions in engine
- [ ] URL
  - [ ] Redirect users with URL-specified parameters