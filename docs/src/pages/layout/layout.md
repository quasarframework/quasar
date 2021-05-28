---
title: Layout
desc: How to use the QLayout component. Manages the whole window of your Quasar app.
keys: QLayout
related:
  - /layout/header-and-footer
  - /layout/drawer
  - /layout/page
  - /layout/page-sticky
  - /layout/page-scroller
  - /vue-components/floating-action-button
components:
  - layout/ViewProp
  - layout/ViewPlay
---
The QLayout is a component designed to manage the entire window and wrap page content with elements such as a navigational bar or a drawer. Multiple pages can share the same QLayout, so the code is reusable, which is one of their key points.

**QLayout is NOT mandatory**, but it does help you to better structure your website/app. It has a number of features which offer you major benefits in simplifying your website/app's layout design, right out of the box.

## QLayout API
<doc-api file="QLayout" />

## Layout Builder
Scaffold your layout(s) by clicking on the button below.

::: warning
The Layout Builder might use components not already inserted into quasar.conf.js.

You are likely going to need the following components - QLayout, QHeader, QToolbar, QToolbarTitle, QBtn, QAvatar, QTabs, QRouteTab, QDrawer, QPageContainer, QFooter.
:::

::: tip
Keep an eye on your developer console for handy helpers on which components are being used but not declared in your quasar.conf.js file.
:::

<q-btn push color="brand-primary" icon-right="launch" label="Layout Builder" type="a" href="layout-builder" target="_blank" rel="noopener noreferrer" />

## Usage

::: warning Using margin CSS will break the layout
QLayout depends on taking up the whole screen and so QPageContainer, QHeader, QFooter and QLayoutDrawer positions are managed by it (through the `view` prop). You **cannot** use *CSS margins* as a style neither on QLayout itself nor on any of the QLayout components mentioned above. However you can safely use *CSS padding*.
:::

::: tip
If your layout uses Vue Router sub-routes (recommended), then it makes sense to use Vue's `<router-view />` component, which is just a placeholder where sub-routes are injected. For more information, please read [Routing with Layouts and Pages](/layout/routing-with-layouts-and-pages).
:::

### Understanding the "view" prop
Quasar introduces a unique and excellent layout concept, which allows you to easily structure layouts to work in certain ways, by simply changing a short string notation.

To explain how this works, imagine your Layout is a 3x3 matrix of containers (depicted in blue below). The first row of containers would be the header and the last row would be the footer. The first column of containers would be the "left" and last column would be the "right". The center of the matrix, below the header and above the footer, would be the page or main content container.

This matrix of containers or "QLayout View" can be represented by a string that you should supply to the `view` property of QLayout. This string must contain exactly 11 characters:

- 3 defining the header row
- then a space
- 3 defining the middle row
- a space
- then 3 defining the footer row

<view-prop />

The letters shown above are also case sensitive. For example, using at least one "L" (uppercase character instead of lowercase) will make your layout left side (drawer) be in a fixed position. Same applies for "H" (header), "F" (footer) and finally "R" (right side / drawer).

<view-play />

For example, if you want your layout's right side / drawer to be placed on the right of the header, page and footer, you'd use `hhr lpr ffr`. If you'd like to also make it fixed, just transform one `r` character to uppercase, like this: `hhr lpR ffr`, or `hhR lpr ffr` or `hhr lpr ffR`.

These settings are completely up to you to use as you'd like. You could even go wild with a setup like this: `lhh LpR ffr`. Try it out!

<q-btn push color="red" icon-right="launch" label="Layout Builder" type="a" href="layout-builder" target="_blank" rel="noopener noreferrer" />

::: warning
* It is important that you specify all sections of a QLayout, even if you don't use them. For example, even if you don't use footer or right side drawer, still specify them within your QLayout's `view` prop.
* When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with  "l/r" or "L/R". Also, **if on iOS platform and QLayout is containerized**, the fixed position will also be forced upon QDrawer due to platform limitations that cannot be overcome.
:::

### Containerized QLayout
By default, QLayout is managing the entire window. However, you can also use QLayout as a container (with specific height and width) to isolate it somewhere in your pages.

::: warning
Please note that it **requires a CSS height (or min-height) being set explicitly**, otherwise it can't and it won't work.
:::

In the example below, there is a containerized QLayout with drawers on each side (breakpoint of 700px on the left-side drawer and 500px on the right-side drawer). The breakpoint does not refer to the window width, but to the actual width of the QLayout container.

<doc-example title="Containerized QLayout" file="QLayout/Container" />

<doc-example title="In a QDialog" file="QLayout/ContainerDialog" />
