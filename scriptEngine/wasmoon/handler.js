/*

Spentine
Created on 20251004

> wasmoon is the coolest thing ever omg
> i hope it is sandboxed properly
> or else there will be a cool security vulnerability

*/

import { tryImports } from "../../util.js";

/*
  in case i'm offline and can't download from the cdn
*/
const { LuaFactory } = await tryImports(
  "https://cdn.jsdelivr.net/npm/wasmoon@latest/+esm",
  new URL("./compiled/wasmoon.js", import.meta.url)
);

const factory = new LuaFactory();

async function createLuaState() {
  const lua = await factory.createEngine();
  
  // provide console.log functionality
  lua.global.set("console", {log: console.log});
  
  return lua;
}

export { createLuaState };