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
      ],
    });
    
    this.uiDisplay.appendChild(header);
  },
};

export {
  puzzleUiFunctions,
  puzzleMenus,
};