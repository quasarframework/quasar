---
title: Form
description: The QForm Vue component renders a form and allows easy validation of child form components like QInput, QSelect or QField.
canonical: https://quasar.dev/vue-components/form
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QForm](../../api/QForm.md)
- [QFormChildMixin](../../api/QFormChildMixin.md)

The QForm component renders a `<form>` DOM element and allows you to easily validate child form components (like [QInput](/vue-components/input#Internal-validation), [QSelect](/vue-components/select) or your [QField](/vue-components/field) wrapped components) that have the **internal validation** (NOT the external one) through `rules` associated with them.

**API reference:** [QForm](../../api/QForm.md)

## Usage

::: warning
Please be aware of the following:

- QForm hooks into QInput, QSelect or QField wrapped components
- QInput, QSelect or QField wrapped components must use the internal validation (NOT the external one).
- If you want to take advantage of the `reset` functionality, then be sure to also capture the `@reset` event on QForm and make its handler reset all of the wrapped components models.

:::

**Example: Basic**

Source: [Basic.vue](../../examples/QForm/Basic.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        v-model="name"
        label="Your name *"
        hint="Name and surname"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        filled
        type="number"
        v-model.number="age"
        label="Your age *"
        lazy-rules
        :rules="[
          val => (val !== null && val !== '') || 'Please type your age',
          val => (val > 0 && val < 100) || 'Please type a real age'
        ]"
      />

      <q-toggle v-model="accept" label="I accept the license and terms" />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const $q = useQuasar()

const name = ref(null)
const age = ref(null)
const accept = ref(false)

function onSubmit() {
  if (accept.value !== true) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'You need to accept the license and terms first'
    })
  } else {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Submitted'
    })
  }
}

function onReset() {
  name.value = null
  age.value = null
  accept.value = false
}
</script>
````

In order for the user to be able to activate the `@submit` or `@reset` events on the form, create a QBtn with `type` set to `submit` or `reset`:

```html
<div>
  <q-btn label="Submit" type="submit" color="primary" />
  <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
</div>
```

Alternatively, you can give the QForm a Vue ref name and call the `validate` and `resetValidation` functions directly:

```tabs
<<| js Composition API |>>
// <q-form ref="myFormRef">

setup () {
  const myFormRef = useTemplateRef('myFormRef')

  function validate () {
    myFormRef.value.validate().then(success => {
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
    myFormRef.value.resetValidation()
  }

  return {
    // ...
  }
}
<<| js Options API |>>
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
autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false"
```

## Submitting to a URL (native form submit)

If you are using the native `action` and `method` attributes on a QForm, please remember to use the `name` prop on each Quasar form component, so that the sent formData to actually contain what the user has filled in.

```html
<q-form action="https://some-url.com" method="post">
  <q-input name="firstname" ...>
  <!-- ... -->
</q-form>
```

- Control the way the form is submitted by setting `action`, `method`, `enctype` and `target` attributes of QForm
- If a listener on `@submit` IS NOT present on the QForm then the form will be submitted if the validation is successful
- If a listener on `@submit` IS present on the QForm then the listener will be called if the validation is successful. In order to do a native submit in this case:

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

```tabs
<<| js Composition API |>>
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
<<| js Options API |>>
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
