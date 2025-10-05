/*

Spentine 20250609

a puzzle modification layer which actually has the code logic to modify puzzles and provides a simple high level interface for the menu and ui and stuff

makes the code prettier i think

*/
import {
  PuzzleFunction,
  Puzzle,
} from "../../../puzzles/engine/puzzle.js";

import {
  standardFunctionLocations,
} from "../../../engine/modes/standardModes.js";

import {
  SRSPlusData,
} from "../../../engine/rsData.js";

import {
  Board,
  Piece
} from "../../../engine/stackerObjects.js";

const rotationSystemMap = {
  "SRS+": SRSPlusData,
};

class PuzzleModifier {
  /**
   * creates a new puzzle modifier for the puzzle editor
   * @param {object} data - the puzzle modifier data
   */
  constructor(data) {
    /**
     * {width: number, height: number, matrix: (string|null)[][]}
     */
    this.board = data.board;
    
    this.nextQueue = data.nextQueue;
    this.holdPiece = data.holdPiece;
    this.currentPiece = data.currentPiece;
    
    this.refillQueue = data.refillQueue;
    this.seedRandom = data.seedRandom;
    this.seed = data.seed;
    
    this.gameplaySettings = data.gameplaySettings;
    this.puzzleFunctions = data.puzzleFunctions;
    this.puzzleMetadata = data.puzzleMetadata;
  }
  
  /**
   * creates a default puzzle modifier
   */
  static default() {
    const pM = new PuzzleModifier({
      board: new Board(10, 40).toSimpleArray(),
      nextQueue: [],
      holdPiece: null,
      currentPiece: null,
      
      refillQueue: true,
      
      /**
       * i decided to split this variable into two
       * the puzzle editor ui would handle separate types better
       */
      seedRandom: true, // {boolean} whether to use a random seed
      seed: 0, // {number} only
      
      gameplaySettings: {
        gravity: 1000,
        lockDelay: 500,
        maxLockDelay: 5000,
        startingLevel: 1,
        levelling: false,
        masterLevels: false,
        rotationSystem: "SRS+",
      },
      
      puzzleFunctions: [],
      puzzleMetadata: {
        name: "New Puzzle",
        author: "",
        description: "",
        dateCreated: new Date().toISOString(),
      },
    });
    return pM;
  }
  
  toPuzzle() {
    const data = {
      parameters: {
        values: {
          version: 1,
          settings: {
            functionLocations: standardFunctionLocations,
            initialization: {
              parameters: {
                state: {
                  // null values for handling settings are replaced by the user preferences
                  arr: null,
                  das: null,
                  sdf: null,
                  dcd: null,
                  msg: null,
                  are: null,
                  lca: null,
                  
                  gravity: this.gameplaySettings.gravity,
                  lockDelay: this.gameplaySettings.lockDelay,
                  maxLockDelay: this.gameplaySettings.maxLockDelay,
                  startingLevel: this.gameplaySettings.startingLevel,
                  levelling: this.gameplaySettings.levelling,
                  masterLevels: this.gameplaySettings.masterLevels,
                },
                rotationSystem: rotationSystemMap[this.gameplaySettings.rotationSystem] ?? SRSPlusData,
              },
            },
          },
        },
      },
      puzzleFunctions: [],
    };
    
    const params = data.parameters.values.settings.initialization.parameters;
    
    // set the board
    params.board = Board.fromSimpleArray(this.board);
    
    // set the next queue
    params.nextQueue = this.nextQueue;
    
    // set the current piece
    params.currentPiece = this.currentPiece;
    
    // set the hold piece
    params.holdPiece = this.holdPiece;
    
    // set the refill queue
    params.refillQueue = this.refillQueue;
    
    // set the seedrandom and seed
    params.seed = (this.seedRandom
      ? "random"
      : this.seed
    );
    
    // add puzzle functions
    for (const puzzleFunction of this.puzzleFunctions) {
      data.puzzleFunctions.push(new PuzzleFunction(puzzleFunction));
    }
    
    const puzzle = new Puzzle(data);
    return puzzle;
  }
}

export { PuzzleModifier };