---
title: Mutation Directive
desc: Vue directive that uses Mutation Observer API to watch for changes being made to the DOM tree.
keys: mutation
---

"Mutation" is a Quasar directive that provides the ability to watch for changes being made to the DOM tree and call a method when these are triggered.

Under the covers, it uses the [Mutation Observer API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).

## Mutation API

<doc-api file="Mutation" />

## Usage

Reading the [Mutation Observer API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) first will be best in your understanding of how this directive works.

The handler Function takes one parameter, which is an Array of [MutationRecord](https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord).

### Catch everything

By not specifying any modifiers (except for "once"), the Mutation directive will enable all of them.

<doc-example title="Catch everything" file="Mutation/CatchAll" />

### Drag and drop example

The example below will only work for desktops because of the Drag and drop browser API support. Drag the colored squares to the other location to see the Mutation Observers results.

<doc-example title="Drag and Drop (desktop only)" file="Mutation/DragDrop" />

### Undo-redo example

One use-case for the Mutation Observer is implementing an Undo/Redo stack in your application. You can observe additions and removals of data, depending on your filtering requirements. You can capture the mutations in a stack and use the stack to implement an undo. Any mutation data during an undo, can go into a redo stack. Don't forget to clear the redo stack when normalized data is being put into the undo stack.

<doc-example title="Undo/Redo" file="Mutation/UndoRedo" />
