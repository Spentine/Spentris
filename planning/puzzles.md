# Puzzles UI Planning

The Puzzles UI should handle the creation of puzzles. It should be able to support a multitude of features, including but not limited to being able to create puzzles with:

- **Win Conditions**
  - The ability to be completed when a certain clear is fulfilled
  - The ability to be completed when certain piece placements are made
  - Other win conditions
- **Board State**
  - A specific starting board state
  - A specific starting piece queue
  - A specific starting hold queue
  - A specific current piece
- **Collections**
  - The inclusion in a larger set with ease-of-creation
  - Possible independence as a single puzzle
- **Other**
  - A replay being started on puzzle load to demonstrate how it is a practical scenario

## Menus

The Puzzles Menus should allow for the creation of the aforementioned puzzles. To accomplish this, there will be different menus with varying complexity. Each individual menu will contain two side banners that will contain more information about the data. At the moment, the banners will be at a fixed location, but in the future it may be expanded to allow for more dynamic location areas.

### Puzzle Creation Menu

The main menu that allows for puzzle creation. It should be very interactive and contain many settings.

- **Sidebar Menu Settings**
  - Edit Game State
    - Board Width (number)
    - Board Height (number)
    - Next Queue (list of pieces)
    - Hold Queue (piece)
    - Current Piece (piece)
  - Edit Gameplay Settings
    - Gravity (number)
    - Lock Delay (number)
    - Max Lock Delay (number)
    - Levelling (boolean)
    - Starting Level (number)
    - Master Levels (boolean)
  - Edit Puzzle Solution
    - Select Puzzle Solution (selection)
      - Particular Line Clears
      - Minimum Attack Amount
      - Prespecified Piece Placements
    - Selection: **Particular Line Clears**
      - Disregard Clear Order (checkbox)
      - *There should be a way to add line clears to a list and interact with it in meaningful ways.* (list of line clears)
    - Selection: **Minimum Attack Amount**
      - Attack Amount (number)
    - Selection: **Prespecified Piece Placements**
      - *There should be a way to specify the piece placements in an easy way without having to do a lot of visualization*
  - Edit Puzzle Metadata
    - Edit Puzzle Name (string)
    - Edit Puzzle Author (string)
    - Edit Puzzle Description (string)
    - Edit Puzzle Creation Date (datetime)
  - Playtest Puzzle
- **Header Menu Settings**
  - File
    - Export Puzzle
      - Export as JSON (button)
    - Import puzzle
      - Import from JSON (button)
    - Save Puzzle to LocalStorage
  - Edit
    - Undo (button)
    - Redo (button)
    - Mirror
      - Everything (button)
      - Board State (button)
  - Listing
    - Navigate to Parent Set
  - Help
  - Exit
- **Center Graphics**
  - *The center will contain the board state as-is*
  - *It should be possible to interact with the board state to change various properties of it.*
    - *For example, clicking on the board should allow the user to immediately change the board state.*

### Puzzle Set Menu

*unfinished documents*

## `puzzleModification.js`

This script should handle the actual puzzle modifications while the UI will present the actions to the user. It will be in charge of also saving and loading puzzles from JSON. The puzzle modifier should inherently be separate from the `Puzzle` class, but still provide a method to convert to and from it.