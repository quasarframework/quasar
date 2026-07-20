---
title: Dialog Plugin
description: A Quasar plugin that provides an easy way to display a prompt, choice, confirmation or alert in the form of a dialog.
canonical: https://quasar.dev/quasar-plugins/dialog
kinds: plugin
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [Dialog](../../api/Dialog.md)

Quasar Dialogs are a great way to offer the user the ability to choose a specific action or list of actions. They also can provide the user with important information, or require them to make a decision (or multiple decisions).

From a UI perspective, you can think of Dialogs as a type of floating modal, which covers only a portion of the screen. This means Dialogs should only be used for quick user actions.

::: tip
Dialogs can also be used as a component in your Vue file templates (for complex use-cases, like specific form components, selectable options, etc.). For this, go to [QDialog](/vue-components/dialog) page.
:::

The advantage of using Dialogs as Quasar Plugins as opposed to QDialog component is that the plugin can also be called from outside of Vue space and doesn't require you to manage their templates. But as a result, their customization cannot be compared to their component counterpart.

However, **you can also supply a component for the Dialog Plugin to render** (see the "Invoking custom component" section) which is a great way to avoid cluttering your Vue templates with inline dialogs (and it will also help you better organize your project files and also reuse dialogs).

With the QDialog plugin, you can programmatically build three types of dialogs with the following form content:

1.  A prompt dialog - asking the user to fill in some sort of data in an input field.
2.  A set of options for the user to select from using either radio buttons or toggles (singular selection only) or check boxes (for multiple selections).
3.  A simple confirmation dialog, where the user can cancel or give their "ok" for a particular action or input.

In order to create #1, the prompting input form, you have the `prompt` property within the `opts` object.

In order to create #2, the options selection form, you have the `options` property within the `opts` object.

**API reference:** [Dialog](../../api/Dialog.md)

**Configuration:** register Dialog through `framework.plugins` in `quasar.config`.

## Built-in component

```js Outside of a Vue file
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

**Example: Basic**

Source: [Basic.vue](../../examples/Dialog/Basic.vue)

```vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Alert" color="primary" @click="alert" />
    <q-btn label="Confirm" color="primary" @click="confirm" />
    <q-btn label="Prompt" color="primary" @click="prompt" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function alert() {
  $q.dialog({
    title: 'Alert',
    message: 'Some message'
  })
    .onOk(() => {
      console.log('OK')
    })
    .onCancel(() => {
      console.log('Cancel')
    })
    .onDismiss(() => {
      console.log('I am triggered on both OK and Cancel')
    })
}

function confirm() {
  $q.dialog({
    title: 'Confirm',
    message: 'Would you like to turn on the wifi?',
    cancel: true,
    persistent: true
  })
    .onOk(() => {
      console.log('>>>> OK')
    })
    .onOk(() => {
      console.log('>>>> second OK catcher')
    })
    .onCancel(() => {
      console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      console.log('I am triggered on both OK and Cancel')
    })
}

function prompt() {
  $q.dialog({
    title: 'Prompt',
    message: 'What is your name?',
    prompt: {
      model: '',
      type: 'text' // optional
    },
    cancel: true,
    persistent: true
  })
    .onOk(data => {
      console.log('>>>> OK, received', data)
    })
    .onCancel(() => {
      console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      console.log('I am triggered on both OK and Cancel')
    })
}
</script>
```

**Example: Force dark mode**

Source: [Dark.vue](../../examples/Dialog/Dark.vue)

```vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Alert" color="primary" @click="alert" />
    <q-btn label="Confirm" color="primary" @click="confirm" />
    <q-btn label="Prompt" color="primary" @click="prompt" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function alert() {
  $q.dialog({
    dark: true,
    title: 'Alert',
    message: 'Some message'
  })
    .onOk(() => {
      console.log('OK')
    })
    .onCancel(() => {
      console.log('Cancel')
    })
    .onDismiss(() => {
      console.log('I am triggered on both OK and Cancel')
    })
}

function confirm() {
  $q.dialog({
    dark: true,
    title: 'Confirm',
    message: 'Would you like to turn on the wifi?',
    cancel: true,
    persistent: true
  })
    .onOk(() => {
      console.log('>>>> OK')
    })
    .onOk(() => {
      console.log('>>>> second OK catcher')
    })
    .onCancel(() => {
      console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      console.log('I am triggered on both OK and Cancel')
    })
}

function prompt() {
  $q.dialog({
    dark: true,
    title: 'Prompt',
    message: 'What is your name?',
    prompt: {
      model: '',
      type: 'text' // optional
    },
    cancel: true,
    persistent: true
  })
    .onOk(data => {
      console.log('>>>> OK, received', data)
    })
    .onCancel(() => {
      console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      console.log('I am triggered on both OK and Cancel')
    })
}
</script>
```

**Example: Radios, Checkboxes, Toggles**

Source: [Pickers.vue](../../examples/Dialog/Pickers.vue)

```vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Radio Options" color="primary" @click="radio" />
    <q-btn label="Checkbox Options" color="primary" @click="checkbox" />
    <q-btn label="Toggle Options" color="primary" @click="toggle" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function radio() {
  $q.dialog({
    title: 'Options',
    message: 'Choose an option:',
    options: {
      type: 'radio',
      model: 'opt1',
      // inline: true
      items: [
        { label: 'Option 1', value: 'opt1', color: 'secondary' },
        { label: 'Option 2', value: 'opt2' },
        { label: 'Option 3', value: 'opt3' }
      ]
    },
    cancel: true,
    persistent: true
  })
    .onOk(data => {
      console.log('>>>> OK, received', data)
    })
    .onCancel(() => {
      console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      console.log('I am triggered on both OK and Cancel')
    })
}

function checkbox() {
  $q.dialog({
    title: 'Options',
    message: 'Choose your options:',
    options: {
      type: 'checkbox',
      model: [],
      // inline: true
      items: [
        { label: 'Option 1', value: 'opt1', color: 'secondary' },
        { label: 'Option 2', value: 'opt2' },
        { label: 'Option 3', value: 'opt3' }
      ]
    },
    cancel: true,
    persistent: true
  })
    .onOk(data => {
      console.log('>>>> OK, received', data)
    })
    .onCancel(() => {
      console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      console.log('I am triggered on both OK and Cancel')
    })
}

function toggle() {
  $q.dialog({
    title: 'Options',
    message: 'Choose your options:',
    options: {
      type: 'toggle',
      model: [],
      // inline: true,
      items: [
        { label: 'Option 1', value: 'opt1', color: 'secondary' },
        { label: 'Option 2', value: 'opt2' },
        { label: 'Option 3', value: 'opt3' }
      ]
    },
    cancel: true,
    persistent: true
  })
    .onOk(data => {
      console.log('>>>> OK, received', data)
    })
    .onCancel(() => {
      console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      console.log('I am triggered on both OK and Cancel')
    })
}
</script>
```

**Example: Other options**

Source: [OtherOptions.vue](../../examples/Dialog/OtherOptions.vue)

```vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Custom Buttons" color="primary" @click="customBtn" />
    <q-btn label="Positioned" color="primary" @click="positioned" />
    <q-btn label="Stacked Buttons" color="primary" @click="stacked" />
    <q-btn label="Auto Closing" color="primary" @click="autoClose" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function customBtn() {
  $q.dialog({
    title: 'Confirm',
    message: 'Would you like to turn on the wifi?',
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  })
    .onOk(() => {
      console.log('>>>> OK')
    })
    .onCancel(() => {
      console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      console.log('I am triggered on both OK and Cancel')
    })
}

function positioned() {
  $q.dialog({
    title: 'Positioned',
    message: 'This dialog appears from bottom.',
    position: 'bottom'
  })
}

function stacked() {
  $q.dialog({
    title: 'Stacked Buttons',
    stackButtons: true,
    cancel: true
  })
}

function autoClose() {
  let seconds = 3

  const dialog = $q
    .dialog({
      title: 'Alert',
      message: `Autoclosing in ${seconds} seconds.`
    })
    .onOk(() => {
      console.log('OK')
    })
    .onCancel(() => {
      console.log('Cancel')
    })
    .onDismiss(() => {
      clearTimeout(timer)
      console.log('I am triggered on both OK and Cancel')
    })

  const timer = setInterval(() => {
    seconds--

    if (seconds > 0) {
      dialog.update({
        message: `Autoclosing in ${seconds} second${seconds > 1 ? 's' : ''}.`
      })
    } else {
      clearInterval(timer)
      dialog.hide()
    }
  }, 1000)
}
</script>
```

### Native attributes

You can also supply native HTML attributes to the inner QInput or QOptionGroup components, like in the example below.

**Example: Using native attributes**

Source: [NativeAttributes.vue](../../examples/Dialog/NativeAttributes.vue)

```vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Prompt (1-10, step 2)" color="primary" @click="prompt" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function prompt() {
  $q.dialog({
    title: 'Prompt with native attributes',
    message: 'Please type a value between 0 and 10:',
    prompt: {
      model: 2,
      type: 'number',

      // native attributes:
      min: 0,
      max: 10,
      step: 2
    },
    cancel: true,
    persistent: true
  })
    .onOk(data => {
      console.log('>>>> OK, received', data)
    })
    .onCancel(() => {
      console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      console.log('I am triggered on both OK and Cancel')
    })
}
</script>
```

### User input validation

There is a basic validation system that you can use so that the user won't be able to submit the dialog (click/tap on "OK" or press <kbd>ENTER</kbd>) until the expected values are filled in.

**Example: Prompt with validation**

Source: [ValidationPrompt.vue](../../examples/Dialog/ValidationPrompt.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-btn label="Prompt" color="primary" @click="prompt" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function prompt() {
  $q.dialog({
    title: 'Prompt',
    message: 'What is your name? (Minimum 3 characters)',
    prompt: {
      model: '',
      isValid: val => val.length > 2, // << here is the magic
      type: 'text' // optional
    },
    cancel: true,
    persistent: true
  }).onOk(data => {
    console.log('>>>> OK, received', data)
  })
}
</script>
```

**Example: Options with validation**

Source: [ValidationOptions.vue](../../examples/Dialog/ValidationOptions.vue)

```vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Radio Options" color="primary" @click="radio" />
    <q-btn label="Checkbox Options" color="primary" @click="checkbox" />
    <q-btn label="Toggle Options" color="primary" @click="toggle" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function radio() {
  $q.dialog({
    title: 'Options',
    message: "Choose your option, but make sure it's the second one :)",
    options: {
      type: 'radio',
      model: 'opt1',
      isValid: val => val === 'opt2',
      // inline: true
      items: [
        { label: 'Option 1', value: 'opt1', color: 'secondary' },
        { label: 'Option 2', value: 'opt2' },
        { label: 'Option 3', value: 'opt3' }
      ]
    },
    cancel: true,
    persistent: true
  }).onOk(data => {
    console.log('>>>> OK, received', data)
  })
}

function checkbox() {
  $q.dialog({
    title: 'Options',
    message: 'Choose your options, but make sure you also pick the second one.',
    options: {
      type: 'checkbox',
      model: [],
      isValid: model => model.includes('opt2'),
      // inline: true
      items: [
        { label: 'Option 1', value: 'opt1', color: 'secondary' },
        { label: 'Option 2', value: 'opt2' },
        { label: 'Option 3', value: 'opt3' }
      ]
    },
    cancel: true,
    persistent: true
  }).onOk(data => {
    console.log('>>>> OK, received', data)
  })
}

function toggle() {
  $q.dialog({
    title: 'Options',
    message: 'Choose your options, but make sure you also pick the first two.',
    options: {
      type: 'toggle',
      model: [],
      isValid: model => model.includes('opt1') && model.includes('opt2'),
      // inline: true,
      items: [
        { label: 'Option 1', value: 'opt1', color: 'secondary' },
        { label: 'Option 2', value: 'opt2' },
        { label: 'Option 3', value: 'opt3' }
      ]
    },
    cancel: true,
    persistent: true
  }).onOk(data => {
    console.log('>>>> OK, received', data)
  })
}
</script>
```

### Progress

**Example: Showing progress**

Source: [Progress.vue](../../examples/Dialog/Progress.vue)

```vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Default progress" color="primary" @click="showDefault" />
    <q-btn label="Custom progress" color="primary" @click="showCustom" />
  </div>
</template>

<script setup>
import { QSpinnerGears, useQuasar } from 'quasar'

const $q = useQuasar()

function showDefault() {
  const dialog = $q.dialog({
    message: 'Uploading... 0%',
    progress: true, // we enable default settings
    persistent: true, // we want the user to not be able to close it
    ok: false // we want the user to not be able to close it
  })

  // we simulate some progress here...
  let percentage = 0
  const interval = setInterval(() => {
    percentage = Math.min(100, percentage + Math.floor(Math.random() * 22))

    // we update the dialog
    dialog.update({
      message: `Uploading... ${percentage}%`
    })

    // if we are done, we're gonna close it
    if (percentage === 100) {
      clearInterval(interval)
      setTimeout(() => {
        dialog.hide()
      }, 350)
    }
  }, 500)
}

function showCustom() {
  const dialog = $q.dialog({
    title: 'Uploading...',
    dark: true,
    message: '0%',
    progress: {
      spinner: QSpinnerGears,
      color: 'amber'
    },
    persistent: true, // we want the user to not be able to close it
    ok: false // we want the user to not be able to close it
  })

  // we simulate some progress here...
  let percentage = 0
  const interval = setInterval(() => {
    percentage = Math.min(100, percentage + Math.floor(Math.random() * 22))

    // we update the dialog
    dialog.update({
      message: `${percentage}%`
    })

    // if we are done...
    if (percentage === 100) {
      clearInterval(interval)

      dialog.update({
        title: 'Done!',
        message: 'Upload completed successfully',
        progress: false,
        ok: true
      })
    }
  }, 500)
}
</script>
```

### Using HTML

You can use HTML on title and message if you specify the `html: true` prop. **Please note that this can lead to XSS attacks**, so make sure that you sanitize the message by yourself.

**Example: Unsafe HTML message**

Source: [UnsafeHtml.vue](../../examples/Dialog/UnsafeHtml.vue)

```vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Show HTML Dialog" color="primary" @click="showDialog" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function showDialog() {
  $q.dialog({
    title: 'Alert<em>!</em>',
    message:
      '<em>I can</em> <span class="text-red">use</span> <strong>HTML</strong>',
    html: true
  })
    .onOk(() => {
      console.log('OK')
    })
    .onCancel(() => {
      console.log('Cancel')
    })
    .onDismiss(() => {
      console.log('I am triggered on both OK and Cancel')
    })
}
</script>
```

## Invoking custom component

You can also invoke your own custom component rather than relying on the default one that the Dialog plugin comes with out of the box. But in this case you will be responsible for handling everything (including your own component props).

This feature is actually the "bread and butter" of the Dialog plugin. It helps you keep your other vue components html templates clean by separating and reusing your dialog's functionality with ease.

### Triggering the custom component

```tabs
<<| js By importing Dialog |>>
/**
 * This way of using it can reside outside
 * of a Vue component as well
 */

import { Dialog } from 'quasar'
import CustomComponent from '..path.to.component..'

Dialog.create({
  component: CustomComponent,

  // props forwarded to your custom component
  componentProps: {
    text: 'something',
    persistent: true,
    // ...more..props...
  }
}).onOk(() => {
  console.log('OK')
}).onCancel(() => {
  console.log('Cancel')
}).onDismiss(() => {
  console.log('Called on OK or Cancel')
})
<<| js With useQuasar() |>>
/**
 * This way of using it can reside ONLY
 * inside of a Vue component
 */

import { useQuasar } from 'quasar'
import CustomComponent from '..path.to.component..'

setup () {
  const $q = useQuasar()

  $q.dialog({
    component: CustomComponent,

    // props forwarded to your custom component
    componentProps: {
      text: 'something',
      persistent: true,
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

### Writing the custom component

#### SFC with "script setup" and Composition API variant

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

  const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
    useDialogPluginComponent()
  // dialogRef      - Vue ref to be applied to QDialog
  // onDialogHide   - Function to be used as handler for @hide on QDialog
  // onDialogOK     - Function to call to settle dialog with "ok" outcome
  //                    example: onDialogOK() - no payload
  //                    example: onDialogOK({ /*...*/ }) - with payload
  // onDialogCancel - Function to call to settle dialog with "cancel" outcome

  // this is part of our example (so not required)
  function onOKClick() {
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

#### SFC with "script" and Composition API variant

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

    setup() {
      // REQUIRED; must be called inside of setup()
      const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
        useDialogPluginComponent()
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
        onOKClick() {
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

#### SFC with "script" and Options API variant

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
      'ok',
      'hide'
    ],

    methods: {
      // following method is REQUIRED
      // (don't change its name --> "show")
      show() {
        this.$refs.dialog.show()
      },

      // following method is REQUIRED
      // (don't change its name --> "hide")
      hide() {
        this.$refs.dialog.hide()
      },

      onDialogHide() {
        // required to be emitted
        // when QDialog emits "hide" event
        this.$emit('hide')
      },

      onOKClick() {
        // on OK, it is REQUIRED to
        // emit "ok" event (with optional payload)
        // before hiding the QDialog
        this.$emit('ok')
        // or with payload: this.$emit('ok', { ... })

        // then hiding dialog
        this.hide()
      },

      onCancelClick() {
        // we just need to hide the dialog
        this.hide()
      }
    }
  }
</script>
```

## Cordova/Capacitor back button

Quasar handles the back button for you by default so it can hide any opened Dialogs instead of the default behavior which is to return to the previous page (which is not a nice user experience).

However, should you wish to disable this behavior, edit your `/quasar.config` file:

```tabs
<<| js For Capacitor |>>
// quasar.config file
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
<<| js For Cordova |>>
// quasar.config file
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
```
