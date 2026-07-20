---
title: Global node generation
description: Some Quasar components and plugins to show floating elements will create global nodes appending them to the body.
canonical: https://quasar.dev/options/global-node
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

You can define custom className for this global node elements.

## Installation

You don't need to do anything.

## Configuration

In order to define custom class for global nodes, edit your /quasar.config file like below.

```js /quasar.config file
framework: {
  config: {
    globalNode: {
      className: 'my-class'
    }
  }
}
```
