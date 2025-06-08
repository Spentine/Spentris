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
       * constructs a sub-menu tree
       * @param {Array} subItems - array of sub-menu items
       * @param {Object} position - position of the sub-menu
       */
      const constructSubTree = function (subItems) {
        const subMenu = document.createElement("div");
        subMenu.className = "puzzleSubMenu";
        
        for (const subItem of subItems) {
          const subContainer = document.createElement("div");
          subContainer.className = "puzzleSubMenuContainer";
          
          const subItemElement = document.createElement("div");
          subItemElement.className = "puzzleSubMenuItem";
          
          const subInnerText = document.createElement("p");
          subInnerText.className = "puzzleSubMenuItemText";
          subInnerText.textContent = subItem.text;
          subItemElement.appendChild(subInnerText);
          
          subContainer.appendChild(subItemElement);
          
          if (subItem.type === "tree") {
            // expand recursively
            const nestedSubMenu = constructSubTree(subItem.sub);
            
            // hide nested sub-menu by default
            nestedSubMenu.style.display = "none";
            
            // add event listener for hover
            subContainer.addEventListener("mouseover", () => {
              nestedSubMenu.style.display = ""; // set to default
            });
            subContainer.addEventListener("mouseout", () => {
              nestedSubMenu.style.display = "none"; // hide
            });
            
            subContainer.appendChild(nestedSubMenu);
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
          
          // hide sub-menu by default
          subMenu.style.display = "none";
          
          // add event listener
          container.addEventListener("mouseover", () => {
            subMenu.style.display = ""; // set to default
          });
          container.addEventListener("mouseout", () => {
            subMenu.style.display = "none"; // hide
          });
          
          container.appendChild(subMenu);
        }
        
        menuBar.appendChild(container);
      }
      
      return menuBar;
    }
  },
};

const puzzleMenus = {
  puzzleEditor: function () {
    this.uiDisplay.className = "window-fill";
    
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
                  interact: () => {}, // placeholder
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
                  interact: () => {}, // placeholder
                },
              ],
            },
            {
              text: "Save Puzzle to LocalStorage",
              type: "button",
              interact: () => {}, // placeholder
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
              interact: () => {}, // placeholder
            },
            {
              text: "Redo",
              type: "button",
              interact: () => {}, // placeholder
            },
            {
              text: "Mirror",
              type: "tree",
              sub: [
                {
                  text: "Everything",
                  type: "button",
                  interact: () => {}, // placeholder
                },
                {
                  text: "Board State",
                  type: "button",
                  interact: () => {}, // placeholder
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
              interact: () => {}, // placeholder
            },
          ],
        },
      ],
    });
    
    this.uiDisplay.appendChild(header);
  },
};

export {
  puzzleUiFunctions,
  puzzleMenus,
};