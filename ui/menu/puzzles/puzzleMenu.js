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

const puzzleUiFunctions = {
  /**
   * delete all elements in uiDisplay
   */
  resetDisplay: function () {
    while (this.uiDisplay.firstChild) {
      this.uiDisplay.removeChild(this.uiDisplay.firstChild);
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
    
    return button;
  },
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
    {
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
      
      const buttonContainer = document.createElement("div");
      buttonContainer.className = "puzzleButtonContainer";
      leftContainer.appendChild(buttonContainer);
      
      const buttons = {
        editGameState: this.uiFunctions.createButton(
          "Edit Game State", true,
        ),
        editPuzzleSolution: this.uiFunctions.createButton(
          "Edit Puzzle Solution", true,
        ),
        editGameplaySettings: this.uiFunctions.createButton(
          "Edit Gameplay Settings", true,
        ),
        editPuzzleMetadata: this.uiFunctions.createButton(
          "Edit Puzzle Metadata", true,
        ),
        playtestPuzzle: this.uiFunctions.createButton(
          "Playtest Puzzle", true,
        ),
      };
      
      const keys = Object.keys(buttons);
      for (const key of keys) {
        buttonContainer.appendChild(buttons[key]);
      }
    }
    
    puzzleEditorContainer.appendChild(header);
    puzzleEditorContainer.appendChild(fullContainer);
    this.uiDisplay.appendChild(puzzleEditorContainer);
  },
};

export {
  puzzleUiFunctions,
  puzzleMenus,
};