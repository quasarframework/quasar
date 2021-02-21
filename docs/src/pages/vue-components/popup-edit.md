---
title: Popup Edit
desc: The QPopupEdit Vue component can be used to edit a value 'in place', like for example on a cell in QTable.
keys: QPopupEdit
related:
  - /vue-components/input
  - /vue-components/menu
---

The QPopupEdit component can be used to edit a value “in place”, like for example a cell in QTable. By default, a cell is displayed as a String, then if you are using QPopupEdit and a user clicks/taps on the table cell, a popup will open where the user will be able to edit the value using a textfield.

This component injects a [QMenu](/vue-components/menu) into its parent DOM element and enables the behavior described above, so **it can be used anywhere**, not only in QTable.

## QPopupEdit API

<doc-api file="QPopupEdit" />

## Usage

::: warning
If used on a QTable, QPopupEdit won't work with cell scoped slots.
:::

### Standalone

<doc-example title="Click on text" file="QPopupEdit/Standalone" />

### With QTable
Click on the cells to see the popup editor. The column "Name" demonstrates the `title` prop. The column "Calories" displays a numeric value usage. The column "Fat" also demonstrates the `disable` prop. If you look at the source code, you'll see the cell for "fat" is using QPopupEdit, yet when clicking on the cell, the popup doesn't show.

<doc-example title="Edit first columns" file="QPopupEdit/WithTable" />

### Customizing

<doc-example title="Customizing QPopupEdit" file="QPopupEdit/Customizing" />

### Persistent and with buttons
You can also add two buttons with the `buttons` prop, "Cancel" and "Set" (the default labels). These buttons help to control the user's input. Along with the `buttons` prop, you also have the `persistent` prop, which denies the user from closing the popup with the escape key or clicking/ tapping outside of the popup. The `persistent` prop is demonstrated in the "carbs" column. Lastly, you can control the labels of the two buttons with the `label-set` and `label-cancel` props, as seen in the "Protein" column. Notice "Save" is replacing "Set" and "Close" is replacing "Cancel".

<doc-example title="Persistent edit, and with buttons" file="QPopupEdit/WithButtons" />

### The default slot
The default slot's parameters are:

```js
{ initialValue, value, emitValue, validate, set, cancel, updatePosition }
```

::: warning
Do not destructure the slot's parameters as it will generate linting errors when using the `value` prop directly with `v-model`.
:::

<doc-example title="Default slot parameters" file="QPopupEdit/DefaultSlotParameters" />

### Textarea / QEditor
Since QPopupEdit wraps QInput, you can basically use any type of QInput. For instance, you can also use a text area as shown below in the "Comments" column.

::: tip
When using a multi-line control (textarea, QEditor) for input, you'll need to also use `@keyup.enter.stop` on the component in order to stop the enter key from closing the popup. You'll also need to add buttons for controlling the popup too.
:::

<doc-example title="QInput textarea" file="QPopupEdit/TextArea" />

<doc-example title="QEditor" file="QPopupEdit/PopupWithEditor" />

### Validation
QPopupEdit also allows for simple validation of the input. To use it, you give it a callback function in the form of an arrow function and it should return a Boolean. `(value) => Boolean`. This is **demonstrated in the "Calories" column** below.

::: tip Tip 1
Notice we are using the `hide` event to also revalidate the input. If we don't, QInput's error prop will 'hang' in an invalid state.
:::

::: tip Tip 2
With this example, we are using QInput's external error handling. We could also use QInput's validation prop and emit the value to QPopupEdit's validation prop. The same concept can be implemented, when using Vuelidate too. In other words, the value given to QPopupEdit's validate function can come from anywhere.
:::

<doc-example title="Edit with validation" file="QPopupEdit/WithValidation" />
