---
title: Field
---

The QField component is used to provide common functionality and aspect to form components. It uses `:value` (or `v-model` if you want to use `clearable` property) to have knowledge of the model of the component inside. It has support for labels, hints, errors, validation, and comes in a variety of styles and colors.

QField allows you to display any form control (or almost anything as a matter of fact) inside it. Just place your desired content inside the `control` slot.


## Installation
<doc-installation components="QField"/>

## Design

::: warning
For your QField you can use only one of the main designs (`filled`, `outlined`, `standout`, `borderless`). You cannot use multiple as they are self-exclusive.
:::

<doc-example title="Design Overview" file="QField/DesignOverview" />

### Coloring

<doc-example title="Coloring" file="QField/Coloring" />

### Standard
<doc-example title="Standard" file="QField/DesignStandard" />

### Filled
<doc-example title="Filled" file="QField/DesignFilled" />

### Outlined
<doc-example title="Outlined" file="QField/DesignOutlined" />

### Standout
<doc-example title="Standout" file="QField/DesignStandout" />

One of the most appropriate use cases for Standout design is in a QToolbar:

<doc-example title="Standout in QToolbar" file="QField/StandoutToolbar" />

### Borderless
The `borderless` design allows you to seamlessly integrate your QField into other components without QField drawing a border around itself or changing its background color:

<doc-example title="Borderless" file="QField/Borderless" />

### Rounded design

The `rounded` prop only works along with Filled, Outlined and Standout designs, as showcased in the example below:

<doc-example title="Rounded" file="QField/Rounded" />

### Square borders

The `square` prop only makes sense along with Filled, Outlined and Standout designs, as showcased in the example below:

<doc-example title="Square borders" file="QField/SquareBorders" />

### Dark background

<doc-example title="Dark" file="QField/Dark" dark />

## Basic features

### Clearable
As a helper, you can use `clearable` prop so user can reset model to `null` through an appended icon.

:::warning
If using `clearable` you must use `v-model` or listen on `@input` and update the value.
:::

<doc-example title="Clearable" file="QField/Clearable" />

### Control types

Anything you place inside the `control` slot will be used as content of the field. We provide a few examples of controls below.

<doc-example title="Control types" file="QField/ControlTypes" />

::: tip
Most of the form controls always render something visible, so you if you're using a `label` then you might want to set it along with `stack-label`, otherwise the label will overlap the enclosed control.
:::

### Prefix and suffix

<doc-example title="Prefix and suffix" file="QField/PrefixSuffix" />

### Loading state

<doc-example title="Loading state" file="QField/LoadingState" />

## Validation

### Internal validation

You can validate QField components with `:rules` prop. Specify array of embedded rules or your own validators. Your custom validator will be a function which returns `true` if validator succeeds or `String` with error message if it doesn't succeed.

This is so you can write convenient rules of shape like:

```js
value => condition || errorMessage
 ```
For example:
 ```js
value => value < 10 || 'Value should be lower'
```

You can reset the validation by calling `resetValidation()` method on the QField.

<doc-example title="Basic" file="QField/ValidationRequired" />

<doc-example title="Maximum length" file="QField/ValidationMaxLength" />

If you set `lazy-rules`, validation starts after first blur.

<doc-example title="Lazy rules" file="QField/ValidationLazy" />

<doc-example title="Form validation" file="QField/ValidationForm" />

#### Async rules
Rules can be async too, by using async/await or by directly returning a Promise.

::: tip
Consider coupling async rules with `debounce` prop to avoid calling the async rules immediately on each keystroke, which might be detrimental to performance.
:::

<doc-example title="Async rules" file="QField/ValidationAsync" />

### External validation

You can also use external validation and only pass `error` and `error-message` (enable `bottom-slots` to display this error message).

::: tip
Depending on your needs, you might connect [Vuelidate](https://vuelidate.netlify.com/) (our recommended approach) or some other validation library to QField.
:::

<doc-example title="External" file="QField/ValidationExternal" />

You can also customize the slot for error message:

<doc-example title="Slot for error message" file="QField/ValidationSlots" />

## QField API
<doc-api file="QField" />
