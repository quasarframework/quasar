---
title: Baseline fixture, basics
desc: Exercises the inline and block rules of the markdown pipeline.
---

Intro paragraph with **bold**, _emphasis_, `inline code` and typographer
input: "double quotes", 'single quotes', an ellipsis... and a (c) symbol.

## Links

An [internal link](/vue-components/knob), a [hash link](#links), an
[encoded link](/options/screen%20plugin) and an
[external link](https://quasar.dev) all become doc-link.

## Blocks

> A blockquote becomes a doc-note.

- unordered item
- item with `code`

1. ordered item
2. second item

![fixture image](https://cdn.quasar.dev/img/fixture.png)

### Table

| Prop   | Type   | Description            |
| ------ | ------ | ---------------------- |
| `size` | String | Renders in a doc-token |
| model  | Number | Plain cell             |

### Heading with `code` and **bold**

#### An h4 heading stays out of the toc

Content under a deep heading.

## HTML blocks

<DocApi file="QKnob" />

<DocInstall title="Custom Install" />
