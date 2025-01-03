# event plan

```js
// movement events
moveLeft: new CustomEvent("move", {
  detail: {
    direction: "left",
    origin: "userInput",
  },
}),
moveRight: new CustomEvent("move", {
  detail: {
    direction: "right",
    origin: "userInput",
  },
}),
arrLeft: new CustomEvent("move", {
  detail: {
    direction: "left",
    origin: "arr",
  },
}),
arrRight: new CustomEvent("move", {
  detail: {
    direction: "right",
    origin: "arr",
  },
}),
```
> *it's important to distinguish between movement and arr, however they both should still behave similarly*

```js
// drop events
gravity: new CustomEvent("drop", {
  detail: {
    type: "gravity",
    origin: "gravity",
  },
}),
softDrop: new CustomEvent("drop", {
  detail: {
    type: "gravity",
    origin: "userInput",
  },
}),
sonicDrop: new CustomEvent("drop", {
  detail: {
    type: "sonicDrop",
    origin: "userInput",
  },
}), // for infinite gravity
```
> *note that sonic drop is also used for infinite soft drop factor*

```js
// placement events
hardDrop: new CustomEvent("place", {
  detail: {
    type: "hardDrop",
    origin: "userInput",
  }
}),
pieceLock: new CustomEvent("place", {
  detail: {
    type: "lockDelay",
    origin: "lockDelay",
  },
}),
```
> *it's important to distinguish between user-enacted and forced piece locks*

```js
// rotation events
rotateCW: new CustomEvent("rotate", {
  detail: {
    direction: "cw",
    origin: "userInput",
  },
}),
rotateCCW: new CustomEvent("rotate", {
  detail: {
    direction: "ccw",
    origin: "userInput",
  },
}),
rotate180: new CustomEvent("rotate", {
  detail: {
    direction: "180",
    origin: "userInput",
  },
}),
```
> *they should behave somewhat similar*

```js
// spin events (for spin bonuses)
spinFull: new CustomEvent("spin", {
  detail: {
    type: "full",
    origin: "userInput",
  },
}),
spinMini: new CustomEvent("spin", {
  detail: {
    type: "mini",
    origin: "userInput",
  },
}),
```
> *one is more important than the other*
> ***consider*** *making it an attribute with `rotate` rather than a standalone event*

```js
// hold events
holdPiece: new CustomEvent("hold", {
  detail: {
    allowed: true,
    origin: "userInput",
  },
}),
holdDisallowed: new CustomEvent("hold", {
  detail: {
    allowed: false,
    origin: "userInput",
  },
}),
```
> *they both are actions emitted when the user requests to hold the piece*

```js
// clear line events
// consider making it cache events
/**
 * creates a clear event
 * @param {number} linesCleared
 * @param {string | null} spin
 */
clearLines: (data) => {
  data = data ?? {};
  return new CustomEvent("clear", {
    detail: {
      lines: data.linesCleared ?? 0,
      spin: data.spin ?? null,
      b2b: data.b2b ?? 0,
      piece: data.piece ?? null,
      combo: data.combo ?? 0,
      perfectClear: data.perfectClear ?? false,
    },
  });
},
```
> *this is a function that creates events because of the wide variety of possible events*

```js
// end events
// 10.1.5
topOut: new CustomEvent("end", {
  detail: {
    type: "topOut",
  },
}),
// 10.1.6
lockOut: new CustomEvent("end", {
  detail: {
    type: "lockOut",
  },
}),
// 10.1.7
blockOut: new CustomEvent("end", {
  detail: {
    type: "blockOut",
  },
}),
```
> *various game end states as dictated by section 10, however only 10.1.7 would be be used ingame*

```js
// reset events
resetGame: new CustomEvent("reset", {
  detail: {
    origin: "userInput",
  },
}),
```
> *at the moment only the user can initiate a game reset however puzzles may also reset the game*