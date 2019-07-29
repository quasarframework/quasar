---
title: Input
desc: The QInput Vue component is used to capture text input from the user.
---

The QInput component is used to capture text input from the user. It uses `v-model`, similar to a regular input. It has support for errors and validation, and comes in a variety of styles, colors, and types.

## Installation
<doc-installation components="QInput"/>

## Design

::: warning
For your QInput you can use only one of the main designs (`filled`, `outlined`, `standout`, `borderless`). You cannot use multiple as they are self-exclusive.
:::

<doc-example title="Design Overview" file="QInput/DesignOverview" />

### Coloring

<doc-example title="Coloring" file="QInput/Coloring" />

### Standard
<doc-example title="Standard" file="QInput/DesignStandard" />

### Filled
<doc-example title="Filled" file="QInput/DesignFilled" />

### Outlined
<doc-example title="Outlined" file="QInput/DesignOutlined" />

### Standout
<doc-example title="Standout" file="QInput/DesignStandout" />

One of the most appropriate use cases for Standout design is in a QToolbar:

<doc-example title="Standout in QToolbar" file="QInput/StandoutToolbar" />

### Borderless
The `borderless` design allows you to seamlessly integrate your QInput into other components without QInput drawing a border around itself or changing its background color:

<doc-example title="Borderless" file="QInput/Borderless" />

### Rounded design

The `rounded` prop only works along with Filled, Outlined and Standout designs, as showcased in the example below:

<doc-example title="Rounded" file="QInput/Rounded" />

### Square borders

The `square` prop only makes sense along with Filled, Outlined and Standout designs, as showcased in the example below:

<doc-example title="Square borders" file="QInput/SquareBorders" />

### Dark background

<doc-example title="Dark" file="QInput/Dark" dark />

## Basic features

### Native attributes

All the attributes set on `QInput` that are not in the list of `props` in the **API** will be passed to the native field (`input` or `textarea`). Some examples: autocomplete, placeholder.

Please check these resources for more information about native attributes (for input check also the specific attributes for each type):

* [input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
* [textarea](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea)

### Clearable

As a helper, you can use `clearable` prop so user can reset model to `null` through an appended icon. The second QInput in the example below is the equivalent of using `clearable`.

<doc-example title="Clearable" file="QInput/Clearable" />

### Input types

The following QInputs make use of the `type` prop in order to render native equivalent `<input type="...">` inside of them.

::: warning
Support and behavior is the subject entirely of the browser rendering the page and not Quasar's core code.
:::

<doc-example title="Input types" file="QInput/InputTypes" />

::: tip
Some input types (like `date` or `time`) always render some controls, so you if you're using a `label` then you might want to set it along with `stack-label`, otherwise the label will overlap native browser controls.
:::

#### Input of number type

You'll be using `v-model.number` (notice the `number` modifier) along with `type="number"` prop:

<doc-example title="Input of number type" file="QInput/InputTypeNumber" />

#### Input of file type

::: warning
Do NOT use a `v-model` when QInput is of `type="file"`. Browser security policy does not allow a value to be set to such an input. As a result, you can only read it (attach an `@input` event), but not write it.
:::

<doc-example title="Input of file type" file="QInput/InputTypeFile" />

### Textarea

<doc-example title="Textarea" file="QInput/Textarea" />

When you need QInput to grow along with its content, then use the `autogrow` prop like in the example below:

<doc-example title="Autogrow" file="QInput/Autogrow" />

### Prefix and suffix

<doc-example title="Prefix and suffix" file="QInput/PrefixSuffix" />

### Debouncing model

The role of debouncing is for times when you watch the model and do expensive operations on it. So you want to first let user type out before triggering the model update, rather than updating the model on each keystroke.

<doc-example title="Debounce model" file="QInput/Debouncing" />

### Loading state

<doc-example title="Loading state" file="QInput/LoadingState" />

## Mask

You can force/help the user to input a specific format with help from `mask` prop.

::: warning
Mask is only available if the `type` is one of 'text' (default), 'search', 'url', 'tel', or 'password'.
:::

Below are mask tokens:

| Token | Description |
| --- | --- |
| `#` | Numeric |
| `S` | Letter, a to z, case insensitive |
| `N` | Alphanumeric, case insensitive for letters |
| `A` | Letter, transformed to uppercase |
| `a` | Letter, transformed to lowercase |
| `X` | Alphanumeric, transformed to uppercase for letters |
| `x` | Alphanumeric, transformed to lowercase for letters |

There are **helpers** for QInput `mask` prop: [full list](https://github.com/quasarframework/quasar/blob/dev/ui/src/mixins/mask.js#L2). You can use these for convenience (examples: "phone", "card") or write the string specifying your custom needs.

<doc-example title="Basic" file="QInput/MaskBasic" />

<doc-example title="Filling the mask" file="QInput/MaskFill" />

The `unmasked-value` is useful if for example you want to force the user type a certain format, but you want the model to contain the raw value:

<doc-example title="Unmasked model" file="QInput/MaskUnmaskedModel" />

The `reverse-fill-mask` is useful if you want to force the user to fill the mask from the end and allow non-fixed length of input:

<doc-example title="Filling the mask in reverse" file="QInput/MaskFillReverse" />

## Validation

### Internal validation

You can validate QInput components with `:rules` prop. Specify array of embedded rules or your own validators. Your custom validator will be a function which returns `true` if validator succeeds or `String` with error message if it doesn't succeed.

This is so you can write convenient rules of shape like:

```js
value => condition || errorMessage
 ```
For example:
 ```js
value => value.includes('Hello') || 'Field must contain word Hello'
```

You can reset the validation by calling `resetValidation()` method on the QInput.

There are **helpers** for QInput `rules` prop: [full list](https://github.com/quasarframework/quasar/blob/dev/ui/src/utils/patterns.js). You can use these for convenience (examples: "date", "time", "hexColor", "rgbOrRgbaColor", "anyColor") or write the string specifying your custom needs.

<doc-example title="Basic" file="QInput/ValidationRequired" />

<doc-example title="Maximum length" file="QInput/ValidationMaxLength" />

If you set `lazy-rules`, validation starts after first blur.

<doc-example title="Lazy rules" file="QInput/ValidationLazy" />

<doc-example title="Form validation" file="QInput/ValidationForm" />

#### Async rules
Rules can be async too, by using async/await or by directly returning a Promise.

::: tip
Consider coupling async rules with `debounce` prop to avoid calling the async rules immediately on each keystroke, which might be detrimental to performance.
:::

<doc-example title="Async rules" file="QInput/ValidationAsync" />

### External validation

You can also use external validation and only pass `error` and `error-message` (enable `bottom-slots` to display this error message).

::: tip
Depending on your needs, you might connect [Vuelidate](https://vuelidate.netlify.com/) (our recommended approach) or some other validation library to QInput.
:::

<doc-example title="External" file="QInput/ValidationExternal" />

You can also customize the slot for error message:

<doc-example title="Slot for error message" file="QInput/ValidationSlots" />

## QInput API
<doc-api file="QInput" />
