# QSelect API

Type: component

Canonical documentation: https://quasar.dev/vue-components/select

## Props

### `name`

Type: `String`

Used to specify the name of the control; Useful if dealing with forms; If not specified, it takes the value of 'for' prop, if it exists

Examples:

- `'car_id'`

### `virtual-scroll-horizontal`

Type: `Boolean`

Make virtual list work in horizontal mode

### `virtual-scroll-slice-size`

Type: `Number | String | null`

Default: `10`

Minimum number of items to render in the virtual list

Examples:

- `60`
- `'60'`

### `virtual-scroll-slice-ratio-before`

Type: `Number | String`

Default: `1`

Ratio of number of items in visible zone to render before it

### `virtual-scroll-slice-ratio-after`

Type: `Number | String`

Default: `1`

Ratio of number of items in visible zone to render after it

### `virtual-scroll-item-size`

Type: `Number | String`

Default: `24`

Default size in pixels (height if vertical, width if horizontal) of an item; This value is used for rendering the initial list; Try to use a value close to the minimum size of an item

### `virtual-scroll-sticky-size-start`

Type: `Number | String`

Default: `0`

Size in pixels (height if vertical, width if horizontal) of the sticky part (if using one) at the start of the list; A correct value will improve scroll precision

### `virtual-scroll-sticky-size-end`

Type: `Number | String`

Default: `0`

Size in pixels (height if vertical, width if horizontal) of the sticky part (if using one) at the end of the list; A correct value will improve scroll precision

### `table-colspan`

Type: `Number | String`

The number of columns in the table (you need this if you use table-layout: fixed)

### `model-value`

Type: `Any`

Required: yes

Model of the component; Must be Array if using 'multiple' prop; Either use this property (along with a listener for 'update:modelValue' event) OR use v-model directive

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

### `multiple`

Type: `Boolean`

Allow multiple selection; Model must be Array

### `display-value`

Type: `Number | String`

Override default selection string, if not using 'selected' slot/scoped slot and if not using 'use-chips' prop

Examples:

- `'Options: x, y, z'`

### `display-value-html`

Type: `Boolean`

Force render the selected option(s) as HTML; This can lead to XSS attacks so make sure that you sanitize the content; Does NOT apply when using 'selected' or 'selected-item' slots!

### `options`

Type: `Array`

Default: `[]`

Array of objects with available options that the user can select from. For best performance freeze the list of options. Canonical form of each object is with 'label' (String), 'value' (Any) and optional 'disable' (Boolean) props (can be customized with options-value/option-label/option-disable props).

Examples:

- `['Tesla', 'iPhone']`
- `[{ label: 'Tesla', value: 'car' }, { label: 'iPhone', value: 'phone' }]`

### `option-value`

Type: `Function | String`

Default: `'value'`

Property of option which holds the 'value'; If using a function then for best performance, reference it from your scope and do not define it inline

Examples:

- `'modelNumber'`
- `item => (item === null ? null : item.modelNumber)`

### `option-label`

Type: `Function | String`

Default: `'label'`

Property of option which holds the 'label'; If using a function then for best performance, reference it from your scope and do not define it inline

Examples:

- `'itemName'`
- `item => (item === null ? 'Null value' : item.itemName)`

### `option-disable`

Type: `Function | String`

Default: `'disable'`

Property of option which tells it's disabled; The value of the property must be a Boolean; If using a function then for best performance, reference it from your scope and do not define it inline

Examples:

- `item => (item === null ? true : item.cannotSelect)`
- `# option-disable="cannotSelect"`

### `hide-selected`

Type: `Boolean`

Hides selection; Use the underlying input tag to hold the label (instead of showing it to the right of the input) of the selected option; Only works for non 'multiple' Selects

### `hide-dropdown-icon`

Type: `Boolean`

Hides dropdown icon

### `dropdown-icon`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `max-values`

Type: `Number | String`

Allow a maximum number of selections that the user can do

### `options-dense`

Type: `Boolean`

Dense mode for options list; occupies less space

### `options-dark`

Type: `Boolean | null`

Default: `null`

Options menu will be colored with a dark color

### `options-selected-class`

Type: `String`

CSS class name for options that are active/selected; Set it to an empty string to stop applying the default (which is text-* where * is the 'color' prop value)

Examples:

- `'text-orange'`

### `options-html`

Type: `Boolean`

Force render the options as HTML; This can lead to XSS attacks so make sure that you sanitize the content; Does NOT apply when using 'option' slot!

### `options-cover`

Type: `Boolean`

Expanded menu will cover the component (will not work along with 'use-input' prop for obvious reasons)

### `menu-shrink`

Type: `Boolean`

Allow the options list to be narrower than the field (only in menu mode)

### `menu-anchor`

Type: `String`

Two values setting the starting position or anchor point of the options list relative to the field (only in menu mode)

Accepted values: `'top left'`, `'top middle'`, `'top right'`, `'top start'`, `'top end'`, `'center left'`, `'center middle'`, `'center right'`, `'center start'`, `'center end'`, `'bottom left'`, `'bottom middle'`, `'bottom right'`, `'bottom start'`, `'bottom end'`

### `menu-self`

Type: `String`

Two values setting the options list's own position relative to its target (only in menu mode)

Accepted values: `'top left'`, `'top middle'`, `'top right'`, `'top start'`, `'top end'`, `'center left'`, `'center middle'`, `'center right'`, `'center start'`, `'center end'`, `'bottom left'`, `'bottom middle'`, `'bottom right'`, `'bottom start'`, `'bottom end'`

### `menu-offset`

Type: `Array`

An array of two numbers to offset the options list horizontally and vertically in pixels (only in menu mode)

Examples:

- `[8, 8]`
- `[5, 10]`

### `popup-content-class`

Type: `String`

Class definitions to be attributed to the popup content

Examples:

- `'my-special-class'`

### `popup-content-style`

Type: `String | Array | Object`

Style definitions to be attributed to the popup content

Examples:

- `'background-color: #ff0000'`
- `{ backgroundColor: '#ff0000' }`

### `popup-no-route-dismiss`

Type: `Boolean`

Added in: v2.15

Changing route app won't dismiss the popup (menu or dialog)

### `use-chips`

Type: `Boolean`

Use QChip to show what is currently selected

### `use-input`

Type: `Boolean`

Use an input tag where users can type

### `maxlength`

Type: `String | Number`

Specify a max length for the inner input tag (if 'use-input' is enabled)

### `fill-input`

Type: `Boolean`

Fills the input with current value; Useful along with 'hide-selected'; Does NOT work along with 'multiple' selection

### `new-value-mode`

Type: `String`

Enables creation of new values and defines behavior when a new value is added: 'add' means it adds the value (even if possible duplicate), 'add-unique' adds only unique values, and 'toggle' adds or removes the value (based on if it exists or not already); When using this prop then listening for @new-value becomes optional (only to override the behavior defined by 'new-value-mode')

Accepted values: `'add'`, `'add-unique'`, `'toggle'`

### `map-options`

Type: `Boolean`

Try to map labels of model from 'options' Array; has a small performance penalty; If you are using emit-value you will probably need to use map-options to display the label text in the select field rather than the value;  Refer to the 'Affecting model' section above

### `disable-tab-selection`

Type: `Boolean`

Added in: v2.17

Prevents the tab key from confirming the currently hovered option

### `emit-value`

Type: `Boolean`

Update model with the value of the selected option instead of the whole option

### `input-debounce`

Type: `Number | String`

Default: `500`

Debounce the input model update with an amount of milliseconds (also affects the 'filter' event, if used)

### `input-class`

Type: `String | Array | Object`

Class definitions to be attributed to the underlying input tag

Examples:

- `'my-special-class'`
- `{ 'my-special-class': true }`

### `input-style`

Type: `String | Array | Object`

Style definitions to be attributed to the underlying input tag

Examples:

- `'background-color: #ff0000'`
- `{ backgroundColor: '#ff0000' }`

### `tabindex`

Type: `Number | String`

Default: `0`

Tabindex HTML attribute value

Examples:

- `100`
- `'0'`

### `autocomplete`

Type: `String`

Autocomplete attribute for field

Examples:

- `'country'`

### `transition-show`

Type: `String`

Default: `'fade'`

Transition when showing the menu/dialog; One of Quasar's embedded transitions

Examples:

- `'fade'`
- `'slide-down'`

### `transition-hide`

Type: `String`

Default: `'fade'`

Transition when hiding the menu/dialog; One of Quasar's embedded transitions

Examples:

- `'fade'`
- `'slide-down'`

### `transition-duration`

Type: `String | Number`

Default: `300`

Transition duration when hiding the menu/dialog (in milliseconds, without unit)

### `behavior`

Type: `String`

Default: `'default'`

Overrides the default dynamic mode of showing as menu on desktop and dialog on mobiles

Accepted values: `'default'`, `'menu'`, `'dialog'`

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

Override default spinner when component is in loading mode; Suggestion: spinners

### `selected`

Override default selection slot; Suggestion: QChip

### `before-options`

Template slot for the elements that should be rendered before the list of options

### `after-options`

Template slot for the elements that should be rendered after the list of options

### `no-option`

What should the menu display after filtering options and none are left to be displayed; Suggestion: <div>

### `selected-item`

Override default selection slot; Suggestion: QChip

### `option`

Customize how options are rendered; Suggestion: QItem

## Events

### `virtual-scroll`

Emitted when the virtual scroll occurs

### `update:model-value`

Emitted when the component needs to change the model; Is also used by v-model

### `focus`

Emitted when component gets focused

### `blur`

Emitted when component loses focus

### `clear`

When using the 'clearable' property, this event is emitted when the clear icon is clicked

### `input-value`

Emitted when the value in the text input changes

### `remove`

Emitted when an option is removed from selection

### `add`

Emitted when an option is added to the selection

### `new-value`

Enables creation of new values; Emitted when a new value has been created; You can override 'new-value-mode' property with it

### `filter`

Emitted when user wants to filter a value

### `filter-abort`

Emitted when a filtering was aborted; Probably a new one was requested?

### `popup-show`

Emitted when the select options menu or dialog is shown.

### `popup-hide`

Emitted when the select options menu or dialog is hidden.

## Methods

### `scrollTo`

Scroll the virtual scroll list to the item with the specified index (0 based)

### `reset`

Resets the virtual scroll computations; Needed for custom edge-cases

### `refresh`

Refreshes the virtual scroll list; Use it after appending items

### `resetValidation`

Reset validation status

### `validate`

Trigger a validation

### `focus`

Focus component

### `blur`

Blur component (lose focus)

### `showPopup`

Focus and open popup

### `hidePopup`

Hide popup

### `removeAtIndex`

Remove selected option located at specific index

### `add`

Adds option to model

### `toggleOption`

Add/remove option from model

### `getOptionIndex`

Added in: v2.5.4

Gets current focused option index from menu; It's -1 if no option is focused

### `setOptionIndex`

Sets option from menu as 'focused'; -1 to focus none

### `moveOptionSelection`

Move selected option from menu by index offset

### `filter`

Filter options

### `updateMenuPosition`

Recomputes menu position

### `updateInputValue`

If 'use-input' is specified, this updates the value that it holds

### `isOptionSelected`

Tells if an option is selected

### `getEmittingOptionValue`

Get the model value that would be emitted by QSelect when selecting a said option; Also takes into consideration if 'emit-value' is set

### `getOptionValue`

Get the model value of an option; Takes into consideration 'option-value' (if used), but does not looks for 'emit-value', like getEmittingOptionValue() does

### `getOptionLabel`

Get the label of an option; Takes into consideration the 'option-label' prop (if used)

### `isOptionDisabled`

Tells if an option is disabled; Takes into consideration 'option-disable' prop (if used)

## Computed properties

### `hasError`

Type: `Boolean`

Whether the component is in error state
