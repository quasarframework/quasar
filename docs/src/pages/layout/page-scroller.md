---
title: Layout QPageScroller
desc: How to use the QPageScroller component. Places components that will appear on screen after user scrolls the page.
keys: QPageScroller
examples: QPageScroller
related:
  - /layout/layout
  - /layout/page
---

The QPageScroller component helps in placing DOM elements / components wrapped by it into a static position within the content area of your QPage, no matter where the user scrolls.

The great advantage of this is that the elements wrapped by this component will never overlap the layout header, footer or drawer(s), even if those are not configured to be fixed. In the latter case, the position will be offset so that the overlap won't occur.
Try it out with a non-fixed footer for example. When user reaches bottom of screen and footer comes into view, the component will shift up so it won't overlap with the footer.

Essentially QPageScroller is very similar to QPageSticky. Whereas a QPageSticky component is always visible, a QPageScroller component only appears after a `scroll-offset` (property) is reached. Once visible, the user can click on it to quickly get back to the top of the page via `duration` property.

<doc-api file="QPageScroller" />

## Usage
::: tip
Since QPageScroller needs a layout and QLayout by default manages the entire window, then for demoing purposes we are going to use containerized QLayouts. But remember that by no means you are required to use containerized QLayouts for QPageScroller.
:::

::: warning
* In order for QPageScroller to work, it must be placed within a QLayout component.
* QPageScroller must be the last child element within its parent, so it can display on top of other content
:::

### Basic

<doc-example title="Basic" file="Basic" />

### Expanded

<doc-example title="Expanded" file="Expanded" />

### Reverse

<doc-example title="Reverse" file="Reverse" />
