# Board Editor

The **Board Editor** is an integral part of the *Puzzle Editor* that allows for the creation of custom board states conviently in a GUI format. It should use keybinds that are natural for Block Stacker board creation in particular.

## Usage

The Board Editor should allow for the efficient creation of a variety of board states. It should apply to *many different sizes of rectangular* boards. It should also be able to place minos in the nonvisible range above the board, rather than existing exclusively on the 10x20 visual board. In the future, there should be a sufficient level of customizability. A nice quality-of-life feature would be the ability to convert a screenshot into a board state. Undo and Redo features should also exist, but I'm not exactly sure how to implement it.

The Board Editor will contain several *editing modes*, each of which makes a particular style of editing more convenient or efficient. For instance, when shifting all minos up, it would be inconvenient to manually shift all minos. Rather, a mode to shift minos would be much more preferable. The editing modes should be expandable in the future in case there are any miscellaneous additions.

## Modes

- Standard
  - **Click**: Places / removes mino on board, depending on whether there was already a mino present at the location of click.
  - **Shift + Click**: Fills in an entire row minus the mino that was clicked, effectively creating a garbage row.
  - **Ctrl + Click**: Fills / clears row on board, depending on whether there was a mino present at the location of click.
  - **Ctrl + Shift + Click**: Fills / clears rectangle on board, depending on whether there was a mino present at the location of click.
- Selection
  - **Click**: Selects / deselects mino on board, depending on whether the mino was selected at the location of click.
  - **Shift + Click**: Selects a rectangle specified by the mino at the location of click and the location of letting go.
  - **Ctrl + Click**: Selects / deselects an entire row.
  - **Ctrl + Shift + Click**: Deselects a rectangle specified by the mino at the location of click and the location of letting go.
- Movement
  - **Click**: Moves selection according to mouse position, sort of like dragging it around.
  - **Arrow Keys**: Moves selection in the direction specified. If nothing is selected, the entire board will become selected.
- Miscellaneous Operations
  - Mirror Selection
  - Greyscale Selection