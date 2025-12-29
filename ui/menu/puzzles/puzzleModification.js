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

import {
  PuzzleCommandManager,
} from "./puzzleCommands.js";

const rotationSystemMap = {
  "SRS+": SRSPlusData,
};

class PuzzleModifier {
  /**
   * creates a new puzzle modifier for the puzzle editor
   * @param {Object} data - the puzzle modifier data
   */
  constructor(data) {
    this.version = 1;
    
    /**
     * @type {{width: number, height: number, matrix: (string | null)[][]}}
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
    this.metadata = data.metadata;
    
    this.holdAllowed = data.holdAllowed;
    this.noPieceEnd = data.noPieceEnd;
    
    // command manager for undo/redo
    this.commandManager = new PuzzleCommandManager(this);
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
      
      /*
        i decided to split this variable into two
        the puzzle editor ui would handle separate types better
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
      metadata: {
        name: "New Puzzle",
        author: "",
        description: "",
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
      },
      
      holdAllowed: true,
      noPieceEnd: true,
    });
    return pM;
  }
  
  /**
   * creates a puzzle modifier from json data
   * note: currently it is the same as the constructor, but this is for future compatibility
   * @deprecated
   * @param {Object} json - the json data
   * @return {PuzzleModifier} the puzzle modifier
   */
  static fromJSON(json) {
    const pM = new PuzzleModifier(json);
    return pM;
  }
  
  toPuzzle() {
    const data = {
      parameters: {
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
      puzzleFunctions: [],
    };
    
    const initParams = data.parameters.settings.initialization.parameters;
    
    // set the board
    initParams.board = Board.fromSimpleArray(this.board);
    
    // set the next queue
    initParams.state.nextQueue = this.nextQueue;
    
    // set the current piece
    initParams.state.currentPiece = this.currentPiece;
    
    // set the hold piece
    initParams.state.holdPiece = this.holdPiece;
    
    // set the refill queue
    initParams.refillQueue = this.refillQueue;
    
    // set the seedrandom and seed
    initParams.seed = (this.seedRandom
      ? "random"
      : this.seed
    );
    
    // hold enabled
    initParams.holdAllowed = this.holdAllowed;
    
    /**
     * end when the current piece is null
     * @type {boolean}
     */
    initParams.noPieceEnd = this.noPieceEnd;
    
    // add puzzle functions
    for (const puzzleFunction of this.puzzleFunctions) {
      data.puzzleFunctions.push(new PuzzleFunction(puzzleFunction));
    }
    
    // add metadata
    data.metadata = this.metadata;
    
    const puzzle = new Puzzle(data);
    return puzzle;
  }
  
  /**
   * converts a Puzzle object into a new PuzzleModifier
   * @param {Puzzle} puzzle
   * @returns {PuzzleModifier}
   */
  static fromPuzzle(puzzle) {
    // avoid destroying original puzzle
    puzzle = structuredClone(puzzle);
    
    const data = {version: 1};
    
    // metadata
    data.metadata = puzzle.metadata;
    
    // puzzle functions
    data.puzzleFunctions = puzzle.puzzleFunctions.map(
      /**
       * of course the structuredClone does not preserve prototypes
       * this is so stupid
       */
      (e) => PuzzleFunction.prototype.exportJSON.call(e)
    );
    
    // parameters
    
    const initParams = puzzle.parameters.settings.initialization.parameters;
    
    // state parameters
    const stateParams = initParams.state;
    
    data.gameplaySettings = {
      gravity: stateParams.gravity,
      lockDelay: stateParams.lockDelay,
      maxLockDelay: stateParams.maxLockDelay,
      startingLevel: stateParams.startingLevel,
      levelling: stateParams.levelling,
      masterLevels: stateParams.masterLevels,
    };
    
    // get the board
    data.board = Board.prototype.toSimpleArray.call(initParams.board);
    
    // get the next queue
    data.nextQueue = initParams.state.nextQueue;
    
    // get the current piece
    data.currentPiece = initParams.state.currentPiece;
    
    // get the hold piece
    data.holdPiece = initParams.state.holdPiece;
    
    // get the refill queue
    data.refillQueue = initParams.refillQueue;
    
    // get the seedrandom and seed
    data.seedRandom = (initParams.seed === "random");
    data.seed = (data.seedRandom ? 0 : initParams.seed);
    
    // hold enabled
    data.holdAllowed = initParams.holdAllowed;
    
    // no piece end
    data.noPieceEnd = initParams.noPieceEnd;
    
    // construct puzzle modifier
    const pM = new PuzzleModifier(data);
    return pM;
  }
  
  /**
   * returns a json representing the object
   * @deprecated
   * @returns {Object}
   */
  toJSON() {
    return {
      version: this.version,
      board: this.board,
      nextQueue: this.nextQueue,
      holdPiece: this.holdPiece,
      currentPiece: this.currentPiece,
      refillQueue: this.refillQueue,
      seedRandom: this.seedRandom,
      seed: this.seed,
      gameplaySettings: this.gameplaySettings,
      puzzleFunctions: this.puzzleFunctions,
      metadata: this.metadata,
    };
  }
}

export { PuzzleModifier };