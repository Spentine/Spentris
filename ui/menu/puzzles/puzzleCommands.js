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
   * @return {Object.<string, function>} the generated commands
   */
  buildCommands() {
    return this.commands = {
      /**
       * modifies a value in the object
       * assumes immutable value
       * @param {Object} obj - the object to change
       * @param {string} key - the key of the value to set
       * @param {any} newValue - the new value to set
       * @return {PuzzleCommand} the command to set the value
       */
      setValue: (obj, key, newValue) => {
        const oldValue = obj[key];
        return new PuzzleCommand(
          "setValue",
          () => { obj[key] = newValue; },
          () => { obj[key] = oldValue; }
        );
      },
      
      /**
       * adds a puzzle function to the puzzle modifier
       * @param {PuzzleFunction} puzzleFunction - the puzzle function to add
       * @return {PuzzleCommand} the command to add the puzzle function
       */
      addPuzzleFunction: (puzzleFunction) => {
        const puzzleFunctions = this.puzzleModifier.puzzleFunctions;
        return new PuzzleCommand(
          "addPuzzleFunction",
          () => {
            puzzleFunctions.push(puzzleFunction);
          },
          () => {
            puzzleFunctions.pop();
          }
        );
      },
      
      /**
       * moves puzzle function at indexA to indexB in the puzzle modifier
       * @param {number} indexA - from
       * @param {number} indexB - to
       * @return {PuzzleCommand} the command to swap the puzzle functions
       */
      swapPuzzleFunctions: (indexA, indexB) => {
        const puzzleFunctions = this.puzzleModifier.puzzleFunctions;
        
        const swapFunc = () => {
          if (indexB > indexA) indexB--; // account for removal shift
          
          const func = puzzleFunctions.splice(indexA, 1)[0];
          puzzleFunctions.splice(indexB, 0, func);
        };
        
        return new PuzzleCommand(
          "swapPuzzleFunctions",
          swapFunc,
          swapFunc
        );
      },
      
      /**
       * removes a puzzle function at index
       * @param {number} index - the index to remove
       * @return {PuzzleCommand} the command to remove the puzzle function
       */
      removePuzzleFunction: (index) => {
        const puzzleFunctions = this.puzzleModifier.puzzleFunctions;
        const removedFunction = puzzleFunctions[index];
        return new PuzzleCommand(
          "removePuzzleFunction",
          () => {
            puzzleFunctions.splice(index, 1);
          },
          () => {
            puzzleFunctions.splice(index, 0, removedFunction);
          }
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