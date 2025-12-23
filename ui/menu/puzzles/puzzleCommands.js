/*

Spentine 20251223

Implements the Command Pattern for puzzle-related actions.
I have never used this pattern before, so the level of commenting and precautions will be cautious.
I hope I don't fuck up because then that would just be great lmao

*/

/**
 * atomic puzzle command
 * @param {string} type - type of command
 * @param {function} execute - the command behavior
 * @param {function} undo - undos the command
 */
class PuzzleCommand {
  constructor(type, execute, undo) {
    this.type = type;
    this.execute = execute;
    this.undo = undo;
  }
}

/**
 * factory for creating puzzle commands
 * @param {PuzzleModifier} puzzleModifier
 */
class PuzzleCommandFactory {
  constructor(puzzleModifier) {
    this.puzzleModifier = puzzleModifier;
    
    this.buildCommands();
  }
  
  /**
   * generates the available commands
   * @return {object} the generated commands
   */
  buildCommands() {
    return this.commands = {
      /**
       * sets the new board state
       * assumes immutable board state
       * @param {Array} newBoard - the new board state
       * @return {PuzzleCommand} the command to set the board
       */
      setBoard: (newBoard) => {
        const oldBoard = this.puzzleModifier.board;
        return new PuzzleCommand(
          "setBoard",
          () => { this.puzzleModifier.board = newBoard; },
          () => { this.puzzleModifier.board = oldBoard; }
        );
      },
    };
  }
}

/**
 * manages puzzle commands for undo/redo functionality
 * @param {PuzzleModifier} puzzleModifier
 */
class PuzzleCommandManager {
  constructor(puzzleModifier) {
    // undo/redo functionality
    this.history = [];
    this.redoStack = [];
    
    // command manager
    this.puzzleModifier = puzzleModifier;
    this.factory = new PuzzleCommandFactory(puzzleModifier);
    this.commandForwarding(); // ease of command access
  }
  
  /**
   * forwards the commands to make it easier
   * bundles creation and execution of commands
   */
  commandForwarding() {
    this.commands = {};
    
    for (const [name, creator] of Object.entries(this.factory.commands)) {
      // construct new function
      this.commands[name] = (...args) => {
        // creates and executes command
        this.executeCommand(creator(...args));
      }
    }
    
    return this.commands;
  }
  
  /**
   * executes a command and stores it in history
   * @param {PuzzleCommand} command - the command to execute
   */
  executeCommand(command) {
    command.execute();
    this.history.push(command);
    this.redoStack = []; // clear redo stack on new command
  }
  
  /**
   * undos the last command
   */
  undo() {
    if (this.history.length === 0) return;
    const command = this.history.pop();
    command.undo();
    this.redoStack.push(command);
  }
  
  /**
   * redos the last undone command
   */
  redo() {
    if (this.redoStack.length === 0) return;
    const command = this.redoStack.pop();
    command.execute();
    this.history.push(command);
  }
}

export { PuzzleCommandManager };