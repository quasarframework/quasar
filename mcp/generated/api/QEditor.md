# QEditor API

Type: component

Canonical documentation: https://quasar.dev/vue-components/editor

## Props

### `fullscreen`

Type: `Boolean`

Fullscreen mode

Examples:

- `# v-model:fullscreen="isFullscreen"`

### `no-route-fullscreen-exit`

Type: `Boolean`

Changing route app won't exit fullscreen

### `model-value`

Type: `String`

Required: yes

Model of the component; Either use this property (along with a listener for 'update:modelValue' event) OR use v-model directive

Examples:

- `# v-model="content"`

### `readonly`

Type: `Boolean`

Put component in readonly mode

### `square`

Type: `Boolean`

Removes border-radius so borders are squared

### `flat`

Type: `Boolean`

Applies a 'flat' design (no borders)

### `dense`

Type: `Boolean`

Dense mode; toolbar buttons are shown on one-line only

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

### `disable`

Type: `Boolean`

Put component in disabled mode

### `min-height`

Type: `String`

Default: `'10rem'`

CSS unit for the minimum height of the editable area

Examples:

- `'15rem'`
- `'50vh'`

### `max-height`

Type: `String`

CSS unit for maximum height of the input area

Examples:

- `'1000px'`
- `'90vh'`

### `height`

Type: `String`

CSS value to set the height of the editable area

Examples:

- `'100px'`
- `'50vh'`

### `definitions`

Type: `Object`

Definition of commands and their buttons to be included in the 'toolbar' prop

Examples:

- `{ save: { tip: 'Save your work', icon: 'save', label: 'Save', handler: saveWork }, upload: { tip: 'Upload to cloud', icon: 'cloud_upload', label: 'Upload', handler: uploadIt } }`

### `fonts`

Type: `Object`

Object with definitions of fonts

Examples:

- `{ arial: 'Arial', arial_black: 'Arial Black', comic_sans: 'Comic Sans MS' }`

### `toolbar`

Type: `Array`

Default: `[['left', 'center', 'right', 'justify'], ['bold', 'italic', 'underline', 'strike'], ['undo', 'redo']]`

An array of arrays of Objects/Strings that you use to define the construction of the elements and commands available in the toolbar

Examples:

- `['left', 'center', 'right', 'justify']`

### `toolbar-color`

Type: `String`

Font color (from the Quasar Palette) of buttons and text in the toolbar

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `toolbar-text-color`

Type: `String`

Text color (from the Quasar Palette) of toolbar commands

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `toolbar-toggle-color`

Type: `String`

Default: `'primary'`

Choose the active color (from the Quasar Palette) of toolbar commands button

Examples:

- `'secondary'`
- `'blue-3'`

### `toolbar-bg`

Type: `String`

Default: `'grey-3'`

Toolbar background color (from Quasar Palette)

Examples:

- `'secondary'`
- `'blue-3'`

### `toolbar-outline`

Type: `Boolean`

Toolbar buttons are rendered "outlined"

### `toolbar-push`

Type: `Boolean`

Toolbar buttons are rendered as a "push-button" type

### `toolbar-rounded`

Type: `Boolean`

Toolbar buttons are rendered "rounded"

### `paragraph-tag`

Type: `String`

Default: `'div'`

Paragraph tag to be used

Accepted values: `'div'`, `'p'`

### `content-style`

Type: `Object`

Object with CSS properties and values for styling the container of QEditor

Examples:

- `{ backgroundColor: '#C0C0C0' }`

### `content-class`

Type: `String | Array | Object`

CSS classes for the input area

Examples:

- `'my-special-class'`
- `{ 'my-special-class': true }`

### `placeholder`

Type: `String`

Text to display as placeholder

Examples:

- `'Type your story here ...'`

## Slots

### `[command]`

Content for the given command in the toolbar

## Events

### `fullscreen`

Emitted when fullscreen state changes

### `update:fullscreen`

Used by Vue on 'v-model:fullscreen' prop for updating its value

### `update:model-value`

Emitted when the component needs to change the model; Is also used by v-model

### `dropdown-show`

Added in: v2.11.8

Emitted after a dropdown in the toolbar has triggered show()

### `dropdown-before-show`

Added in: v2.11.8

Emitted when a dropdown in the toolbar triggers show() but before it finishes doing it

### `dropdown-hide`

Added in: v2.11.8

Emitted after a dropdown in the toolbar has triggered hide()

### `dropdown-before-hide`

Added in: v2.11.8

Emitted when a dropdown in the toolbar triggers hide() but before it finishes doing it

### `link-show`

Added in: v2.11.9

Emitted when the toolbar for editing a link is shown

### `link-hide`

Added in: v2.11.9

Emitted when the toolbar for editing a link is hidden

## Methods

### `toggleFullscreen`

Toggle the view to be fullscreen or not fullscreen

### `setFullscreen`

Enter the fullscreen view

### `exitFullscreen`

Leave the fullscreen view

### `runCmd`

Run contentEditable command at caret position and range

### `refreshToolbar`

Hide the link editor if visible and force the instance to re-render

### `focus`

Focus on the contentEditable at saved cursor position

### `getContentEl`

Retrieve the content of the Editor

## Computed properties

### `caret`

Type: `Object`

The current caret state
