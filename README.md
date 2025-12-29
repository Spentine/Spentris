# Spentris

Play the online webgame [here](https://spentine.github.io/Spentris)!

Spentris is a *Block Stacking* game which is planned to contain a variety of features centered around learning and practicing mechanics. It is mainly intended for use by both beginners and experienced players with a wide variety of tools.

## Guaranteed Features

The main motive for creating this project is to provide a way for people to create *Puzzles*. As such, so far it has been the most developed feature that distinguishes this engine from others. It contains a *Puzzle Editor* which can be used to create interactive puzzles to practice and refresh gameplay skills.

Not only will practicing with puzzles be a thing, but also the ability to learn new techniques will be included with *Lessons*. However, at the current rate of development, it probably would be a long time before it would actually be made.

## Possible Features

Multiplayer features may be a possiblity in the future, but isn't guaranteed due to the fact that other games also sufficiently provide multiplayer gameplay. Simply put, it would not be a defining feature of this project, but it would be nice to have. If online multiplayer isn't possible, it may be more feasible to have local multiplayer against bots.

A friend of mine suggested that there be a passive finesse trainer included so that people would be able to improve their placement skills. It's not the main focus of the game either, but it would also be convenient.

## Codebase

The *Spentris* codebase should be reasonably thought-out and well-documented. The style should also be consistent and readable. Because this is a large project spanning more than a year, the code readability should be heavily emphasized so that it is possible to resume work without having to relearn the codebase. Thus, a few conventions *should preferably* be followed:

- Document your code as you go.
  - Use *JSDoc* comments if a function will be used across multiple scripts.
- Ideally two-space indentation.
- Reasonable use of Object-Oriented Programming.
  - *There isn't a consistent definition for "Object-Oriented", but in general, abstracting concepts is preferred.*
- Every once in a while, review the code and documentation.

## Personal Narrative

Ever since I started helping people improve at the game *TETR.IO*, I had been searching for better tools available online to practice. However, many of the already-existing programs are catered more towards professionals. Even then, they're more for recreational thought than practicality in a match. I had also generally been interested in the game mechanics and had created a *Block Stacker* game in *Scratch* even before then, which helped me understand fully how the game works and what to expect from implementing.

So then, in the summer of 2024 when I had an abundance of free time at my disposal, I decided to create a *Block Stacker* game in JavaScript for the first time. I implemented basic gameplay and a way to play puzzles, but not a way to make puzzles (I had to do so through a very rudimentary and developer-oriented page which is not directly accessible). In the end, because I was rushed, the entire code quickly turned into an unconventional and uncoordinated spaghetti.

About two months later, I yet again wanted to redo it, but fully ensure I would not be forced to restart again. Rather than jumping straight into development, I spent two more months deliberately planning the program as a whole rather than writing code. After planning the general structure of the program, development became much smoother and the code became easier to work with.

Unfortunately, because of life's complexities, I decided to work on the project more sparsely over time. I wanted to work on this project more and more recently, so hopefully major features would be completed sooner or later.

## Extra Information

The previous version of *Spentris* can be found [here (repository)](https://github.com/Spentine/Block-Stacker) and can be played [here (webgame)](https://spentine.github.io/Block-Stacker/init.html). Have fun!

### Legal

***This game is not associated with Tetris in any way, shape, or form.*** It is a game of the *Block Stacker* genre.

### Contributors and Credits

- **@Spentine**: Sole developer and organizer
  - Created entire codebase (minus dependencies)
  - Designed both menu and in-game user interfaces
  - *Bloxyl* font used for English language display
- **TETR.IO**: Skin assets
- **Wasmoon**: Lua integration into JavaScript

People are welcome to contribute code, assets, and translations!