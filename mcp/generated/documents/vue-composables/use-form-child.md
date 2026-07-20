---
title: useFormChild composable
description: What is Quasar's useFormChild() composable and how you can use it
canonical: https://quasar.dev/vue-composables/use-form-child
kinds: composable
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

This composable refers to [QForm](/vue-components/form) wrapping your own custom component which you want to communicate with.

## Syntax

```js
import { useFormChild } from 'quasar'

setup () {
  // function validate () { ... }
  // function resetValidation () { ... }

  useFormChild({
    validate, // Function; Can be async;
              // Should return a Boolean (or a Promise resolving to a Boolean)
    resetValidation,    // Optional function which resets validation
    requiresQForm: true // should it error out if no parent QForm is found?
  })
}
```
