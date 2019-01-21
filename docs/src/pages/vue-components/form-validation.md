---
title: Form Validation
---
You can validate input components with `:rules` prop. Specify array of embedded rules or your own validators. Your custom validator will be a function which returns `true` if validator succeeds or `String` with error message if it doesn't succeed.

This is so you can write convenient rules of shape like:
```js
value => condition || errorMessage
 ```
For example:
 ```js
value => value.includes('Hello') || 'Field must contain word Hello'
```
You can reset the validation by calling `resetValidation()` method on the input.

## Usage
<doc-example title="Basic Usage" file="FormValidation/Required" />

<doc-example title="Maximum Length" file="FormValidation/MaxLength" />

If you set `lazy-rules`, validation starts after first blur.

<doc-example title="Lazy Rules" file="FormValidation/Lazy" />

## External Validation
You can also use external validation and only pass `error` and `error-message` (enable `bottom-slots` to display this error message):

<doc-example title="External" file="FormValidation/External" />

You can also customize the slot for error message:

<doc-example title="Slot for error message" file="FormValidation/Slots" />

