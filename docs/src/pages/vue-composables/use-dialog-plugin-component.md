---
title: useDialogPluginComponent composable
desc: What is Quasar's useDialogPluginComponent() composable and how you can use it
related:
  - /quasar-plugins/dialog
---

::: tip
The useDialogPluginComponent composable is part of [Quasar Dialog Plugin](/quasar-plugins/dialog#Invoking-custom-component) (Invoking custom component). If you haven't digged into it by now, please have a first read there.
:::

This composable is to be used on the custom components which a Dialog plugin is invoked with. It will bootstrap all the necessary communication of the component with the plugin.

## Syntax

```js
import { useDialogPluginComponent } from 'quasar'

setup (props, { emit }) {
  const { dialogRef, onDialogHide, show, hide } = useDialogPluginComponent({ emit })

  // "dialogRef" needs to be set as the QDialog reference
  // "onDialogHide" needs to be set as "@hide" event handler of the QDialog
  // "show()" and "hide()" are methods that can be called to show or hide the dialog

  return {
    dialogRef,
    onDialogHide
  }
}
```

## Full example

```html
<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <!--
        ...content
        ... use q-card-section for it?
      -->

      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
        <q-btn color="primary" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from 'quasar'

export default {
  props: {
    // ...your custom props
  },

  setup (props, { emit }) {
    // REQUIRED; must be called inside of setup()
    const { dialogRef, onDialogHide, hide } = useDialogPluginComponent({ emit })

    function onOKClick () {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      emit('ok')
      // or with payload: emit('ok', { ... })

      // then hiding dialog
      hide()
    }

    function onCancelClick () {
      // we just need to hide the dialog
      hide()
    }

    return {
      // This is REQUIRED;
      // Need to inject these (from useCustomDialog() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick,
      onCancelClick
    }
  }
}
</script>
```
