import { PuzzleFunction, Puzzle } from "../engine/puzzle.js";
import { standardFunctionLocations } from "../../engine/modes/standardModes.js";
import { Board } from "../../engine/stackerObjects.js";

const jsonDebugPuzzles = {
  0: {
    values: {
      settings: {
        functionLocations: standardFunctionLocations,
        initialization: {
          paramType: "standardJsonParams",
          parameters: {
            state: {
              das: 133.33, arr: 16.67, sdf: 30, msg: 1000,
              gravity: Infinity, lockDelay: Infinity, maxLockDelay: Infinity,
              startingLevel: 1, levelling: false, masterLevels: false,
            },
            
            nextQueue: ["I", "O", "O", "O", "T", "O"],
            board: {
              type: "simpleArray",
              width: 10,
              height: 40,
              matrix: [
                ["L", "L", "L", null, null, null, null, null, null, "I"],
                ["L", "Z", null, null, null, null, null, null, null, "I"],
                ["Z", "Z", "S", "S", null, null, null, null, null, "I"],
                ["Z", "S", "S", null, null, null, null, null, null, "I"],
              ].reverse(),
            },
          },
        },
      },
    },
    winConditions: [
      {
        version: 1,
        type: "linesFinish",
        parameters: {
          lines: 4,
        },
      },
    ],
    lossConditions: [],
    initFunction: {
      version: 1,
      type: "none",
    },
  },
};

const debugPuzzles = {
  0: new Puzzle({
    values: {
      settings: {
        functionLocations: standardFunctionLocations,
        initialization: {
          paramType: "standardInitializeParams",
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
              matrix: [
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
  1: Puzzle.fromJSON(jsonDebugPuzzles[0]).makeAllFunctions(),
};

export { debugPuzzles };