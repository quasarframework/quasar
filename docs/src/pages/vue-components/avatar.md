---
title: Avatar
desc: The QAvatar Vue component creates an element that can embed a letter, an icon or an image within its shape.
---
The QAvatar component creates a scalable, color-able element that can have text, icon or image within its shape. By default it is circular, but it can also be square or have a border-radius applied to give rounded corners to the square shape.

It is often used with other components in their slots.

## QAvatar API
<doc-api file="QAvatar" />

## Usage

::: tip
The `size` property will determine the height and the width of the Avatar. The `font-size` property will set the size of the font used within the Avatar, which will have an effect on the size of letters and icons.
:::

<doc-example title="Basic" file="QAvatar/Basic" />

<doc-example title="Standard sizes" file="QAvatar/StandardSizes" />

<doc-example title="Square" file="QAvatar/Square" />

<doc-example title="Rounded" file="QAvatar/Rounded" />

<doc-example title="With other components" file="QAvatar/Integrated" />
