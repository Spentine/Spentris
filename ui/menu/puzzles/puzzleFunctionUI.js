/*

Handle the Puzzle Function UI component for the Puzzle Menu.

*/

import { puzzleUiFunctions } from "./puzzleMenu.js";
import { puzzleFunctions } from "../../../puzzles/engine/puzzleFunctions.js";
import { generateRandomId } from "../../util.js";

class PuzzleFunctionElement {
  /**
   * @param {object} gamePuzzleFunction
   * @param {PuzzleFunctionUI} parentUI
   * @param {number} gamePuzzleFunctionIndex - index in parentUI's arrays
   */
  constructor(gamePuzzleFunction, parentUI, gamePuzzleFunctionIndex) {
    this.gamePuzzleFunction = gamePuzzleFunction;
    this.parentUI = parentUI;
    this.gamePuzzleFunctionIndex = gamePuzzleFunctionIndex;
  }
  
  /**
   * returns a new element for puzzle function interaction and modification
   * @param {object} gamePuzzleFunction
   * @returns {HTMLElement} element
   */
  createElement() {
    this.element = document.createElement("div");
    this.element.className = "puzzleFunctionElement";
    
    // create element contents
    
    // type selector
    const typeLabel = document.createElement("label"); // label
    typeLabel.className = "puzzleFunctionTypeLabel";
    typeLabel.textContent = "Function Type: ";
    this.element.appendChild(typeLabel);
    
    const type = document.createElement("select"); // selection
    type.className = "puzzleFunctionTypeSelector";
    for (const key in puzzleFunctions) {
      const option = document.createElement("option");
      option.className = "puzzleFunctionTypeSelectorOption";
      option.value = key;
      option.textContent = key;
      type.appendChild(option);
    }
    type.value = this.gamePuzzleFunction.type;
    
    type.id = generateRandomId(); // label
    typeLabel.htmlFor = type.id;
    this.element.appendChild(typeLabel);
    this.element.appendChild(type);
    
    // type selector change
    type.addEventListener("change", (e) => {
      const newType = e.target.value;
      
      // modify in-place
      this.gamePuzzleFunction.type = newType;
      this.gamePuzzleFunction.parameters = {};
      
      this.createParametersUI();
    });
    
    // element parameters
    this.parametersContainer = document.createElement("div");
    this.parametersContainer.className = "puzzleFunctionParametersContainer";
    this.element.appendChild(this.parametersContainer);
    
    // set type to initialize parameters
    this.createParametersUI();
    
    return this.element;
  }
  
  /**
   * creates the puzzle function parameters UI
   * if a parameter doesn't exist, it is created with the default value
   */
  createParametersUI() {
    const type = this.gamePuzzleFunction.type;
    
    const specifications = puzzleFunctions[type].specifications;
    const specParameters = specifications.parameters;
    
    // newType means clear parameters
    const parameters = this.gamePuzzleFunction.parameters;
    
    // clear parameters container
    puzzleUiFunctions.clearContainer(this.parametersContainer);
    
    // create inputs for each parameter
    for (const key in specParameters) {
      const paramSpec = specParameters[key];
      
      // try to get gamePuzzleFunction
      
      // create input element
      const data = {};
      const typeMap = {
        "number": "number",
        "string": "text",
        "multilineString": "text",
      };
      
      // ensure existence of parameters[key]
      parameters[key] ??= paramSpec.default ?? "";
      
      // callback
      data.callback = (data) => {
        parameters[key] = data.value;
      };
      
      data.type = typeMap[paramSpec.type] || "text";
      data.value = parameters[key];
      data.step = paramSpec.step;
      data.max = paramSpec.max;
      data.min = paramSpec.min;
      const inputElement = (paramSpec.type === "multilineString"
        ? puzzleUiFunctions.createTextAreaInput(data)
        : puzzleUiFunctions.createStandardInput(data)
      );
      
      const labelInputPair = puzzleUiFunctions.createLabelInputPair(
        key,
        inputElement
      );
      
      this.parametersContainer.appendChild(labelInputPair.element);
    }
  }
}

class PuzzleFunctionUI {
  constructor(gamePuzzleFunctions) {
    // try to keep indices synced
    this.gamePuzzleFunctions = gamePuzzleFunctions;
    this.puzzleFunctionElements = [];
  }
  
  createPuzzleFunction() {
    this.gamePuzzleFunctions.push({
      version: 1,
      type: "none",
      parameters: {},
    });
    this.createPuzzleFunctionElement(this.gamePuzzleFunctions.length - 1);
  }
  
  createPuzzleFunctionElement(gamePuzzleFunctionIndex) {
    // get index and create element
    const gamePuzzleFunction = this.gamePuzzleFunctions[gamePuzzleFunctionIndex];
    const puzzleFunctionElement = new PuzzleFunctionElement(
      gamePuzzleFunction,
      this,
      gamePuzzleFunctionIndex
    );
    const element = puzzleFunctionElement.createElement();
    
    // add to container and list
    this.container.appendChild(element);
    this.puzzleFunctionElements.push({
      puzzleFunctionElement: puzzleFunctionElement,
    });
  }
  
  createUI() {
    this.container = document.createElement("div");
    this.container.className = "puzzleFunctionUIContainer";
    
    // create a button that adds a new puzzle function
    const addButton = document.createElement("button");
    addButton.className = "puzzleFunctionAddButton";
    addButton.textContent = "Add Puzzle Function";
    addButton.addEventListener("click", // interaction
      this.createPuzzleFunction.bind(this)
    );
    this.container.appendChild(addButton);
    
    // create existing puzzle function elements
    for (const index in this.gamePuzzleFunctions) {
      this.createPuzzleFunctionElement(index);
    }

    return this.container;
  }
}

export { PuzzleFunctionUI };