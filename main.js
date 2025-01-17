// menus
import { MenuHandler, spentrisMenus } from "./ui/menu/menu.js";

function main() {
  const menus = new MenuHandler({
    menus: spentrisMenus,
    currentMenu: "home",
  });
  
  
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}