---
title: Rating
desc: The QRating Vue component allows the user to rate items. It's usually known as 'star rating'.
keys: QRating
examples: QRating
---

Quasar Rating is a Component which allows users to rate items, usually known as “Star Rating”.

<DocApi file="QRating" />

## Usage

### Basic

<DocExample title="Basic" file="Basic" />

<DocExample title="Custom number of choices" file="Max" />

### Icons

<DocExample title="Image icons" file="Images" />

In the example below, when using the `icon-selected` prop, notice we can still use `icon` as well. The latter becomes the icon(s) when they are not selected.

<DocExample title="Different icon when selected" file="SelectedIcon" />

<DocExample title="Different icon for each rating" file="ArrayIcon" />

### Colors

When using the `color-selected` prop, notice we can still use `color` as well. The latter becomes the color(s) of the icons when they are not selected.

<DocExample title="Different color for each rating" file="Colors" />

### Floating number

<DocExample title="Different icon and color when half selected" file="HalfSelected" />

### No dimming

<DocExample title="No dimming" file="NoDimming" />

### Tooltips

Notice how we can add tooltips to each icon in the example below.

<DocExample title="With QTooltip" file="SlotTip" />

### Sizes

Apart from the standard sizes below, you can define your own through the `size` property.

<DocExample title="Standard sizes" file="StandardSizes" />

### Readonly and disable

<DocExample title="Readonly and disable" file="ReadonlyDisable" />

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QRating, otherwise formData will not contain it (if it should):

<DocExample title="Native form" file="NativeForm" />
