// access files for game initialization
import { files } from "../../engine/functionLibrary.js";

// default keybinds
import { playKeybinds, metaKeybinds } from "../../interaction/keyboard.js";

// rotation system data
import { SRSPlusData } from "../../engine/rsData.js";

// local storage
import { ls, defaultStorage } from "../../localStorage/localStorage.js";

// they're both intended to be unchanged
// clean up the code later
const defaultValues = defaultStorage;

// the values are automatically set to the localStorage values
const values = {
  handling: ls.values.handling ?? structuredClone(defaultValues.handling),
  keybinds: {
    play: ls.values.keybinds.play ?? structuredClone(playKeybinds),
    meta: ls.values.keybinds.meta ?? structuredClone(metaKeybinds),
  },
  language: ls.values.language ?? defaultValues.language,
};

export { values, defaultValues };