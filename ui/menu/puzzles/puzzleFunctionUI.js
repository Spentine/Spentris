/*

Handles the Puzzle Function UI component for the Puzzle Menu.

*/

import { puzzleUiFunctions } from "./puzzleMenu.js";

/**
 * as per the specifications, i'm not actually using the class to store data. instead i'm just using it to retrieve the specifications for the puzzle function
 */
import { puzzleFunctions } from "../../../puzzles/engine/puzzleFunctions.js";

import { generateRandomId } from "../../util.js";

class PuzzleFunctionElement {
  /**
   * @param {Object} gamePuzzleFunction
   * @param {PuzzleFunctionUI} parentUI
   * @param {number} gamePuzzleFunctionIndex - index in parentUI's arrays
   */
  constructor(gamePuzzleFunction, parentUI, gamePuzzleFunctionIndex) {
    this.gamePuzzleFunction = gamePuzzleFunction;
    this.parentUI = parentUI;
    this.index = gamePuzzleFunctionIndex;
    
    // command manager
    this.commands = parentUI.commands;
  }
  
  /**
   * returns a new element for puzzle function interaction and modification
   * @param {Object} gamePuzzleFunction
   * @returns {HTMLElement} element
   */
  createElement() {
    /*
      the reason for having an inner and outer element
      is because changing the width of the element works properly
      borders are not counted in the width when setting it
    */
    this.elementOuter = document.createElement("div");
    this.elementOuter.className = "puzzleFunctionElementOuter";
    this.elementInner = document.createElement("div");
    this.elementInner.className = "puzzleFunctionElementInner";
    this.elementOuter.appendChild(this.elementInner);
    
    // type selector
    const typeLabel = document.createElement("label"); // label
    typeLabel.className = "Label";
    typeLabel.textContent = "Function Type: ";
    this.elementInner.appendChild(typeLabel);
    
    const type = document.createElement("select"); // selection
    type.className = "puzzleSelectionInput";
    for (const key in puzzleFunctions) {
      const option = document.createElement("option");
      option.className = "puzzleSelectionInputOption";
      option.value = key;
      option.textContent = key;
      type.appendChild(option);
    }
    type.value = this.gamePuzzleFunction.type;
    
    type.id = generateRandomId(); // label
    typeLabel.htmlFor = type.id;
    this.elementInner.appendChild(typeLabel);
    this.elementInner.appendChild(type);
    
    // type selector change
    type.addEventListener("change", (e) => {
      const newType = e.target.value;
      
      // in-place
      this.commands.setPuzzleFunctionType(
        this.gamePuzzleFunction,
        newType,
        PuzzleFunctionElement.defaultParameters(newType)
      );
      
      this.createParametersUI();
    });
    
    // element parameters
    this.parametersContainer = document.createElement("div");
    this.parametersContainer.className = "puzzleFunctionParametersContainer";
    this.elementInner.appendChild(this.parametersContainer);
    
    // set type to initialize parameters
    this.createParametersUI();
    
    this.dragFunctionality();
    
    return this.elementOuter;
  }
  
  /**
   * initializes default parameters for a type
   * @param {string} type
   * @returns {Object} default parameters
   */
  static defaultParameters(type) {
    const specifications = puzzleFunctions[type].specifications;
    const specParameters = specifications.parameters;
    
    const parameters = {};
    for (const key in specParameters) {
      const paramSpec = specParameters[key];
      parameters[key] = paramSpec.default ?? null;
    }
    
    return parameters;
  }
  
  /**
   * creates the puzzle function parameters UI
   */
  createParametersUI() {
    const type = this.gamePuzzleFunction.type;
    
    const specifications = puzzleFunctions[type].specifications;
    const specParameters = specifications.parameters;
    
    const parameters = this.gamePuzzleFunction.parameters;
    
    // clear parameters container
    puzzleUiFunctions.clearContainer(this.parametersContainer);
    
    // create inputs for each parameter
    for (const key in specParameters) {
      const paramSpec = specParameters[key];
      
      // try to get gamePuzzleFunction
      
      // create input element
      let inputElement;
      
      const typeMap = {
        "number": "number",
        "string": "text",
        "multilineString": "text",
      };
      
      if (paramSpec.type in typeMap) {
        const data = {};
        
        // callback
        data.callback = (data) => {
          this.commands.setValue(parameters, key, data.value);
        };
        
        data.type = typeMap[paramSpec.type] || "text";
        data.value = parameters[key];
        data.step = paramSpec.step;
        data.max = paramSpec.max;
        data.min = paramSpec.min;
        inputElement = (paramSpec.type === "multilineString"
          ? puzzleUiFunctions.createTextAreaInput(data)
          : puzzleUiFunctions.createStandardInput(data)
        );
      } else if (paramSpec.type === "clearTypesArray") {
        // placeholder input for now
        const data = {};
        
        data.callback = (data) => {
          this.commands.setValue(parameters, key, data.value);
        }
        
        data.coerce = (value) => {
          try {
            value = JSON.parse(value);
          } catch (e) {
            value = [];
          }
          
          return value;
        }
        
        data.stringify = (data) => {
          return JSON.stringify(data, null, 2);
        }
        
        data.type = "text";
        data.value = parameters[key];
        
        inputElement = puzzleUiFunctions.createTextAreaInput(data);
      } else if (paramSpec.type === "selection") {
        const data = {};
        
        data.value = parameters[key];
        data.options = paramSpec.options.map(
          (option) => ({value: option, text: option})
        );
        data.callback = (data) => {
          this.commands.setValue(parameters, key, data.value);
        }
        
        inputElement = puzzleUiFunctions.createSelectionInput(data);
      }
      
      const labelInputPair = puzzleUiFunctions.createLabelInputPair(
        key,
        inputElement
      );
      
      this.parametersContainer.appendChild(labelInputPair.element);
    }
  }
  
  /**
   * implements drag-and-drop functionality
   * use right click to drag
   * - drag really far to the left: delete
   * - drag up/down: reorder
   */
  dragFunctionality() {
    /**
     * get elementsBounds excluding self
     * @returns {{bounds: DOMRect, index: number}[]}
     */
    const getOtherElementBounds = () => {
      const elementsBounds = this.parentUI.getElementBounds()
        .map((e, i) => ({bounds: e, index: i}));
      
      elementsBounds.splice(this.index, 1); // remove self
      return elementsBounds;
    };
    
    /**
     * compute possible insertion locations
     * insertion locations determined by where the element would be inserted
     * aka the top of each element
     * @param {{bounds: DOMRect, index: number}[]} elementsBounds
     */
    const computeInsertionLocations = (elementsBounds) => {
      const gap = 12; // px gap between elements
      
      if (elementsBounds.length === 0) {
        // technically we don't know the top (because there are no elements)
        // but it really doesn't matter since it's the only location
        return [{ index: -1, top: 0 }];
      }
      
      const insertionLocations = [];
      insertionLocations.push({
        index: elementsBounds[0].index,
        top: elementsBounds[0].bounds.top
      });
      for (let i = 0; i < elementsBounds.length; i++) {
        const prev = elementsBounds[i];
        
        // index: the index and future indexes to shift
        const index = (i < elementsBounds.length - 1
          ? elementsBounds[i + 1].index
          : -1 // assume -1 means end of list
        );
        
        insertionLocations.push({
          index: index,
          top: insertionLocations[i].top // last height
          + prev.bounds.height
          + gap
        });
      }
      
      return insertionLocations;
    };
    
    let isDragging = false;
    const downHandler = (e) => {
      // right click only
      if (e.button !== 2) return;
      
      // dragging handler
      if (isDragging) return;
      isDragging = true;
      
      // get other elements bounds and insertion locations
      const elementsBounds = getOtherElementBounds();
      const insertionLocations = computeInsertionLocations(elementsBounds);
      
      // left boundary for deletion
      /*
        note: if there are no elements, elementsBounds[0] is undefined
        get the parent container's left boundary instead
      */
      const parentRect = this.parentUI.container.getBoundingClientRect();
      const leftBoundary = parentRect.left;
      
      e.preventDefault();
      
      // get position of element relative to mouse
      const rect = this.elementOuter.getBoundingClientRect();
      const offsetX = rect.left - e.clientX;
      const offsetY = rect.top - e.clientY;
      const width = rect.width;
      
      // position variables
      let left;
      let top;
      
      // track total movement (determine if it's a click or drag)
      let totalMovement = 0;
      const dragThreshold = 5; // px
      
      const contextMenuHandler = (e) => {
        if (totalMovement < dragThreshold) return;
        e.preventDefault();
      };
      
      /**
       * offset puzzleFunctionElements after an index
       * changes margin-top to offset
       * @param {number} index
       * @param {number} offset
       */
      const offsetElement = (index, offset) => {
        if (index === -1) {
          // end of list, reset all offsets
          index = Infinity;
        }
        for (const elementData of this.parentUI.puzzleFunctionElements) {
          const element = elementData.puzzleFunctionElement;
          if (element.index === index) {
            element.elementOuter.style.marginTop = `${offset}px`;
          } else if (element !== this) {
            element.elementOuter.style.marginTop = "";
          }
        }
      };
      
      const findClosestInsertionLocation = () => {
        let closestLocation = null;
        let closestDistance = Infinity;
        for (const location of insertionLocations) {
          const distance = Math.abs(top - location.top);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestLocation = location;
          }
        }
        return closestLocation;
      };
      
      /**
       * automatically finds index and offset for insertion room
       */
      const makeInsertionRoom = () => {
        // calculate right edge
        const right = left + rect.width;
        
        if ( right < leftBoundary ) {
          // deletion case, set offset to 0
          offsetElement(-1, 0);
          return;
        }
        
        // find closest insertion location
        const closestLocation = findClosestInsertionLocation(top);
        
        // offset elements to make room
        const elementHeight = rect.height + 12; // include gap
        offsetElement(closestLocation.index, elementHeight);
      }
      
      const moveHandler = (e) => {
        // move element to mouse position
        this.elementOuter.style.position = "absolute";
        this.elementOuter.style.margin = "0";
        this.elementOuter.style.width = width + "px";
        
        left = Math.max(0,
          Math.min(e.clientX + offsetX, window.innerWidth - width));
        top = Math.max(0,
          Math.min(e.clientY + offsetY, window.innerHeight - rect.height));
          
        this.elementOuter.style.left = left + "px";
        this.elementOuter.style.top = top + "px";
        
        // update total movement
        totalMovement += Math.sqrt(e.movementX ** 2 + e.movementY ** 2);
        
        // make insertion room
        makeInsertionRoom();
      };
      
      const upHandler = (e) => {
        // right click only
        if (e.button !== 2) return;
        
        isDragging = false;
        
        document.removeEventListener("mousemove", moveHandler);
        document.removeEventListener("mouseup", upHandler);
        
        // reset element styles
        this.elementOuter.style.position = "";
        this.elementOuter.style.margin = "";
        this.elementOuter.style.left = "";
        this.elementOuter.style.top = "";
        this.elementOuter.style.width = "";
        
        offsetElement(-1, 0); // reset offsets
        
        // if not dragged enough, do nothing
        if (totalMovement < dragThreshold) return;
        
        e.preventDefault();
        
        // handle placements below
        
        // check for deletion
        const right = left + rect.width;
        if ( right < leftBoundary ) {
          this.parentUI.removeElement(this.index);
          return;
        }
        
        // insertion
        const closestLocation = findClosestInsertionLocation();
        this.parentUI.moveElement(this.index, closestLocation.index);
      };
      
      document.addEventListener("mousemove", moveHandler);
      document.addEventListener("mouseup", upHandler);
      document.addEventListener("contextmenu", contextMenuHandler,
        { once: true }
      );
    };
    
    this.elementOuter.addEventListener("mousedown", downHandler);
  }
}

class PuzzleFunctionUI {
  constructor(gamePuzzleFunctions, commands) {
    // try to keep indices synced
    this.gamePuzzleFunctions = gamePuzzleFunctions;
    this.puzzleFunctionElements = [];
    
    // command manager
    this.commands = commands;
  }
  
  createPuzzleFunction() {
    this.commands.addPuzzleFunction({
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
  
  /**
   * returns an array of all element bounds
   * @returns {DOMRect[]} bounds 
   */
  getElementBounds() {
    const bounds = [];
    for (const elementData of this.puzzleFunctionElements) {
      const rect = elementData.puzzleFunctionElement.elementOuter
        .getBoundingClientRect();
      bounds.push(rect);
    }
    return bounds;
  }
  
  updateIndices() {
    for (const [i, elementData] of this.puzzleFunctionElements.entries()) {
      elementData.puzzleFunctionElement.index = i;
    }
  }
  
  /**
   * move element at indexA to indexB
   * @param {number} indexA 
   * @param {number} indexB
   */
  moveElement(indexA, indexB) {
    if (indexA === indexB) return; // no change
    if (indexB === -1) indexB = this.puzzleFunctionElements.length; // end of list
    
    // DOM (acts independent of removal shift)
    const element = this.puzzleFunctionElements[indexA].puzzleFunctionElement.elementOuter;
      this.container.removeChild(element);
    if (indexB >= this.puzzleFunctionElements.length) {
      this.container.appendChild(element);
    } else {
      const beforeElement = this.puzzleFunctionElements[indexB]
        .puzzleFunctionElement.elementOuter;
      this.container.insertBefore(element, beforeElement);
    }
    
    // game puzzle function array
    this.commands.swapPuzzleFunctions(indexA, indexB);
    
    if (indexB > indexA) indexB--; // account for removal shift
    
    // puzzle function element array
    const elementData = this.puzzleFunctionElements.splice(indexA, 1)[0];
    this.puzzleFunctionElements.splice(indexB, 0, elementData);
    
    this.updateIndices();
  }
  
  /**
   * remove element at index
   * @param {number} index 
   */
  removeElement(index) {
    // remove from DOM
    const elementData = this.puzzleFunctionElements[index];
    this.container.removeChild(elementData.puzzleFunctionElement.elementOuter);
    
    // remove from puzzle function elements
    this.puzzleFunctionElements.splice(index, 1);
    
    // remove from game puzzle functions
    this.commands.removePuzzleFunction(index);
    
    this.updateIndices();
  }
}

export { PuzzleFunctionUI };