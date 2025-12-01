/*

Handle the Puzzle Function UI component for the Puzzle Menu.

*/

import { puzzleUiFunctions } from "./puzzleMenu.js";
import { puzzleFunctions } from "../../../puzzles/engine/puzzleFunctions.js";
import { generateRandomId } from "../../util.js";

class PuzzleFunctionElement {
  constructor(gamePuzzleFunction) {
    this.gamePuzzleFunction = gamePuzzleFunction;
  }
  
  /**
   * returns a new element for puzzle function interaction and modification
   * @param {object} gamePuzzleFunction
   * @returns {HTMLElement} element
   */
  createElement(gamePuzzleFunction) {
    this.element = document.createElement("div");
    this.element.className = "puzzleFunctionElement";
    
    // create element contents
    
    // type selector
    const typeLabel = document.createElement("label");
    typeLabel.className = "puzzleFunctionTypeLabel";
    typeLabel.textContent = "Function Type: ";
    this.element.appendChild(typeLabel);
    
    const type = document.createElement("select");
    type.className = "puzzleFunctionTypeSelector";
    for (const key in puzzleFunctions) {
      const option = document.createElement("option");
      option.className = "puzzleFunctionTypeSelectorOption";
      option.value = key;
      option.textContent = key;
      type.appendChild(option);
    }
    type.value = gamePuzzleFunction.type;
    
    type.id = generateRandomId();
    typeLabel.htmlFor = type.id;
    this.element.appendChild(typeLabel);
    this.element.appendChild(type);
    
    // type selector change
    type.addEventListener("change", (e) => {
      const newType = e.target.value;
      this.setType(newType);
      gamePuzzleFunction.type = newType;
    });
    
    // element parameters
    this.parametersContainer = document.createElement("div");
    this.parametersContainer.className = "puzzleFunctionParametersContainer";
    this.element.appendChild(this.parametersContainer);
    
    // set type to initialize parameters
    this.setType(gamePuzzleFunction.type);
    
    return this.element;
  }
  
  /**
   * sets the type of the puzzle function
   * @param {string} newType
   */
  setType(newType) {
    const specifications = puzzleFunctions[newType].specifications;
    const parameters = specifications.parameters;
    
    // clear parameters container
    puzzleUiFunctions.clearContainer(this.parametersContainer);
    
    // create inputs for each parameter
    for (const key in parameters) {
      const paramSpec = parameters[key];
      
      // create input element
      const data = {};
      const typeMap = {
        "number": "number",
        "string": "text",
      };
      data.type = typeMap[paramSpec.type] || "text";
      data.value = paramSpec.default ?? "";
      data.step = paramSpec.step;
      data.max = paramSpec.max;
      data.min = paramSpec.min;
      const inputElement = puzzleUiFunctions.createStandardInput(data);
      
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
    const puzzleFunctionElement = new PuzzleFunctionElement(gamePuzzleFunction);
    const element = puzzleFunctionElement.createElement(gamePuzzleFunction);
    
    // add to container and list
    this.container.appendChild(element);
    this.puzzleFunctionElements.push({
      puzzleFunctionElement: puzzleFunctionElement,
      index: gamePuzzleFunctionIndex,
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