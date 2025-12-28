# Puzzle Hierarchy Planning

This document outlines the structure of the *Puzzle Hierarchy* system that will reasonably organize *Puzzles*, *Puzzle Sets*, *Lessons*, and any other addition that may be added in the future.

## Purpose of the Puzzle

The *Puzzle*, at its core, defines a gameplay scenario the player must complete. This, on its own, isn't enough to constitute utility.

Another layer must be added to bring ease-of-use and purpose to a puzzle. The *Puzzle Set* groups together puzzles, usually by a common theme. By creating this, it is possible for people to easily play many different puzzles and train their vision using the whole rather than the part.

*Puzzle Sets* are very useful for drilling puzzles and also for generally collecting them in a single set, however it does not constitute all the uses. In the future, *Lessons* should be added that integrate further features. The idea of Lessons isn't fully thought out yet, and may not be fully compatible with the current system. In the future, it is necessary the provide a proper outline for the purpose, function, and then integration of the Lesson.

# Puzzle Format

Puzzles will be distributed via `Puzzle` objects rather than `PuzzleModifier` objects. While the `PuzzleModifier` format has been more developed, it is, at its core, simply used by the editor just to provide a class that more closely matches the inputs. Thus, new developments would have to be made with the `Puzzle` class to provide the sufficient data necessary for distribution. The firstmost and most necessary addition to the format would be the inclusion of metadata, which has been overlooked at the time of creation.

# Internal Puzzle Storage Format

This section covers the actual storage and reference to the `Puzzle` objects that may be used by other objects. The main objective is to provide a structure for the *Puzzles* themselves, such as how they will relate to *Puzzle Sets* and other *Puzzle*-dependent objects.

## Overall System

The puzzles should all be stored in a single map rather than being strictly a part of another object, such as a *Puzzle Set*. To make references more consistent, a map will be used instead of an array so that the indices will always be aligned.

The keys in the map will be a hash of the puzzle itself. The hash should be determined by converting the puzzle to a JSON where all the keys are sorted in alphabetical order and then performing an MD5 hash.

## Implementation

The class `PuzzleReferenceMap` will contain the interface to retrieve `Puzzle` objects from a given hash (identification).