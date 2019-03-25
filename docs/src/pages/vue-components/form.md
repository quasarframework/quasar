---
title: Form
related:
  - /vue-components/input
  - /vue-components/select
---

The QForm component allows you to easily validate child form components that have rules associated with them. To have this done automatically, create a button with type **submit**. Do the same if you wish to tie into **reset**.

```html
  <div>
    <q-btn label="Submit" type="submit" color="primary"/>
    <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
  </div>
```

Alternatvely, you can give the QForm a ref name and call the `validate` and `resetValidation` functions directly.

```
    <q-form ref="myForm" class="q-gutter-md">

    // and then in code:

    if (this.$refs.myForm.validate()) {
      // do something
    }
```

## Installation
<doc-installation components="QForm" />

## Usage

<doc-example title="Basic" file="QForm/Basic" />

## QForm API
<doc-api file="QForm" />


