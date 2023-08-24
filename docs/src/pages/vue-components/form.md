---
title: Form
desc: The QForm Vue component renders a form and allows easy validation of child form components like QInput, QSelect or QField.
keys: QForm
examples: QForm
related:
  - /vue-components/input
  - /vue-components/select
  - /vue-components/field
  - /vue-composables/use-form-child
---

The QForm component renders a `<form>` DOM element and allows you to easily validate child form components (like [QInput](/vue-components/input#Internal-validation), [QSelect](/vue-components/select) or your [QField](/vue-components/field) wrapped components) that have the **internal validation** (NOT the external one) through `rules` associated with them.

<doc-api file="QForm" />

## Usage

::: warning
Please be aware of the following:
* QForm hooks into QInput, QSelect or QField wrapped components
* QInput, QSelect or QField wrapped components must use the internal validation (NOT the external one).
* If you want to take advantage of the `reset` functionality, then be sure to also capture the `@reset` event on QForm and make its handler reset all of the wrapped components models.
:::

<doc-example title="Basic" file="Basic" />

In order for the user to be able to activate the `@submit` or `@reset` events on the form, create a QBtn with `type` set to `submit` or `reset`:

```html
<div>
  <q-btn label="Submit" type="submit" color="primary"/>
  <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
</div>
```

Alternatively, you can give the QForm a Vue ref name and call the `validate` and `resetValidation` functions directly:

```js
// Composition API variant

// <q-form ref="myForm">

setup () {
  const myForm = ref(null)

  function validate () {
    myForm.value.validate().then(success => {
      if (success) {
        // yay, models are correct
      }
      else {
        // oh no, user has filled in
        // at least one invalid value
      }
    })
  }

  // to reset validations:
  function reset () {
    myForm.value.resetValidation()
  }

  return {
    myForm,
    // ...
  }
}
```

```js
// Options API variant

// <q-form ref="myForm">

this.$refs.myForm.validate().then(success => {
  if (success) {
    // yay, models are correct
  }
  else {
    // oh no, user has filled in
    // at least one invalid value
  }
})

// to reset validations:
this.$refs.myForm.resetValidation()
```

## Turning off Autocompletion
If you want to turn off the way that some browsers use autocorrection or spellchecking of all of the input elements of your form, you can also add these pure HTML attributes to the QForm component:

```html
autocorrect="off"
autocapitalize="off"
autocomplete="off"
spellcheck="false"
```

## Submitting to a URL (native form submit)
If you are using the native `action` and `method` attributes on a QForm, please remember to use the `name` prop on each Quasar form component, so that the sent formData to actually contain what the user has filled in.

```html
<q-form action="https://some-url.com" method="post">
  <q-input name="firstname" ...>
  <!-- ... -->
</q-form>
```

* Control the way the form is submitted by setting `action`, `method`, `enctype` and `target` attributes of QForm
* If a listener on `@submit` IS NOT present on the QForm then the form will be submitted if the validation is successful
* If a listener on `@submit` IS present on the QForm then the listener will be called if the validation is successful. In order to do a native submit in this case:

```html
<q-form action="https://some-url.com" method="post" @submit.prevent="onSubmit">
  <q-input name="firstname" ...>
  <!-- ... -->
</q-form>
```

```js
methods: {
  onSubmit (evt) {
    console.log('@submit - do something here', evt)
    evt.target.submit()
  }
}
```

## Child communication

By default, all the Quasar form components communicate with the parent QForm instance. If, for some reason, you are creating your own form component (**that doesn't wrap a Quasar form component**), then you can make QForm aware of it by using:

```js
// Composition API variant

import { useFormChild } from 'quasar'

setup () {
  // function validate () { ... }

  useFormChild({
    validate, // Function; Can be async;
              // Should return a Boolean (or a Promise resolving to a Boolean)
    resetValidation,    // Optional function which resets validation
    requiresQForm: true // should it error out if no parent QForm is found?
  })
}
```

```js
// Options API variant

import { QFormChildMixin } from 'quasar'

// some component
export default {
  mixins: [ QFormChildMixin ],

  methods: {
    // required! should return a Boolean
    // or a Promise resolving to a Boolean
    validate () {
      console.log('called my-comp.validate()')
      return true
    },

    // optional function
    resetValidation () {
      // ...
    }
  },

  // ...
}
```
