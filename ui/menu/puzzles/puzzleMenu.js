/*

Spentine
Created on 20250607

> the long awaited puzzles!!!
> what else do i do on the airplane???

*/

// event emitter
import { EventEmitter } from "../../../eventEmitter.js";

// local storage
import { ls } from "../../../localStorage/localStorage.js";

// languages
import { translations } from "../../../localization/language.js";

// puzzles
import { PuzzleFunction, Puzzle } from "../../../puzzles/engine/puzzle.js";
import { debugPuzzles } from "../../../puzzles/packs/test.js";

// puzzle modifier
import { PuzzleModifier } from "../../../ui/menu/puzzles/puzzleModification.js";

// srs data
import {
  SRSPlusData,
} from "../../../engine/rsData.js";

// stacker objects
import {
  Board,
  Piece
} from "../../../engine/stackerObjects.js";

// copy obj by traversal
import {
  copyObjByTraversal
} from "../../../util.js";

// for random id generation
import {
  generateRandomId
} from "../../util.js";

const puzzleUiFunctions = {
  /**
   * delete all elements in uiDisplay
   */
  resetDisplay: function () {
    puzzleUiFunctions.clearContainer(this.uiDisplay);
  },
  
  /**
   * delete all elements in a container
   */
  clearContainer: function (container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  },
  
  /**
   * create complex header for puzzle menus
   * refer to the docs
   * @param {Object} data - data for the header
   */
  createHeader: function (data) {
    if (data.type === "menuBar") { // menu bar
      const menuBar = document.createElement("div");
      menuBar.className = "puzzleMenuBar";
      
      /**
       * construct interact event listener
       * @param {Object} item - the item to interact with
       * @return {Function} - the event listener function
       */
      const constructInteractListener = function (item) {
        return function () {
          if (typeof item.interact === "function") {
            item.interact(); // call the interact function
          } else {
            console.warn("No interact function defined for", item.text);
          }
        };
      };
      
      /**
       * creates tree hover event listeners
       * @param {HTMLElement} container - the container to create hover listeners for
       * @param {HTMLElement} subMenu - the sub-menu element to show/hide
       * @return {null} - no return value, just adds event listeners
       */
      const constructHoverListeners = function (container, subMenu) {
        // hide sub-menu by default
        subMenu.style.display = "none";
        
        // add event listener for hover
        container.addEventListener("mouseover", () => {
          subMenu.style.display = ""; // set to default
        });
        container.addEventListener("mouseout", () => {
          subMenu.style.display = "none"; // hide
        });
      };
      
      /**
       * constructs a sub-menu tree
       * @param {Array} subItems - array of sub-menu items
       * @param {Object} position - position of the sub-menu
       */
      const constructSubTree = function (subItems) {
        const subMenu = document.createElement("div");
        subMenu.className = "puzzleSubMenu";
        
        for (const subItem of subItems) {
          // container of both the item and the sub-menu
          const subContainer = document.createElement("div");
          subContainer.className = "puzzleSubMenuContainer";
          
          // the actual item (the ui button or interactable)
          const subItemElement = document.createElement("div");
          subItemElement.className = "puzzleSubMenuItem";
          
          const subInnerText = document.createElement("p");
          subInnerText.className = "puzzleSubMenuItemText";
          subInnerText.textContent = subItem.text;
          subItemElement.appendChild(subInnerText);
          
          subContainer.appendChild(subItemElement);
          
          if (subItem.type === "tree") {
            // i need to place it to the right but for some reason having a container that is positioned `absolute` would break
            const nonAbsolute = document.createElement("div");
            nonAbsolute.className = "puzzleMenuNonAbsolute";
            // expand recursively
            const nestedSubMenu = constructSubTree(subItem.sub);
            
            // add hover listeners for the sub-menu and handle showing/hiding
            constructHoverListeners(subContainer, nestedSubMenu);
            
            nonAbsolute.appendChild(nestedSubMenu);
            subContainer.appendChild(nonAbsolute);
            
            // add arrow to indicate sub-menu
            const faintText = document.createElement("p");
            faintText.className = "faintText";
            faintText.style.marginLeft = "8px"; // add some spacing
            faintText.textContent = "▶";
            subItemElement.appendChild(faintText);
          } else if (subItem.type === "button") {
            // add event listener for button interaction
            subItemElement.addEventListener("click", constructInteractListener(subItem));
          }
          
          subMenu.appendChild(subContainer);
        }
        
        return subMenu;
      }
      
      const headerRoot = data.root;
      for (const headerItem of headerRoot) {
        // the actual container for the headerItem
        const container = document.createElement("div");
        container.className = "puzzleMenuContainer";
        
        // construct the item (the ui button or interactable)
        const item = document.createElement("div");
        item.className = "puzzleMenuItem";
        
        const innerText = document.createElement("p");
        innerText.className = "puzzleMenuItemText";
        innerText.textContent = headerItem.text;
        item.appendChild(innerText);
        
        container.appendChild(item);
        
        if (headerItem.type === "tree") {
          const subMenu = constructSubTree(headerItem.sub);
          
          // add hover listeners for the item and handle showing/hiding
          constructHoverListeners(container, subMenu);
          
          container.appendChild(subMenu);
        } else if (headerItem.type === "button") {
          // add event listener for button interaction
          item.addEventListener("click", constructInteractListener(headerItem));
        }
        
        menuBar.appendChild(container);
      }
      
      return menuBar;
    }
  },
  
  /**
   * create two side bars
   * @returns {Object}
   */
  createDoubleSideBar: function () {
    const fullContainer = document.createElement("div");
    fullContainer.className = "puzzleFullContainer";
    
    const leftContainer = document.createElement("div");
    leftContainer.className = "puzzleSideContainer";
    
    const middleContainer = document.createElement("div");
    middleContainer.className = "puzzleMiddleContainer";
    
    const rightContainer = document.createElement("div");
    rightContainer.className = "puzzleSideContainer";
    
    fullContainer.appendChild(leftContainer);
    fullContainer.appendChild(middleContainer);
    fullContainer.appendChild(rightContainer);
    
    return {
      fullContainer: fullContainer,
      leftContainer: leftContainer,
      middleContainer: middleContainer,
      rightContainer: rightContainer,
    };
  },
  
  /**
   * create a button
   * @param {string} text - the text to display on the button
   * @param {boolean} - whether it should indicate that it is a menu button
   * @param {(function|null)} callback - the function to call when the button is clicked
   */
  createButton: function (text, isMenuButton=false, callback=null) {
    const button = document.createElement("button");
    button.className = "puzzleButton";
    
    const buttonText = document.createElement("p");
    buttonText.className = "puzzleButtonText";
    buttonText.textContent = text;
    button.appendChild(buttonText);
    
    if (isMenuButton) {
      const faintText = document.createElement("p");
      faintText.className = "faintText";
      faintText.textContent = "▶"; // arrow to indicate menu
      button.appendChild(faintText);
    }
    
    if (callback) button.addEventListener("click", callback);
    
    return {
      element: button
    };
  },
  
  /**
   * create a label-input pair
   * @param {string} labelText - the text for the label
   * @param {Object} inputElement - the input element to use
   */
  createLabelInputPair: function (labelText, inputElement) {
    const container = document.createElement("div");
    container.className = "labelInputPair";

    const label = document.createElement("label");
    label.className = "label";
    label.textContent = labelText;
    label.setAttribute("for", inputElement.id);
    
    container.appendChild(label);
    container.appendChild(inputElement.element);
    
    return {
      element: container,
    };
  },
  
  /**
   * create a boolean input
   * @param {Object} inputData - the input data
   */
  createBooleanInput: function (inputData) {
    const data = {
      checked: false,
      callback: null,
    };
    copyObjByTraversal(data, inputData);
    
    const element = document.createElement("div");
    element.className = "puzzleCheckboxContainer";
    const id = generateRandomId();
    
    const checkbox = document.createElement("input");
    checkbox.className = "puzzleCheckbox";
    checkbox.type = "checkbox";
    checkbox.checked = data.checked;
    checkbox.id = id;
    
    checkbox.addEventListener("change", function (event) {
      if (data.callback) data.callback({
        event, value: this.checked
      });
    });
    
    const interactionLabel = document.createElement("label");
    interactionLabel.className = "puzzleCheckboxLabel";
    interactionLabel.setAttribute("for", id);
    
    element.appendChild(checkbox);
    element.appendChild(interactionLabel);
    
    return {
      element: element,
      id: id,
    };
  },

  /**
   * create a standard input
   * @param {Object} data - the input data
   */
  createStandardInput: function (inputData) {
    const data = {
      placeholder: "",
      value: "",
      type: "text",
      min: -Infinity,
      max: Infinity,
      step: 1,
      callback: null,
      coerce: null,
    };
    copyObjByTraversal(data, inputData);
    const id = generateRandomId();
    
    const element = document.createElement("input");
    element.className = "puzzleStandardInput";
    element.placeholder = data.placeholder;
    element.id = id;
    
    switch (data.type) {
      case "text":
        element.type = "text";
        break;
      case "number":
        element.type = "number";
        element.min = data.min;
        element.max = data.max;
        element.step = data.step;
        
        // implement generic number coersion
        if (!data.coerce) {
          data.coerce = function (value) {
            const parsed = parseFloat(value);
            if (!parsed) return "";
            return String(parsed);
          };
        }
        break;
      case "int":
        element.type = "number";
        element.min = data.min;
        element.max = data.max;
        element.step = data.step;
        
        // implement generic number coersion
        if (!data.coerce) {
          data.coerce = function (value) {
            const parsed = parseInt(value);
            if (!parsed) return "";
            return String(parsed);
          };
        }
        break;
      default:
        throw new Error(`Unknown input type: ${data.type}`);
    }
    element.value = data.value;
    
    // coersion
    element.addEventListener("change", function (event) {
      let value = this.value;
      if (data.coerce) value = data.coerce(value);
      this.value = value;
      
      // callback
      if (data.callback) data.callback({
        event, value
      });
    });
    
    return {
      element: element,
      id: id,
    };
  },
  
  /**
   * create a piece input
   * @param {Object} inputData - the input data
   */
  createPieceInput: function (inputData) {
    const data = {
      placeholder: "Enter Piece",
      value: null,
      callback: null,
    };
    copyObjByTraversal(data, inputData);
    const id = generateRandomId();
    
    // note: this is a placeholder!
    // i'll replace it with an actual piece input later when i feel like it
    const element = document.createElement("input");
    element.className = "puzzleStandardInput";
    element.type = "text";
    element.placeholder = data.placeholder;
    element.value = data.value ?? "";
    element.id = id;
    
    // generic coersion function
    const coersion = function (value) {
      value = value.trim().toUpperCase()[0];
      if (!value) return "";
      if (!"ZLOSIJT".includes(value)) return "";
      return value;
    }
    
    // coersion application
    element.addEventListener("change", function (event) {
      let value = this.value;
      
      value = coersion(value);
      
      this.value = value;
      
      // if the value is empty, set it to null
      if (!value) value = null;
      
      // callback
      if (data.callback) data.callback({
        event, value
      });
    });
    
    return {
      element: element,
      id: id
    };
  },
  
  /**
   * create a piece queue input
   * @param {Object} inputData - the input data
   */
  createPieceQueueInput: function (inputData) {
    const data = {
      placeholder: "Enter Piece Queue",
      value: null,
      callback: null,
    };
    copyObjByTraversal(data, inputData);
    const id = generateRandomId();
    
    // note: this is a placeholder
    const element = document.createElement("input");
    element.className = "puzzleStandardInput";
    element.type = "text";
    element.placeholder = data.placeholder;
    element.value = data.value ?? "";
    element.id = id;
    
    // generic coersion function
    const coersion = function (value) {
      value = value.trim().toUpperCase();
      let valid = "";
      for (const char of value) {
        if ("ZLOSIJT".includes(char)) valid += char;
      }
      return valid;
    }
    
    // coersion application
    element.addEventListener("change", function (event) {
      let value = this.value;
      
      value = coersion(value);
      
      this.value = value;
      
      // callback
      if (data.callback) data.callback({
        event,
        value: value.split(""), // return array with individual pieces
      });
    });
    
    return {
      element: element,
      id: id,
    };
  }
};

const puzzleMenus = {
  puzzleEditor: function () {
    this.uiDisplay.className = "window-fill";
    
    // puzzle modifier
    const pM = PuzzleModifier.default();
    
    const puzzleEditorContainer = document.createElement("div");
    puzzleEditorContainer.className = "window-fill puzzleFlex";
    
    const header = this.uiFunctions.createHeader({
      type: "menuBar",
      root: [
        {
          text: "File",
          type: "tree",
          sub: [
            {
              text: "Export Puzzle",
              type: "tree",
              sub: [
                {
                  text: "Export as JSON",
                  type: "button",
                  interact: null, // placeholder
                },
              ],
            },
            {
              text: "Import Puzzle",
              type: "tree",
              sub: [
                {
                  text: "Import from JSON",
                  type: "button",
                  interact: null, // placeholder
                },
              ],
            },
            {
              text: "Save Puzzle to LocalStorage",
              type: "button",
              interact: null, // placeholder
            },
          ],
        },
        {
          text: "Edit",
          type: "tree",
          sub: [
            {
              text: "Undo",
              type: "button",
              interact: null, // placeholder
            },
            {
              text: "Redo",
              type: "button",
              interact: null, // placeholder
            },
            {
              text: "Mirror",
              type: "tree",
              sub: [
                {
                  text: "Everything",
                  type: "button",
                  interact: null, // placeholder
                },
                {
                  text: "Board State",
                  type: "button",
                  interact: null, // placeholder
                },
              ],
            },
          ],
        },
        {
          text: "Listing",
          type: "tree",
          sub: [
            {
              text: "Navigate to Parent Set",
              type: "button",
              interact: null, // placeholder
            },
          ],
        },
        {
          text: "Help",
          type: "tree",
          sub: [
            {
              text: "Give Up",
              type: "button",
              interact: () => {
                alert("no");
              }, // placeholder
            },
          ],
        },
        {
          text: "Exit",
          type: "button",
          interact: null, // placeholder
        },
      ],
    });
    
    const containers = this.uiFunctions.createDoubleSideBar();
    
    // destructure the containers
    const [
      fullContainer,
      leftContainer,
      middleContainer,
      rightContainer,
    ] = Object.values(containers);
    
    // add to left side bar
    // placeholder function name
    const addToLeftSideBar = () => {
      // remove everything in left side bar
      while (leftContainer.firstChild) {
        leftContainer.removeChild(leftContainer.firstChild);
      }
      
      // text
      const header = document.createElement("h2");
      header.className = "centeredText";
      header.textContent = "Puzzle Editor";
      leftContainer.appendChild(header);
      
      const hr = document.createElement("hr");
      hr.style.margin = "16px 0px";
      leftContainer.appendChild(hr);
      
      const infoText = document.createElement("p");
      infoText.textContent = "This is the Spentris Puzzle Editor. Please give feedback on the functionality and usability of this editor by contacting me directly on Discord.";
      leftContainer.appendChild(infoText);
      
      // inputs
      const buttonContainer = document.createElement("div");
      buttonContainer.className = "puzzleInputsContainer";
      leftContainer.appendChild(buttonContainer);
      
      const buttons = {
        editGameState: this.uiFunctions.createButton(
          "Edit Game State", true, rightSideBarMenus.editGameState
        ),
        editGameplaySettings: this.uiFunctions.createButton(
          "Edit Gameplay Settings", true, rightSideBarMenus.editGameplaySettings
        ),
        editPuzzleSolution: this.uiFunctions.createButton(
          "Edit Puzzle Solution", true, rightSideBarMenus.editPuzzleSolution
        ),
        editPuzzleMetadata: this.uiFunctions.createButton(
          "Edit Puzzle Metadata", true, rightSideBarMenus.editPuzzleMetadata
        ),
        playtestPuzzle: this.uiFunctions.createButton(
          "Playtest Puzzle", true,
        ),
      };
      
      const keys = Object.keys(buttons);
      for (const key of keys) {
        buttonContainer.appendChild(buttons[key].element);
      }
    };
    
    // right side bar menus
    const rightSideBarMenus = {
      editGameState: () => {
        this.uiFunctions.clearContainer(rightContainer);
        
        // text
        const infoDiv = document.createElement("div");
        infoDiv.innerHTML = `
          <h2 class="centeredText">Game State</h2>
          <hr style="margin: 16px 0px;">
          <p>Edit the current game state, such as the board configuration, next pieces, and held pieces.</p>
        `;
        rightContainer.appendChild(infoDiv);
        
        // inputs
        const inputs = document.createElement("div");
        inputs.className = "puzzleInputsContainer";
        
        const elements = {
          boardWidth: {
            label: "Board Width",
            input: this.uiFunctions.createStandardInput({
              placeholder: "Enter Board Width",
              value: this.puzzleModifier.board.width,
              type: "int",
              min: 1,
              max: Infinity,
              step: 1,
              callback: (data) => {
                this.puzzleModifier.board.width = data.value;
              }
            }),
          },
          boardHeight: {
            label: "Board Height",
            input: this.uiFunctions.createStandardInput({
              placeholder: "Enter Board Height",
              value: this.puzzleModifier.board.height,
              type: "int",
              min: 1,
              max: Infinity,
              step: 1,
              callback: (data) => {
                this.puzzleModifier.board.height = data.value;
              }
            }),
          },
          nextQueue: {
            label: "Next Queue",
            input: this.uiFunctions.createPieceQueueInput({
              placeholder: "Enter Next Queue",
              value: this.puzzleModifier.nextQueue.join(""),
              callback: (data) => {
                this.puzzleModifier.nextQueue = data.value;
              }
            }),
          },
          holdPiece: {
            label: "Hold Piece",
            input: this.uiFunctions.createPieceInput({
              placeholder: "Enter Hold Piece",
              value: this.puzzleModifier.holdPiece,
              callback: (data) => {
                this.puzzleModifier.holdPiece = data.value;
              }
            }),
          },
          currentPiece: {
            label: "Current Piece",
            input: this.uiFunctions.createPieceInput({
              placeholder: "Enter Current Piece",
              value: this.puzzleModifier.currentPiece,
              callback: (data) => {
                this.puzzleModifier.currentPiece = data.value;
              }
            }),
          },
        };
        
        const keys = Object.keys(elements);
        for (const key of keys) {
          const element = this.uiFunctions.createLabelInputPair(
            elements[key].label,
            elements[key].input
          ).element;
          inputs.appendChild(element);
        }
        
        rightContainer.appendChild(inputs);
      },
      editGameplaySettings: () => {
        this.uiFunctions.clearContainer(rightContainer);
        
        // text
        const infoDiv = document.createElement("div");
        infoDiv.innerHTML = `
          <h2 class="centeredText">Gameplay Settings</h2>
          <hr style="margin: 16px 0px;">
          <p>This is the gameplay settings editor. Change the difficulty and rules of the game here.</p>
        `;
        rightContainer.appendChild(infoDiv);
        
        // inputs
        const inputs = document.createElement("div");
        inputs.className = "puzzleInputsContainer";
        
        const elements = {
          gravity: {
            label: "Gravity",
            input: this.uiFunctions.createStandardInput({
              placeholder: "Enter Gravity",
              value: this.puzzleModifier.gameplaySettings.gravity,
              type: "number",
              min: 0,
              max: Infinity,
              step: 0,
              callback: (data) => {
                this.puzzleModifier.gameplaySettings.gravity = data.value;
              }
            }),
          },
          lockDelay: {
            label: "Lock Delay",
            input: this.uiFunctions.createStandardInput({
              placeholder: "Enter Lock Delay",
              value: this.puzzleModifier.gameplaySettings.lockDelay,
              type: "number",
              min: 0,
              max: Infinity,
              step: 0,
              callback: (data) => {
                this.puzzleModifier.gameplaySettings.lockDelay = data.value;
              }
            }),
          },
          maxLockDelay: {
            label: "Max Lock Delay",
            input: this.uiFunctions.createStandardInput({
              placeholder: "Enter Max Lock Delay",
              value: this.puzzleModifier.gameplaySettings.maxLockDelay,
              type: "number",
              min: 0,
              max: Infinity,
              step: 0,
              callback: (data) => {
                this.puzzleModifier.gameplaySettings.maxLockDelay = data.value;
              }
            }),
          },
          levelling: {
            label: "Levelling",
            input: this.uiFunctions.createBooleanInput({
              checked: this.puzzleModifier.gameplaySettings.levelling,
              callback: (data) => {
                this.puzzleModifier.gameplaySettings.levelling = data.value;
              }
            })
          },
          startingLevel: {
            label: "Starting Level",
            input: this.uiFunctions.createStandardInput({
              placeholder: "Enter Starting Level",
              value: this.puzzleModifier.gameplaySettings.startingLevel,
              type: "number",
              min: 1,
              max: Infinity,
              step: 1,
              callback: (data) => {
                this.puzzleModifier.gameplaySettings.startingLevel = data.value;
              }
            })
          },
          masterLevels: {
            label: "Master Levels",
            input: this.uiFunctions.createBooleanInput({
              checked: this.puzzleModifier.gameplaySettings.masterLevels,
              callback: (data) => {
                this.puzzleModifier.gameplaySettings.masterLevels = data.value;
              }
            })
          },
          /* make rotation system afterwards */
        };
        
        const keys = Object.keys(elements);
        for (const key of keys) {
          const element = this.uiFunctions.createLabelInputPair(
            elements[key].label,
            elements[key].input
          ).element;
          inputs.appendChild(element);
        }
        
        rightContainer.appendChild(inputs);
      },
      editPuzzleSolution: () => {
        this.uiFunctions.clearContainer(rightContainer);
        
        // text
        const infoDiv = document.createElement("div");
        infoDiv.innerHTML = `
          <h2 class="centeredText">Puzzle Solution</h2>
          <hr style="margin: 16px 0px;">
          <p>This is the puzzle solution editor. Change the puzzle solution here.</p>
        `;
        rightContainer.appendChild(infoDiv);
        
        // inputs
        const inputs = document.createElement("div");
        inputs.className = "puzzleInputsContainer";
        
        // for javascript securityVulnerability
        const winConditions = this.puzzleModifier.puzzleWinConditions;
        // add javascript to it if it doesnt exist
        if (!winConditions.find(c => c.type === "securityVulnerability")) {
          winConditions.push({
            version: 1,
            type: "securityVulnerability",
            parameters: {
              javascript: "",
            }
          });
        }
        
        // get the javascript condition
        const javascriptCondition = winConditions.find(
          c => c.type === "securityVulnerability"
        );
        
        const elements = {
          // use the securityVulnerability function to set the solution
          // as the name suggests, this is temporary
          javascript: {
            label: "JavaScript",
            input: this.uiFunctions.createStandardInput({
              placeholder: "Enter JavaScript Code",
              value: javascriptCondition.parameters.javascript,
              type: "text",
              callback: (data) => {
                javascriptCondition.parameters.javascript = data.value;
              }
            }),
          },
        };
        
        const keys = Object.keys(elements);
        for (const key of keys) {
          const element = this.uiFunctions.createLabelInputPair(
            elements[key].label,
            elements[key].input
          ).element;
          inputs.appendChild(element);
        }
        
        rightContainer.appendChild(inputs);
      },
      editPuzzleMetadata: () => {
        this.uiFunctions.clearContainer(rightContainer);
        
        // text
        const infoDiv = document.createElement("div");
        infoDiv.innerHTML = `
          <h2 class="centeredText">Puzzle Metadata</h2>
          <hr style="margin: 16px 0px;">
          <p>This is the puzzle metadata editor. Change the puzzle metadata here.</p>
        `;
        rightContainer.appendChild(infoDiv);
        
        // inputs
        const inputs = document.createElement("div");
        inputs.className = "puzzleInputsContainer";
        
        const elements = {
          puzzleName: {
            label: "Puzzle Name",
            input: this.uiFunctions.createStandardInput({
              placeholder: "Enter Puzzle Name",
              value: this.puzzleModifier.puzzleMetadata.name,
              type: "text",
              callback: (data) => {
                this.puzzleModifier.puzzleMetadata.name = data.value;
              }
            })
          },
          puzzleAuthor: {
            label: "Puzzle Author",
            input: this.uiFunctions.createStandardInput({
              placeholder: "Enter Puzzle Author",
              value: this.puzzleModifier.puzzleMetadata.author,
              type: "text",
              callback: (data) => {
                this.puzzleModifier.puzzleMetadata.author = data.value;
              }
            })
          },
          puzzleDescription: {
            label: "Puzzle Description",
            input: this.uiFunctions.createStandardInput({
              placeholder: "Enter Puzzle Description",
              value: this.puzzleModifier.puzzleMetadata.description,
              type: "text",
              callback: (data) => {
                this.puzzleModifier.puzzleMetadata.description = data.value;
              }
            })
          }
        };
        
        const keys = Object.keys(elements);
        for (const key of keys) {
          const element = this.uiFunctions.createLabelInputPair(
            elements[key].label,
            elements[key].input
          ).element;
          inputs.appendChild(element);
        }
        
        rightContainer.appendChild(inputs);
      },
    };
    
    addToLeftSideBar();
    puzzleEditorContainer.appendChild(header);
    puzzleEditorContainer.appendChild(fullContainer);
    this.uiDisplay.appendChild(puzzleEditorContainer);
  },
};

export {
  puzzleUiFunctions,
  puzzleMenus,
};