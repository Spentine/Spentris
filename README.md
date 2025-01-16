# Spentris

This repository houses the *second version* of Spentris. The motivation for creating a brand new version was because of the rashness, hastiness, and spaghettification of the old code. I was unable to continue working on the previous version, so I planned and created a new version over many months. This time, I was attentive to ensure that there was sufficient planning and lookahead involved with the project. Modularity within the project is heavily utilized to make swapping parts easier. Comments must be somewhat frequent but not redundant.

## Change Settings

### Handling and Game

In `main.js`, there will be a code block that creates a new `game` object with a few parameters:

```js
  // create game
  const game = new Stacker({
    version: 1,
    functions: gameFunctions,
    settings: {
      functionLocations: functionLocations,
      initialization: {
        variableOverrides: {
          
        },
        parameters: {
          seed: "random",
          rotationSystem: SRSPlusData,
          // state: {
          //   das: 100, arr: 0, sdf: Infinity, msg: 1000,
          //   gravity: 1000, lockDelay: 500, maxLockDelay: 5000,
          //   startingLevel: 1, levelling: true, masterLevels: true,
          // },
        }
      }
    }
  });
```

to set custom handling or to change the settings, uncomment `state` and change the settings to your desires.

### Keybinds

To change the keybinds, go to `interaction/keyboard.js` and modify the JSON with the relevant key data. You can use [this site I made](https://spentine.github.io/Tests/singleFiles/keyboard.html) to help with the configuration data. You may have multiple keys binded to a single action.

## Current File Structure

- `addons`
  - *currently does not contain anything*
- `engine`
  - `allSpin.js`
    - *contains functions important for All-Spin mechanics*
  - `events.md`
    - *planning out the types of events that would exist*
    - ***deprecated***
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
  - `standardRules.js`
    - *contains all the functions to power a standard block stacker game*
    - *basically the heart of everything*
  - `standardRulesPlan.md`
    - *a plan about the hierarchy of functions to be implemented into `standardRules.js` while it was in development*
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
- `mmOutput`
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
- `docs.md` (deprecated)
  - *contains a markdown-converted document that was used to plan the game for the first two or three months*
- `eventEmitter.js`
  - *contains a class to emit events much like `addEventListener` but for objects*
- `index.html`
  - *the web page with the actual game on it*
- `main.js`
  - *the only script `index.html` imports, should load everything else*
- `README.md`
  - *GitHub readme*
  - *this file*

## Extra Information

The previous version of *Spentris* can be found [here (repository)](https://github.com/Spentine/Block-Stacker) and can be played [here (webgame)](https://spentine.github.io/Block-Stacker/init.html). Have fun!

### Legal

***This game is not associated with Tetris in any way, shape, or form.*** It is a game of the *Block Stacker* genre.

### Contributors

Only Spentine for now.