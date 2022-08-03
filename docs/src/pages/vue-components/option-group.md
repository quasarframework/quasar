---
title: Option Group
desc: The QOptionGroup Vue component allows you better control for grouping binary form input components like checkboxes, radios or toggles.
keys: QOptionGroup
related:
  - /vue-components/radio
  - /vue-components/checkbox
  - /vue-components/toggle
  - /vue-components/button-toggle
---

The QOptionGroup component is a helper component that allows you better control for grouping binary (on or off, true or false, 1 or 0) form input components like checkboxes, radios or toggles. A good use for this component is for offering a set of options or settings to turn on and off.

## QOptionGroup API

<doc-api file="QOptionGroup" />

## Usage

### Standard

<doc-example title="Standard" file="QOptionGroup/Standard" />

### With QCheckbox or QToggle

<doc-example title="With checkboxes" file="QOptionGroup/Checkbox" />

::: warning
The model for checkboxes/toggles must be an array.
:::

<doc-example title="With toggles" file="QOptionGroup/Toggle" />

### Using label slots <q-badge align="top" color="brand-primary" label="v2.2+" />

There are two types of slots. A generic one (`label`) which applies to all options, unless a more specific index-based one is used (`label-N` where N is the 0-based index of the option). Both types of slots receive the respective option as parameter.

Notice how we use the specific label slot for first option (option at index 0) and we also add a QTooltip.

<doc-example title="Label slots" file="QOptionGroup/LabelSlots" />

### With labels on left side

<doc-example title="With option labels on the left side" file="QOptionGroup/Label" />

### Inline

<doc-example title="Inline" file="QOptionGroup/Inline" />

### Dense

<doc-example title="Dense and inline" file="QOptionGroup/DenseInline" />

### Disable

<doc-example title="Disabled" file="QOptionGroup/Disable" />

::: tip
The objects within the `options` array can hold any of the props found in QToggle, QCheckbox or QRadio for instance `disable` or `leftLabel`. See below for an example.
:::

### Disable Certain Options

<doc-example title="Disable Certain Options" file="QOptionGroup/DisableCertainOptions" />

### Dark

<doc-example title="On a dark background" file="QOptionGroup/Dark" dark />

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QOptionGroup, otherwise formData will not contain it (if it should) - all value are converted to string (native behaviour, so do not use Object values):

<doc-example title="Native form" file="QOptionGroup/NativeForm" />
