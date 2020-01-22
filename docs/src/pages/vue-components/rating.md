---
title: Rating
desc: The QRating Vue component allows the user to rate items. It's usually known as 'star rating'.
---

Quasar Rating is a Component which allows users to rate items, usually known as “Star Rating”.

## Installation

<doc-installation components="QRating" />

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

<q-badge label="v1.5+" />

When using the `color-selected` prop, notice we can still use `color` as well. The latter becomes the color(s) of the icons when they are not selected.

<doc-example title="Different color for each rating" file="QRating/Colors" />

### Floating number

<q-badge label="v1.7.4+" />

<doc-example title="Different icon and color when half selected" file="QRating/HalfSelected" />

### No dimming

<q-badge label="v1.7.4+" />

<doc-example title="No dimming" file="QRating/NoDimming" />

### Tooltips

<q-badge label="v1.5+" />

Notice how we can add tooltips to each icon in the example below.

<doc-example title="With QTooltip" file="QRating/SlotTip" />

### Sizes

Apart from the standard sizes below, you can define your own through the `size` property.

<doc-example title="Standard sizes" file="QRating/StandardSizes" />

### Readonly and disable

<doc-example title="Readonly and disable" file="QRating/ReadonlyDisable" />

## QRating API

<doc-api file="QRating" />
