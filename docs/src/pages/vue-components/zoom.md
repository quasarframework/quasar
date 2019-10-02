---
title: Zoom
desc: The QZoom component allows slotted content to be zoomed in.
badge: v1.3+
---

The QZoom component allows slotted content to be zoomed in. To zoom, either click or touch (touchscreen or mobile), the content. Repeating the same procedure zooms the content back into place. If a keyboard is available, pressing the ESC key also cancels the zoom.

## Installation
<doc-installation components="QZoom" />

## Usage

When a mouse hovers over zoomable content, the mouse cursor will change to the magnify-plus. If the content is already zoomed, the cursor will change to the magnify-minus. Clicking on the zoomable content toggle the "zoom in" and "zoom out".

Different states are configurable. For instance, allowing the content to be scalable (with mouse wheel) or setting an initial scale.

When zooming images, it is important to have the appropriate CSS classes to fit your needs. If you know the image is too wide to fit the screen, then you will need to scale on width, or if it is too long, then vice-versa.

```js
.my-landscape-image
  width: 100%
  height: auto
  max-width: 100%
  max-height: 100%
  margin: auto

.my-portrait-image
  width: auto
  height: auto
  max-width: 100%
  max-height: 100%
  margin: auto
```

See the subtle differences in the CSS above?

### Basic

<doc-example title="Basic" file="QZoom/Basic" />

### Landscape (with Background Color)

In most cases, you want the background color to match the surrounding background color. But, you can change that to really make to image pop out.

<doc-example title="Landscape" file="QZoom/Landscape" />

### Portrait

<doc-example title="Portrait" file="QZoom/Portrait" />

### Video

<doc-example title="Video" file="QZoom/Video" />

### Content

<doc-example title="Content" file="QZoom/Content" />

### Restore on Scroll

In most cases, QZoom turns off any scrollbars for a better User Experience. Using the `restore-on-scroll` property allows the scrollbars (if any) to be visible. If the user attempts to scroll, the content will automatically be zoomed out.

<doc-example title="Restore on Scroll" file="QZoom/RestoreOnScroll" />

### Scale

With the `scale` property, the user can change the scaling using the mouse-wheel.

<doc-example title="Scale" file="QZoom/Scale" />

### Initial Scale

With the `initial-scale` property, the starting scale can be set.

<doc-example title="Initial Scale" file="QZoom/InitialScale" />

### Scale Text

If your content is textual, then you will want to use the `scale-text` property instead of the `scale` property. They are mutually exclusive.

<doc-example title="Scale Text" file="QZoom/ScaleText" />

### Initial Scale Text

With the `initial-scale-text` property, the starting text scale can be set.

<doc-example title="Initial Scale Text" file="QZoom/InitialScaleText" />

### No Wheel Scale

When the `no-wheel-scale` is set, then the user has no control over changing the `scale` or `scale-text` with the mouse wheel.

<doc-example title="No Wheel Scale" file="QZoom/NoWheelScale" />

### No ESC Close

When the `no-esc-close` property is set, then the ESC key will no work to zoom out the content.

<doc-example title="No ESC Close" file="QZoom/NoEscClose" />

### Manual

When the `manual` property is set, you must provide the means to zoom the slotted content. Also, the cursor does not change to indicate the slotted content can be zoomed. In the example below, click the **ZOOM** button. To zoom out, use the **ESC** key.

::: tip
Try using the mouse wheel to scale the text. You will notice not all text will scale, depending on CSS applied to it.
:::

<doc-example title="Manual" file="QZoom/Manual" />


## QZoom API
<doc-api file="QZoom" />
