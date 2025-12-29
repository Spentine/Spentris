import { PuzzleFunction, Puzzle } from "../engine/puzzle.js";
import { standardFunctionLocations } from "../../engine/modes/standardModes.js";
import { Board } from "../../engine/stackerObjects.js";
import { puzzleFunctions } from "../engine/puzzleFunctions.js";

const jsonDebugPuzzles = {
  0: {
    parameters: {
      settings: {
        functionLocations: standardFunctionLocations,
        initialization: {
          paramType: "standardJsonParams",
          parameters: {
            state: {
              // das: 133.33, arr: 16.67, sdf: 30, msg: 1000,
              arr: null,
              das: null,
              sdf: null,
              dcd: null,
              msg: null,
              are: null,
              lca: null,
              
              gravity: Infinity, lockDelay: Infinity, maxLockDelay: Infinity,
              startingLevel: 1, levelling: false, masterLevels: false,
              
              nextQueue: ["I", "O", "O", "O", "T", "O"],
            },
            
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
    puzzleFunctions: [
      {
        version: 1,
        type: "linesFinish",
        parameters: {
          lines: 4,
        },
      },
    ],
    metadata: {
      name: "Debug Puzzle 0",
      author: "Spentine",
      description: "A puzzle for debugging purposes.",
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    },
  },
};

const debugPuzzles = {
  0: new Puzzle({
    version: 1,
    parameters: {
      settings: {
        functionLocations: standardFunctionLocations,
        initialization: {
          paramType: "standardInitializeParams",
          parameters: {
            state: {
              // das: 133.33, arr: 16.67, sdf: 30, msg: 1000,
              arr: null,
              das: null,
              sdf: null,
              dcd: null,
              msg: null,
              are: null,
              lca: null,
              
              gravity: Infinity, lockDelay: Infinity, maxLockDelay: Infinity,
              startingLevel: 1, levelling: false, masterLevels: false,
              
              nextQueue: ["O", "O", "O", "O", "O", "T", "O"],
            },
            
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
    puzzleFunctions: [
      new PuzzleFunction({
        version: 1,
        type: "linesFinish",
        parameters: {
          lines: 4,
        },
      }),
    ],
    metadata: {
      name: "Debug Puzzle 0",
      author: "Spentine",
      description: "A puzzle for debugging purposes.",
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    },
  }).makeAllFunctions(),
  1: Puzzle.fromJSON(jsonDebugPuzzles[0]).makeAllFunctions(),
};

console.log(debugPuzzles[0]);

export { debugPuzzles };