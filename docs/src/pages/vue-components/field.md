---
title: Field
desc: The QField Vue component is used to provide common functionality and aspect to form components.
keys: QField
examples: QField
---

The QField component is used to provide common functionality and aspect to form components. It uses `:model-value` (or `v-model` if you want to use `clearable` property) to have knowledge of the model of the component inside. It has support for labels, hints, errors, validation, and comes in a variety of styles and colors.

QField allows you to display any form control (or almost anything as a matter of fact) inside it. Just place your desired content inside the `control` slot.

::: danger
Do NOT wrap QInput, QFile or QSelect with QField as these components already inherit QField.
:::

<DocApi file="QField" />

## Design

::: tip
The examples below use dumb content (text) just to show you the design that QField can use. For checking out examples that wrap real components, see the "Basic Features" section.
:::

::: danger
QField does not (and should not) manage your `control` slot, so if you use `label` prop, it might be a good idea to also specify `stack-label`, otherwise it might overlap your control when QField is not focused.
:::

### Overview

For your QField you can use only one of the main designs (`filled`, `outlined`, `standout`, `borderless`). You cannot use multiple as they are self-exclusive.

<DocExample title="Design Overview" file="DesignOverview" />

### Coloring

<DocExample title="Coloring" file="Coloring" />

### Standard
<DocExample title="Standard" file="DesignStandard" />

### Filled
<DocExample title="Filled" file="DesignFilled" />

### Outlined
<DocExample title="Outlined" file="DesignOutlined" />

### Standout
<DocExample title="Standout" file="DesignStandout" />

One of the most appropriate use cases for Standout design is in a QToolbar:

<DocExample title="Standout in QToolbar" file="StandoutToolbar" />

### Borderless
The `borderless` design allows you to seamlessly integrate your QField into other components without QField drawing a border around itself or changing its background color:

<DocExample title="Borderless" file="Borderless" />

### Rounded design

The `rounded` prop only works along with Filled, Outlined and Standout designs, as showcased in the example below:

<DocExample title="Rounded" file="Rounded" />

### Square borders

The `square` prop only makes sense along with Filled, Outlined and Standout designs, as showcased in the example below:

<DocExample title="Square borders" file="SquareBorders" />

### Force dark mode

<DocExample title="Force dark mode" file="Dark" />

## Basic features

### Clearable
As a helper, you can use `clearable` prop so user can reset model to `null` through an appended icon.

::: warning
If using `clearable` you must use `v-model` or listen on `@update:model-value` and update the value.
:::

<DocExample title="Clearable" file="Clearable" />

### Control types

Anything you place inside the `control` slot will be used as content of the field. We provide a few examples of controls below.

<DocExample title="Control types" file="ControlTypes" />

::: tip
Most of the form controls always render something visible, so you if you're using a `label` then you might want to set it along with `stack-label`, otherwise the label will overlap the enclosed control.
:::

### Prefix and suffix

<DocExample title="Prefix and suffix" file="PrefixSuffix" />

### Custom Label

Using the `label` slot you can customize the aspect of the label or add special features as `QTooltip`.

::: tip
Do not forget to set the `label-slot` property.

If you want to interact with the content of the label (QTooltip) add the `all-pointer-events` class on the element in the slot.
:::

<DocExample title="Custom label" file="CustomLabel" />

### Slots with QBtn type "submit"

::: warning
When placing a QBtn with type "submit" in one of the "before", "after", "prepend", or "append" slots of a QField, QInput or QSelect, you should also add a `@click` listener on the QBtn in question. This listener should call the method that submits your form. All "click" events in such slots are not propagated to their parent elements.
:::

### Loading state

<DocExample title="Loading state" file="LoadingState" />

## Validation

### Internal validation

You can validate QField components with `:rules` prop. Specify array of embedded rules or your own validators. Your custom validator will be a function which returns `true` if validator succeeds or `String` with error message if it doesn't succeed.

::: tip
By default, for perf reasons, a change in the rules does not trigger a new validation until the model changes. In order to trigger the validation when rules change too, then use `reactive-rules` Boolean prop. The downside is a performance penalty (so use it when you really need this only!) and it can be slightly mitigated by using a computed prop as value for the rules (and not specify them inline in the vue template).
:::

This is so you can write convenient rules of shape like:

```js
value => condition || errorMessage
 ```
For example:
 ```js
value => value < 10 || 'Value should be lower'
```

You can reset the validation by calling `resetValidation()` method on the QField.

<DocExample title="Basic" file="ValidationRequired" />

<DocExample title="Maximum value" file="ValidationMaxValue" />

If you set `lazy-rules`, validation starts after first blur. If `lazy-rules` is set to `ondemand` String, then validation will be triggered only when component's validate() method is manually called or when the wrapper QForm submits itself.

<DocExample title="Lazy rules" file="ValidationLazy" />

#### Async rules
Rules can be async too, by using async/await or by directly returning a Promise.

::: tip
Consider coupling async rules with `debounce` prop to avoid calling the async rules immediately on each keystroke, which might be detrimental to performance.
:::

<DocExample title="Async rules" file="ValidationAsync" />

### External validation

You can also use external validation and only pass `error` and `error-message` (enable `bottom-slots` to display this error message).

::: tip
Depending on your needs, you might connect [Vuelidate](https://vuelidate.netlify.com/) (our recommended approach) or some other validation library to QField.
:::

<DocExample title="External" file="ValidationExternal" />

You can also customize the slot for error message:

<DocExample title="Slot for error message" file="ValidationSlots" />
