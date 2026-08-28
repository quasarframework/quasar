---
title: useDialogPluginComponent composable
desc: What is Quasar's useDialogPluginComponent() composable and how you can use it
keys: useDialogPluginComponent
related:
  - /quasar-plugins/dialog
---

::: tip
The useDialogPluginComponent composable is part of [Quasar Dialog Plugin](/quasar-plugins/dialog#invoking-custom-component) (Invoking custom component). If you haven't dug into it by now, please have a first read there.
:::

This composable is to be used on the custom components which a Dialog plugin is invoked with. It will bootstrap all the necessary communication of the component with the plugin.

Starting with Quasar v2.28, the composable also reports the dismissal reason: the `hide` event that it emits (and which the plugin forwards to the `onCancel`/`onDismiss` chained callbacks) carries `'cancel'` (closed through `onDialogCancel`), `'backdrop'` (a click/tap outside, including through QDialog's `auto-close`), `'escape'` (the ESC key) or `'programmatic'` (hidden through code, which includes an app route change).

## Syntax

```html
<script setup>
  import { useDialogPluginComponent } from 'quasar'

  const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
    useDialogPluginComponent()

  // dialogRef      - Vue ref to be applied to QDialog
  // onDialogHide   - Function to be used as handler for @hide on QDialog
  // onDialogOK     - Function to call to settle dialog with "ok" outcome
  //                    example: onDialogOK() - no payload
  //                    example: onDialogOK({ /*.../* }) - with payload
  // onDialogCancel - Function to call to settle dialog with "cancel" outcome
</script>
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

<script setup>
  import { useDialogPluginComponent } from 'quasar'

  const props = defineProps({
    // ...your custom props
  })

  defineEmits([
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits
  ])

  // REQUIRED; must be called inside of setup()
  const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
    useDialogPluginComponent()
  // dialogRef      - Vue ref to be applied to QDialog
  // onDialogHide   - Function to be used as handler for @hide on QDialog
  // onDialogOK     - Function to call to settle dialog with "ok" outcome
  //                    example: onDialogOK() - no payload
  //                    example: onDialogOK({ /*.../* }) - with payload
  // onDialogCancel - Function to call to settle dialog with "cancel" outcome

  // other methods that we used in our vue html template;
  // these are part of our example (so not required)
  function onOKClick() {
    // on OK, it is REQUIRED to
    // call onDialogOK (with optional payload)
    onDialogOK()
    // or with payload: onDialogOK({ ... })
    // ...and it will also hide the dialog automatically
  }

  // we can passthrough onDialogCancel directly
  function onCancelClick() {
    onDialogCancel()
  }
</script>
```
