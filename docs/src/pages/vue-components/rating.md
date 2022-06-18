---
title: Rating
desc: The QRating Vue component allows the user to rate items. It's usually known as 'star rating'.
keys: QRating
---

Quasar Rating is a Component which allows users to rate items, usually known as “Star Rating”.

## QRating API

<doc-api file="QRating" />

## Usage

### Basic

<doc-example title="Basic" file="QRating/Basic" />

<doc-example title="Custom number of choices" file="QRating/Max" />

### Icons

<doc-example title="Image icons" file="QRating/Images" />

In the example below, when using the `icon-selected` prop, notice we can still use `icon` as well. The latter becomes the icon(s) when they are not selected.

<doc-example title="Different icon when selected" file="QRating/SelectedIcon" />

<doc-example title="Different icon for each rating" file="QRating/ArrayIcon" />

### Colors

When using the `color-selected` prop, notice we can still use `color` as well. The latter becomes the color(s) of the icons when they are not selected.

<doc-example title="Different color for each rating" file="QRating/Colors" />

### Floating number

<doc-example title="Different icon and color when half selected" file="QRating/HalfSelected" />

### No dimming

<doc-example title="No dimming" file="QRating/NoDimming" />

### Tooltips

Notice how we can add tooltips to each icon in the example below.

<doc-example title="With QTooltip" file="QRating/SlotTip" />

### Sizes

Apart from the standard sizes below, you can define your own through the `size` property.

<doc-example title="Standard sizes" file="QRating/StandardSizes" />

### Readonly and disable

<doc-example title="Readonly and disable" file="QRating/ReadonlyDisable" />

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QRating, otherwise formData will not contain it (if it should):

<doc-example title="Native form" file="QRating/NativeForm" />
