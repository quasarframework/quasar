---
title: Form
desc: The QForm Vue component renders a form and allows easy validation of child form components like QInput, QSelect or QField.
related:
  - /vue-components/input
  - /vue-components/select
  - /vue-components/field
---

The QForm component renders a `<form>` DOM element and allows you to easily validate child form components (like [QInput](/vue-components/input#Internal-validation), [QSelect](/vue-components/select) or your [QField](/vue-components/field) wrapped components) that have the **internal validation** (NOT the external one) through `rules` associated with them.

## Installation
<doc-installation components="QForm" />

## Usage

::: warning
Please be aware of the following:
* QForm hooks into QInput, QSelect or QField wrapped components
* QInput, QSelect or QField wrapped components must use the internal validation (NOT the external one).
* If you want to take advantage of the `reset` functionality, then be sure to also capture the `@reset` event on QForm and make its handler reset all of the wrapped components models.
:::

<doc-example title="Basic" file="QForm/Basic" />

In order for the user to be able to activate the `@submit` or `@reset` events on the form, create a QBtn with `type` set to `submit` or `reset`:

```html
<div>
  <q-btn label="Submit" type="submit" color="primary"/>
  <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
</div>
```

Alternatively, you can give the QForm a Vue ref name and call the `validate` and `resetValidation` functions directly:

```
<q-form ref="myForm">

// and then in code:

this.$refs.myForm.validate().then(success => {
  if (success) {
    // yay, models are correct
  }
  else {
    // oh no, user has filled in
    // at least an invalid value
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

## QForm API
<doc-api file="QForm" />


