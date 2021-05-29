---
title: Layout QPageSticky
desc: How to use the QPageSticky component. Statically place components on the layout without overlapping with header/footer/sidebars.
related:
  - /layout/layout
  - /layout/page
---

The QPageSticky component helps in placing DOM elements / components wrapped by it into a static position within the content area of your QPage, no matter where the user scrolls.

The great advantage of this is that the elements wrapped by this component will never overlap the layout header, footer or drawer(s), even if those are not configured to be fixed. In the latter case, the position will be offset so that the overlap won't occur.
Try it out with a non-fixed footer for example. When user reaches bottom of screen and footer comes into view, the component will shift up so it won't overlap with the footer.

## QPageSticky API
<doc-api file="QPageSticky" />

## Usage
::: tip
Since QPageSticky needs a layout and QLayout by default manages the entire window, then for demoing purposes we are going to use containerized QLayouts. But remember that by no means you are required to use containerized QLayouts for QPageSticky.
:::

::: warning
* In order for QPageSticky to work, it must be placed within a QLayout component.
* QPageSticky must be the last child element within its parent, so it can display on top of other content
:::

### Basic
In the example below, click on the menu buttons to show/hide Drawers, scroll the inner page, and resize the browser window so that the enclosing QLayout hits the Drawer's 700px and 500px breakpoints.

<doc-example title="Basic" file="QPageSticky/Basic" />

### Expanded
In the example below, click on the menu buttons to show/hide Drawers, scroll the inner page, and resize the browser window so that the enclosing QLayout hits the Drawer's 700px and 500px breakpoints.

By using expanded QPageSticky you can, for example, have a page-specific QToolbar as below.

<doc-example title="Expanded" file="QPageSticky/Expanded" />
