---
title: Button Toggle
desc: The QBtnToggle Vue component is a basic element for user input, similar to QRadio but with buttons.
keys: QBtnToggle
related:
  - /vue-components/button
  - /vue-components/tabs
  - /vue-components/option-group
  - /vue-components/radio
  - /vue-components/checkbox
  - /vue-components/toggle
---
The QBtnToggle component is another basic element for user input, similar to QRadio but with buttons. You can use this to supply a way for the user to pick an option from multiple choices.

## QBtnToggle API

<doc-api file="QBtnToggle" />

## Usage

### Basic

<doc-example title="Basic" file="QBtnToggle/Basic" />

### Design

::: tip
Since QBtnToggle uses QBtn, you can use design related props of QBtn to style this component.
:::

<doc-example title="Some design examples" file="QBtnToggle/Design" />

<doc-example title="Spread horizontally" file="QBtnToggle/Spread" />

<doc-example title="On a dark background" file="QBtnToggle/Dark" dark />

### Custom content

First QBtnToggle below has tooltips on each button. Second QBtnToggle has customized the content. Notice the `slot` prop in the `options` Object definition. When you use this `slot` prop, you don't necessary need the `label`/`icon` props in `options`.

<doc-example title="Custom buttons content" file="QBtnToggle/CustomContent" />

### Disable and readonly

<doc-example title="Disable and readonly" file="QBtnToggle/DisableReadonly" />

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QBtnToggle, otherwise formData will not contain it (if it should) - all value are converted to string (native behaviour, so do not use Object values):

<doc-example title="Native form" file="QBtnToggle/NativeForm" />
