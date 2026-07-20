# QFile API

Type: component

Canonical documentation: https://quasar.dev/vue-components/file

## Props

### `name`

Type: `String`

Used to specify the name of the control; Useful if dealing with forms; If not specified, it takes the value of 'for' prop, if it exists

Examples:

- `'car_id'`

### `multiple`

Type: `Boolean`

Allow multiple file uploads

### `accept`

Type: `String`

Comma separated list of unique file type specifiers. Maps to 'accept' attribute of native input type=file element

Examples:

- `'.jpg, .pdf, image/*'`
- `'image/jpeg, .pdf'`

### `capture`

Type: `String`

Optionally, specify that a new file should be captured, and which device should be used to capture that new media of a type defined by the 'accept' prop. Maps to 'capture' attribute of native input type=file element

Accepted values: `'user'`, `'environment'`

### `max-file-size`

Type: `Number | String`

Maximum size of individual file in bytes

Examples:

- `1024`
- `'1048576'`

### `max-total-size`

Type: `Number | String`

Maximum size of all files combined in bytes

### `max-files`

Type: `Number | String`

Maximum number of files to contain

### `filter`

Type: `Function`

Custom filter for added files; Only files that pass this filter will be added to the queue and uploaded; For best performance, reference it from your scope and do not define it inline

Examples:

- `files => files.filter(file => file.size === 1024)`

### `model-value`

Type: `File | FileList | Array | null | undefined`

Required: yes

Model of the component; Must be FileList or Array if using 'multiple' prop; Either use this property (along with a listener for 'update:modelValue' event) OR use v-model directive

Examples:

- `# v-model="myModel"`

### `error`

Type: `Boolean | null`

Default: `null`

Does field have validation errors?

### `error-message`

Type: `String`

Validation error message (gets displayed only if 'error' is set to 'true')

Examples:

- `'Username must have at least 5 characters'`

### `no-error-icon`

Type: `Boolean`

Hide error icon when there is an error

### `rules`

Type: `Array`

Array of Functions/Strings; If String, then it must be a name of one of the embedded validation rules

Examples:

- `[val => val.length <= 3 || 'Please use maximum 3 characters']`
- `['fulltime']`
- `[(val, rules) => rules.email(val) || 'Please enter a valid email address']`

### `reactive-rules`

Type: `Boolean`

By default a change in the rules does not trigger a new validation until the model changes; If set to true then a change in the rules will trigger a validation; Has a performance penalty, so use it only when you really need it

### `lazy-rules`

Type: `Boolean | String`

Default: `false`

If set to boolean true then it checks validation status against the 'rules' only after field loses focus for first time; If set to 'ondemand' then it will trigger only when component's validate() method is manually called or when the wrapper QForm submits itself

Accepted values: `true`, `false`, `'ondemand'`

### `label`

Type: `String`

A text label that will “float” up above the input field, once the field gets focus

Examples:

- `'Username'`

### `stack-label`

Type: `Boolean`

Label will be always shown above the field regardless of field content (if any)

### `hint`

Type: `String`

Helper (hint) text which gets placed below your wrapped form component

Examples:

- `'Fill in between 3 and 12 characters'`

### `hide-hint`

Type: `Boolean`

Hide the helper (hint) text when field doesn't have focus

### `prefix`

Type: `String`

Prefix

Examples:

- `'$'`

### `suffix`

Type: `String`

Suffix

Examples:

- `'@gmail.com'`

### `label-color`

Type: `String`

Color name for the label from the Quasar Color Palette; Overrides the 'color' prop; The difference from 'color' prop is that the label will always have this color, even when field is not focused

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `bg-color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

### `loading`

Type: `Boolean`

Signals the user a process is in progress by displaying a spinner; Spinner can be customized by using the 'loading' slot.

### `clearable`

Type: `Boolean`

Appends clearable icon when a value (not undefined or null) is set; When clicked, model becomes null

### `clear-icon`

Type: `String`

Custom icon to use for the clear button when using along with 'clearable' prop

Examples:

- `'close'`

### `filled`

Type: `Boolean`

Use 'filled' design for the field

### `outlined`

Type: `Boolean`

Use 'outlined' design for the field

### `borderless`

Type: `Boolean`

Use 'borderless' design for the field

### `standout`

Type: `Boolean | String`

Use 'standout' design for the field; Specifies classes to be applied when focused (overriding default ones)

Examples:

- `true`
- `'bg-primary text-white'`

### `label-slot`

Type: `Boolean`

Enables label slot; You need to set it to force use of the 'label' slot if the 'label' prop is not set

### `bottom-slots`

Type: `Boolean`

Enables bottom slots ('error', 'hint', 'counter')

### `hide-bottom-space`

Type: `Boolean`

Do not reserve space for hint/error/counter anymore when these are not used; As a result, it also disables the animation for those; It also allows the hint/error area to stretch vertically based on its content

### `counter`

Type: `Boolean`

Show an automatic counter on bottom right

### `rounded`

Type: `Boolean`

Applies a small standard border-radius for a squared shape of the component

### `square`

Type: `Boolean`

Remove border-radius so borders are squared; Overrides 'rounded' prop

### `dense`

Type: `Boolean`

Dense mode; occupies less space

### `item-aligned`

Type: `Boolean`

Match inner content alignment to that of QItem

### `disable`

Type: `Boolean`

Put component in disabled mode

### `readonly`

Type: `Boolean`

Put component in readonly mode

### `autofocus`

Type: `Boolean`

Focus field on initial component render

### `for`

Type: `String`

Used to specify the 'id' of the control and also the 'for' attribute of the label that wraps it; If no 'name' prop is specified, then it is used for this attribute as well

Examples:

- `'myFieldsId'`

### `append`

Type: `Boolean`

Append file(s) to current model rather than replacing them; Has effect only when using 'multiple' mode

### `display-value`

Type: `Number | String`

Override default selection string, if not using 'file' or 'selected' scoped slots and if not using 'use-chips' prop

Examples:

- `'Options: x, y, z'`

### `use-chips`

Type: `Boolean`

Use QChip to show picked files

### `counter-label`

Type: `Function`

Label for the counter; The 'counter' prop is necessary to enable this one

Examples:

- `(totalSize, filesNumber, maxFiles) => `${ filesNumber }${ maxFiles !== void 0 ? ' / ' + maxFiles : '' } (${ totalSize })``

### `tabindex`

Type: `Number | String`

Default: `0`

Tabindex HTML attribute value

Examples:

- `100`
- `'0'`

### `input-class`

Type: `String | Array | Object`

Class definitions to be attributed to the underlying selection container

Examples:

- `'my-special-class'`
- `{ 'my-special-class': true }`

### `input-style`

Type: `String | Array | Object`

Style definitions to be attributed to the underlying selection container

Examples:

- `'background-color: #ff0000'`
- `{ backgroundColor: '#ff0000' }`

## Slots

### `default`

Field main content

### `prepend`

Prepend inner field; Suggestions: QIcon, QBtn

### `append`

Append to inner field; Suggestions: QIcon, QBtn

### `before`

Prepend outer field; Suggestions: QIcon, QBtn

### `after`

Append outer field; Suggestions: QIcon, QBtn

### `label`

Slot for label; Used only if 'label-slot' prop is set or the 'label' prop is set; When it is used the text in the 'label' prop is ignored

### `error`

Slot for errors; Enabled only if 'bottom-slots' prop is used; Suggestion: <div>

### `hint`

Slot for hint text; Enabled only if 'bottom-slots' prop is used; Suggestion: <div>

### `counter`

Slot for counter text; Enabled only if 'bottom-slots' prop is used; Suggestion: <div>

### `loading`

Override default spinner when component is in loading mode; Use in conjunction with 'loading' prop

### `file`

Override default node to render a file from the user picked list

### `selected`

Override default selection slot; Suggestion: QChip

## Events

### `rejected`

Emitted after files are picked and some do not pass the validation props (accept, max-file-size, max-total-size, filter, etc)

### `update:model-value`

Emitted when the component needs to change the model; Is also used by v-model

### `focus`

Emitted when component gets focused

### `blur`

Emitted when component loses focus

### `clear`

When using the 'clearable' property, this event is emitted when the clear icon is clicked

## Methods

### `pickFiles`

Trigger file pick; Must be called as a direct consequence of user interaction (eg. in a click handler), due to browsers security policy

### `addFiles`

Add files programmatically

### `resetValidation`

Reset validation status

### `validate`

Trigger a validation

### `focus`

Focus component

### `blur`

Blur component (lose focus)

### `removeAtIndex`

Remove file located at specific index in the model

### `removeFile`

Remove specified file from the model

### `getNativeElement`

DEPRECATED; Access 'nativeEl' directly; Gets the native input DOM Element

## Computed properties

### `hasError`

Type: `Boolean`

Whether the component is in error state

### `nativeEl`

Type: `Element`

Added in: v2.10.1

The native input DOM Element
