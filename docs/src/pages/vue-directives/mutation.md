---
title: Mutation Directive
desc: Vue directive that uses Mutation Observer API to watch for changes being made to the DOM tree.
badge: "v1.3.0+"
---

"Mutation" is a Quasar directive that provides the ability to watch for changes being made to the DOM tree and call a method when these are triggered.

Under the covers, it uses the [Mutation Observer API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).

## Installation

<doc-installation directives="Mutation" />

## Usage

Reading the [Mutation Observer API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) first will be best in your understanding of how this directive works.

The handler Function takes one parameter, which is an Array of [MutationRecord](https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord).

### Catch everything

By not specifying any modifiers (except for "once"), the Mutation directive will enable all of them.

<doc-example title="Catch everything" file="Mutation/CatchAll" />

### Type: childList

<doc-example title="childList" file="Mutation/ChildList" />

### Type: attributes

<doc-example title="childList" file="Mutation/Attributes" />

### Type: characterData

<doc-example title="characterData" file="Mutation/CharacterData" />

## API

<doc-api file="Mutation" />
