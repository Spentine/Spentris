/*

Spentine 20250609

a puzzle modification layer which actually has the code logic to modify puzzles and provides a simple high level interface for the menu and ui and stuff

makes the code prettier i think

*/
import {
  PuzzleFunction,
  Puzzle,
} from "../../../puzzles/engine/puzzle.js";

class PuzzleModifier {
  constructor(data) {
    this.board = data.board;
    this.nextQueue = data.nextQueue;
    this.holdQueue = data.holdQueue;
    this.currentPiece = data.currentPiece;
    
    this.gameplaySettings = data.gameplaySettings;
    this.puzzleSolution = data.puzzleSolution;
    this.puzzleMetadata = data.puzzleMetadata;
  }
  
  toPuzzle() {
    
  }
}