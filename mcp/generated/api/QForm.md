# QForm API

Type: component

Canonical documentation: https://quasar.dev/vue-components/form

## Props

### `autofocus`

Type: `Boolean`

Focus first focusable element on initial component render

### `no-error-focus`

Type: `Boolean`

Do not try to focus on first component that has a validation error when submitting form

### `no-reset-focus`

Type: `Boolean`

Do not try to focus on first component when resetting form

### `greedy`

Type: `Boolean`

Validate all fields in form (by default it stops after finding the first invalid field with synchronous validation)

## Slots

### `default`

Default slot in the devland unslotted content of the component

## Events

### `submit`

Emitted when all validations have passed when tethered to a submit button

### `reset`

Emitted when all validations have been reset when tethered to a reset button; It is recommended to manually reset the wrapped components models in this handler

### `validation-success`

Emitted after a validation was triggered and all inner Quasar components models are valid

### `validation-error`

Emitted after a validation was triggered and at least one of the inner Quasar components models are NOT valid

## Methods

### `focus`

Focus on first focusable element/component in the form

### `validate`

Triggers a validation on all applicable inner Quasar components

### `resetValidation`

Resets the validation on all applicable inner Quasar components

### `submit`

Manually trigger form validation and submit

### `reset`

Manually trigger form reset

### `getValidationComponents`

Get an array of children Vue component instances that support Quasar validation API (derived from QField, or using useFormChild()/QFormChildMixin)
