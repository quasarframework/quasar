---
title: Global node generation
desc: Some Quasar components and plugins to show floating elements will create global nodes appending them to the body.
---
You can define custom className for this global node elements.

## Installation
You don't need to do anything.

## Configuration

In order to define custom class for global nodes, edit your /quasar.conf.js file like below.

```js
// file: /quasar.conf.js

framework: {
  config: {
    globalNode: {
      className: 'my-class'
    }
  }
}
```
