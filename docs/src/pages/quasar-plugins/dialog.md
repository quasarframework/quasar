---
title: Dialog Plugin
desc: A Quasar plugin that provides an easy way to display a prompt, choice, confirmation or alert in the form of a dialog.
related:
  - /vue-components/dialog
  - /quasar-plugins/bottom-sheet
---

Quasar Dialogs are a great way to offer the user the ability to choose a specific action or list of actions. They also can provide the user with important information, or require them to make a decision (or multiple decisions).

From a UI perspective, you can think of Dialogs as a type of floating modal, which covers only a portion of the screen. This means Dialogs should only be used for quick user actions only.

::: tip
Dialogs can also be used as a component in your Vue file templates (for complex use-cases, like specific form components with validation, selectable options, etc.). For this, go to [QDialog](/vue-components/dialog) page.
:::

The advantage of using Dialogs as Quasar Plugins as opposed to Components is that the plugin can also be called from outside of Vue space and doesn't require you to manage their templates. But as a result, their customization cannot be compared to their component counterpart.

With the QDialog plugin, you can programmatically build three types of dialogs with the following form content:
 1. A prompt dialog - asking the user to fill in some sort of data in an input field.
 2. A set of options for the user to select from using either radio buttons or toggles (singular selection only) or check boxes (for multiple selections).
 3. A simple confirmation dialog, where the user can cancel or give her "ok" for a particular action or input.

In order to create #1, the prompting input form, you have the `prompt` property within the `opts` object.

In order to create #2, the options selection form, you have the `options` property within the `opts` object.

## Installation
<doc-installation plugins="Dialog" />

## Usage

```js
// outside of a Vue file
import { Dialog } from 'quasar'
(Object) Dialog.create({ ... })

// inside of a Vue file
(Object) this.$q.dialog({ ... })
```

### Predefined

::: tip
For all the examples below, also see the browser console while you check them out.
:::

::: warning
This is not an exhaustive list of what you can do with Dialogs as Quasar Plugins. For further exploration check out the API section.
:::

<doc-example title="Basic" file="Dialog/Basic" />

<doc-example title="Dark mode" file="Dialog/Dark" />

<doc-example title="Radios, Checkboxes, Toggles" file="Dialog/Pickers" />

<doc-example title="Other options" file="Dialog/OtherOptions" />

### Using HTML
You can use HTML on title and message if you specify the `html: true` prop. **Please note that this can lead to XSS attacks**, so make sure that you sanitize the message by yourself.

<doc-example title="Unsafe HTML message" file="Dialog/UnsafeHtml" />

### Invoking custom component

You can also invoke your own custom component rather than relying on the default one that the Dialog plugin comes with out of the box. But in this case you will be responsible for handling everything (including your own component props).

```js
import CustomComponent from '..path.to.component..'

// ...

this.$q.dialog({
  component: CustomComponent,

  // optional if you want to have access to
  // Router, Vuex store, and so on, in your
  // custom component:
  parent: this, // becomes child of this Vue node
                // ("this" points to your Vue component)
                // (prop was called "root" in < 1.1.0 and
                // still works, but recommending to switch
                // to the more appropriate "parent" name)

  // props forwarded to component
  // (everything except "component" and "parent" props above):
  text: 'something',
  // ...more.props...
}).onOk(() => {
  console.log('OK')
}).onCancel(() => {
  console.log('Cancel')
}).onDismiss(() => {
  console.log('Called on OK or Cancel')
})
```

::: warning
Your custom component however must follow the interface described below in order to perfectly hook into the Dialog plugin. **Notice the "REQUIRED" comments** and take it as is -- just a bare-bone example, nothing more.
:::

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
      // we just need to hide dialog
      this.hide()
    }
  }
}
</script>
```

## Dialog API
<doc-api file="Dialog" />
