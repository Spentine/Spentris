import { PuzzleFunction, Puzzle } from "../engine/puzzle.js";
import { standardFunctionLocations } from "../../engine/modes/standardModes.js";
import { Board } from "../../engine/stackerObjects.js";

const debugPuzzles = {
  1: new Puzzle({
    values: {
      settings: {
        functionLocations: standardFunctionLocations,
        initialization: {
          parameters: {
            state: {
              das: 133.33, arr: 16.67, sdf: 30, msg: 1000,
              gravity: Infinity, lockDelay: Infinity, maxLockDelay: Infinity,
              startingLevel: 1, levelling: false, masterLevels: false,
            },
            
            nextQueue: ["O", "O", "O", "O", "O", "T", "O"],
            board: Board.fromSimpleArray({
              width: 10,
              height: 40,
              array: [
                ["L", "L", "L", null, null, null, null, null, null, null],
                ["L", "Z", null, null, null, null, null, null, null, null],
                ["Z", "Z", "S", "S", null, null, null, null, null, null],
                ["Z", "S", "S", null, null, null, null, null, null, null],
              ].reverse(),
            }),
          },
        },
      },
    },
    winConditions: [
      new PuzzleFunction({
        version: 1,
        type: "linesFinish",
        parameters: {
          lines: 4,
        },
      }),
    ],
    lossConditions: [],
    initFunction: new PuzzleFunction({
      version: 1,
      type: "none",
    }),
  }).makeAllFunctions(),
};

export { debugPuzzles };