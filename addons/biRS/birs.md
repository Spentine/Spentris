# Bidirectional Rotation System

The *Bidirectional Rotation System* (BiRS) is a rotaion system originating from the game *Techmino*. It shifts the offsets depending on whether the *softdrop*, *left*, or *right* directional keys are pressed at the time of rotation.

## Data Tables

The BiRS data tables are constructed through 3 main kick sequences:

- CW "Right" Sequence (r): `{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: -1}, {x: 0, y: -1}, {x: -1, y: 1}, {x: 1, y: -1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 0, y: 2}, {x: -1, y: 2}, {x: 1, y: 2}, {x: -2, y: 0}, {x: 2, y: 0}`
- CCW "Left" Sequence (l): `{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: -1}, {x: 1, y: 1}, {x: -1, y: -1}, {x: -1, y: 0}, {x: 0, y: 1}, {x: -1, y: 1}, {x: 0, y: 2}, {x: 1, y: 2}, {x: -1, y: 2}, {x: 2, y: 0}, {x: -2, y: 0}`
- 180 "Flip" Sequence (f): `{x: 0, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}, {x: 0, y: 2}`

For 180 kicks, they are assigned to the pieces as so, with each key specifying the initial and final rotation:

```js
const pieceKicks = {
  Z: {02: l, 20: r, 13: r, 31: l},
  S: {02: r, 20: l, 13: r, 31: l},
  J: {02: l, 20: r, 13: l, 31: r},
  L: {02: r, 20: l, 13: l, 31: r},
  T: {02: f, 20: f, 13: l, 31: r},
  O: {02: f, 20: f, 13: f, 31: f},
  I: {02: f, 20: f, 13: r, 31: l},
}
```

For CW and CCW kicks, every piece is assigned the same kicks besides the **O** piece, which has its `r` and `l` sequences swapped.

```js
{ 01: r, 10: l, 03: l, 30: r,
  12: r, 21: l, 32: l, 23: r }
```

## Kicks

To perform the kicks, determine what kick offsets should be applied first. While rotation occurs, set the cumulative position offset by checking the each movement input. For each input, move the piece in that direction one mino from the original piece with the same starting rotation, and check whether there is any collision. If there is a collision, move the cumulative offset in that direction.

Once the offset has been determined, offset all the corresponding kicks in that direction. The kicks must satisfy these conditions before they can be checked:

- `(kickX + offsetX) * offsetX >= 0`
- `(kickX + offsetX)^2 + (kickY + offsetY)^2 <= 5`
- `(piece will not lock down) or (kickY + offsetY <= 0)`

If all the kicks with a particular offset fail, then try all the kicks again resetting the X offset. If it fails again, reset the Y offset, which removes the bidirectionality offset. If it fails once more, the rotation has failed.

## Implementation

The rotation system data table computation can be found in `biRS/biRSData.js`, whereas the kick function can be found in `biRS/bidirectionalRS.js`.