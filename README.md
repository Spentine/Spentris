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

## Documentation

The documentation can be found in `docs.md`.

## Extra Information

The previous version of *Spentris* can be found [here (repository)](https://github.com/Spentine/Block-Stacker) and can be played [here (webgame)](https://spentine.github.io/Block-Stacker/init.html). Have fun!

### Legal

***This game is not associated with Tetris in any way, shape, or form.*** It is a game of the *Block Stacker* genre.

### Contributors

Only Spentine for now.