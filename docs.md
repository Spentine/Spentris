# Spentris

## Overview

Spentris is a game of the Block Stacker genre. It will contain a variety of features ranging from learning material to gameplay. The program is intended for use by beginners to learn new strategies and for professionals to refresh and review their skills. All intended use purposes will be listed below:

-	Puzzles to practice new strategies
-	Lessons to teach new strategies
-	Ability to play generic game modes
-	Multiplayer over WebSocket
-	Separability of UI and Game Engine
  - Allows for separate refactoring
  - More expandability

Of all the features, the most important is to allow for expandability. This will allow for the program to continually be improved without refactoring. Addon / mod support will be implemented to assist and streamline the process of extending the program beyond its original intended purposes. The file structure will be as follows:

- `index.html`
  - *in English*
- `main.js`
- UI
  - `menu.js`
    - *provides menu UI*
  - `game.js`
    - *renders gameplay and boards*
  - `util.js`
    - *provides utility functions*
  - `style.css`
    - *styling `index.html`*
  - `addonHeader.js`
- Engine
  - `stacker.js`
  - `standardRules.js`
    - *provides standard stacker functions*
  - `util.js`
  - `data.json`
    - *provides charts such as `Rotation System` and `Piece` data*
  - `rulesetHeader.js`
  - `addonHeader.js`
- Interaction
  - `keyboard.js`
  - `controller.js`
  - `mobile.js`
- Multimodal Output
  - `audio.js`
- Rulesets / Addons
  - `invisible.js`
  - polymino
    - `polymino.js`
    - `polymino.json`
  - puzzles
    - `puzzles.js`
    - `creator.js`
    - packs
      - `1pTSD.json`
      - *... other packs ...*
  - lessons
    - `lessons.js`
    - `creator.js`
    - packs
      - beginnerTSD.json

The file structure has been created to improve the process of creating new modes or mods for the program. The engine should be separable from the UI whilst still supporting the mods. To allow for this level of modulation, not only must the file layout be optimized, but also the code in each of the scripts.

The script most core to the program is the stacker.js script, which hosts the core and purpose of the program itself; the game engine. It should be structured in such a way that permits it to be extendable and integratable with other scripts and modifications. The stacker class format specification is shown below:

- Class Stacker
  - Functions
    - Core Functions
      - `update`
      - `tick`
        - *For compatibility with controller and mobile*
        - *Works the same way as a standard tick function*
      - `placePiece`
      - `holdPiece`
      - `sonicDrop`
      - `movePiece`
      - `rotatePiece`
    - Input Functions
      - `placePieceInput`
      - `holdPieceInput`
      - `softDropInput`
      - `moveLeftInput`
      - `moveRightInput`
      - `rotateCWInput`
      - `rotateCCWInput`
      - `rotate180Input`
  - Settings
    - Function Locations
      - `"update": {"file": "standardRules", "name": "update"}`
      - *...*
    - Initialization Settings
      - Variable Overrides
        - *...*
      - Parameters
        - *...*
    - Values
      - *Contains the values of various variables such as the current score, level, and other important counters.*
      - *Stores internal values that may be used across scripts.*

The functions and values will be a direct key of the object, whereas the other settings will remain in the `settings` key.

The modular Stacker class allows for swappable functions and mods to the game. To use the Stacker class, pass an object into the Stacker class specifying the functions and prespecified variables.

The other main component to the game is the script that hosts the majority of the functions that execute the game's processes, which can be found in the standardRules.js script. To ensure the game runs properly and without refactoring errors down the line, the structure of standardRules.js will be provided below:

- `standardRules.js`
  - Functions
    - `update(time)`
      - *Advances the game state forwards towards the timestamp specified (ms).*
      - *Handles ARR and gravity*
    - `tick(time, inputs)`
      - *Advances the game state forwards towards the timestamp specified (ms).*
      - *Handles inputs*
    - `initialize(params)`
      - *Initializes the program values with the specified parameters*
      - *Creates next queue*
  - Values
    - Array `update`
      - *The variables `update()` requires*
    - Array `tick`
      - *The variables `tick()` requires*
    - Map `initialize`
      - *Maps each variable to a default initialization value*
        - `width`: 10
        - `height`: 40
        - `board`: *...*
        - `next`: *...*

The standard block stacker should be able to handle inputs inbetween frames and still maintain consistency. The inputs that only affect on keydown are the rotation keys, hard drop key, and hold key. The left and right movement keys partially affect on keydown, so they will have to fire a movement event. The down movement key does not have the same DAS/ARR system the left and right movements have, so it will only update and increase gravity.

The update() function is the most complex function because it should be able to maintain gameplay consistency regardless of update call frequency. The procedure should somewhat align with Block Stacker standards. The general use purposes are below:

-	Maintain gameplay consistency
  - Will work even after long periods of time
-	Handles ARR and gravity properly
  - Prioritize gravity first
-	Be optimized for two simultaneous inputs

However, the update() function will not carry out some functions that require inputs to perform, such as holding or rotating a piece. The update() function will update the game up to the current point. It will evaluate the changed that occurred excluding the previous point in time, but including the current point in time. There is a class gaEventHandler that can order the gravity and ARR events, defined in another program.

The processes of the update() function must start by creating a gaEventHandler and retrieving the next event. If the piece locks down before the next event (less than or equal to), It should throw away the next event and initialize a new piece (which also requires for a new gaEventHandler to be created). Afterwards, execute the next event. If the event failed (gravity has no effect because piece is on floor or ARR has no effect because piece is next to wall) then use the skip() function to retrieve the next event.