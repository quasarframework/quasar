---
title: Dialog Plugin
desc: A Quasar plugin that provides an easy way to display a prompt, choice, confirmation or alert in the form of a dialog.
keys: Dialog
examples: Dialog
related:
  - /vue-components/dialog
  - /quasar-plugins/bottom-sheet
  - /vue-composables/use-dialog-plugin-component
---

Quasar Dialogs are a great way to offer the user the ability to choose a specific action or list of actions. They also can provide the user with important information, or require them to make a decision (or multiple decisions).

From a UI perspective, you can think of Dialogs as a type of floating modal, which covers only a portion of the screen. This means Dialogs should only be used for quick user actions.

::: tip
Dialogs can also be used as a component in your Vue file templates (for complex use-cases, like specific form components, selectable options, etc.). For this, go to [QDialog](/vue-components/dialog) page.
:::

The advantage of using Dialogs as Quasar Plugins as opposed to QDialog component is that the plugin can also be called from outside of Vue space and doesn't require you to manage their templates. But as a result, their customization cannot be compared to their component counterpart.

However, **you can also supply a component for the Dialog Plugin to render** (see the "Invoking custom component" section) which is a great way to avoid cluttering your Vue templates with inline dialogs (and it will also help you better organize your project files and also reuse dialogs).

With the QDialog plugin, you can programmatically build three types of dialogs with the following form content:
 1. A prompt dialog - asking the user to fill in some sort of data in an input field.
 2. A set of options for the user to select from using either radio buttons or toggles (singular selection only) or check boxes (for multiple selections).
 3. A simple confirmation dialog, where the user can cancel or give her "ok" for a particular action or input.

In order to create #1, the prompting input form, you have the `prompt` property within the `opts` object.

In order to create #2, the options selection form, you have the `options` property within the `opts` object.

<doc-api file="Dialog" />

<doc-installation plugins="Dialog" />

## Built-in component

```js
// outside of a Vue file
import { Dialog } from 'quasar'
(Object) Dialog.create({ ... })

// inside of a Vue file
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()
  $q.dialog({ ... }) // returns Object
}
```

Please check the API card to see what the returned Object is.

### Usage

::: tip
For all the examples below, also see the browser console while you check them out.
:::

::: warning
This is not an exhaustive list of what you can do with Dialogs as Quasar Plugins. For further exploration check out the API section.
:::

<doc-example title="Basic" file="Basic" />

<doc-example title="Force dark mode" file="Dark" />

<doc-example title="Radios, Checkboxes, Toggles" file="Pickers" />

<doc-example title="Other options" file="OtherOptions" />

### Native attributes

You can also supply native HTML attributes to the inner QInput or QOptionGroup components, like in the example below.

<doc-example title="Using native attributes" file="NativeAttributes" />

### User input validation

There is a basic validation system that you can use so that the user won't be able to submit the dialog (click/tap on "OK" or press <kbd>ENTER</kbd>) until the expected values are filled in.

<doc-example title="Prompt with validation" file="ValidationPrompt" />

<doc-example title="Options with validation" file="ValidationOptions" />

### Progress

<doc-example title="Showing progress" file="Progress" />

### Using HTML
You can use HTML on title and message if you specify the `html: true` prop. **Please note that this can lead to XSS attacks**, so make sure that you sanitize the message by yourself.

<doc-example title="Unsafe HTML message" file="UnsafeHtml" />

## Invoking custom component

You can also invoke your own custom component rather than relying on the default one that the Dialog plugin comes with out of the box. But in this case you will be responsible for handling everything (including your own component props).

This feature is actually the "bread and butter" of the Dialog plugin. It helps you keep your other vue components html templates clean by separating and reusing your dialog's functionality with ease.

```js
import { useQuasar } from 'quasar'
import CustomComponent from '..path.to.component..'

setup () {
  const $q = useQuasar()

  $q.dialog({
    component: CustomComponent,

    // props forwarded to your custom component
    componentProps: {
      text: 'something',
      // ...more..props...
    }
  }).onOk(() => {
    console.log('OK')
  }).onCancel(() => {
    console.log('Cancel')
  }).onDismiss(() => {
    console.log('Called on OK or Cancel')
  })
}
```

The equivalent of the above with Options API is by directly using `this.$q.dialog({ ... })`.

::: warning
Your custom component however must follow the interface described below in order to perfectly hook into the Dialog plugin. **Notice the "REQUIRED" comments** and take it as is -- just a bare-bone example, nothing more.
:::

#### SFC with script setup (and Composition API) variant
We will be using the [useDialogPluginComponent](/vue-composables/use-dialog-plugin-component) composable.

```html
<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <!--
        ...content
        ... use q-card-section for it?
      -->

      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
        <q-btn color="primary" label="Cancel" @click="onDialogCancel" />
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

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

// this is part of our example (so not required)
function onOKClick () {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK()
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}
</script>
```

If you want to define `emits` in Object form, then (requires Quasar v2.2.5+):

```
defineEmits({
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emitsObject,

  // ...your own definitions
})
```

#### Composition API variant

We will be using the [useDialogPluginComponent](/vue-composables/use-dialog-plugin-component) composable.

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

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits
  ],

  setup () {
    // REQUIRED; must be called inside of setup()
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
    // dialogRef      - Vue ref to be applied to QDialog
    // onDialogHide   - Function to be used as handler for @hide on QDialog
    // onDialogOK     - Function to call to settle dialog with "ok" outcome
    //                    example: onDialogOK() - no payload
    //                    example: onDialogOK({ /*.../* }) - with payload
    // onDialogCancel - Function to call to settle dialog with "cancel" outcome

    return {
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick () {
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        onDialogOK()
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel
    }
  }
}
</script>
```

If you want to define `emits` in Object form, then (requires Quasar v2.2.5+):

```
emits: {
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emitsObject,

  // ...your own definitions
}
```

#### Options API variant

```html
<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
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
export default {
  props: {
    // ...your custom props
  },

  emits: [
    // REQUIRED
    'ok', 'hide'
  ],

  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    show () {
      this.$refs.dialog.show()
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
    },

    onOKClick () {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit('ok')
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide()
    },

    onCancelClick () {
      // we just need to hide the dialog
      this.hide()
    }
  }
}
</script>
```
## Cordova/Capacitor back button
Quasar handles the back button for you by default so it can hide any opened Dialogs instead of the default behavior which is to return to the previous page (which is not a nice user experience).

However, should you wish to disable this behavior, edit your /quasar.config.js file:

```js
// quasar.config.js;
// for Cordova (only!):
return {
  framework: {
    config: {
      cordova: {
        // Quasar handles app exit on mobile phone back button.
        backButtonExit: true/false/'*'/['/login', '/home', '/my-page'],

        // On the other hand, the following completely
        // disables Quasar's back button management.
        backButton: true/false
      }
    }
  }
}

// quasar.config.js;
// for Capacitor (only!)
return {
  framework: {
    config: {
      capacitor: {
        // Quasar handles app exit on mobile phone back button.
        backButtonExit: true/false/'*'/['/login', '/home', '/my-page'],

        // On the other hand, the following completely
        // disables Quasar's back button management.
        backButton: true/false
      }
    }
  }
}
```
