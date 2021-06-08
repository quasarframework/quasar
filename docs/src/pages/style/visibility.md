---
title: CSS Visibility
desc: The list of CSS classes supplied by Quasar to manage responsiveness and visibility of components and DOM elements.
related:
  - /style/typography
  - /style/positioning
  - /style/spacing
---
There are some CSS classes that you can use out of the box for common functionality.

| Class Name | Description |
| --- | --- |
| `disabled` | Cursor is changed to notify a 'disable' and opacity is set to a lower value. |
| `hidden` | Set `display` to `none`. Compare with below - the class `hidden` means the element will not show _and_ will not take up space in the layout. |
| `invisible` | Set `visibility` to `hidden`. Compare with above - the class `invisible` means the element will not show, but it will still take up space in the layout. |
| `transparent` | Background color is transparent. |
| `dimmed` | Apply dark transparent overlay on top of your element. Do not use on elements which already have **:after** pseudoelement. |
| `light-dimmed` | Apply white transparent overlay on top of your element. Do not use on elements which already have **:after** pseudoelement. |
| `ellipsis` | Truncates text and shows ellipsis when not enough space available. |
| `ellipsis-2-lines` | Truncates text and shows ellipsis when not enough space available on two lines (works only on Webkit browsers). |
| `ellipsis-3-lines` | Truncates text and shows ellipsis when not enough space available on three lines (works only on Webkit browsers). |
| `z-top` | Positions your element on top of any other component, but behind Popovers, Tooltips, Notifications. |
| `z-max` | Positions your element on top of any other component (including Drawer, Modals, Notifications, Layout header/footer, ...) |

## Window Width Related
First of all, let's define what the breakpoints are:

| Window Size | Prefix | Width threshold in pixels |
| --- | --- | --- |
| Extra Small | xs | Up to 599px |
| Small | sm | Up to 1023px |
| Medium | md | Up to 1439px |
| Large | lg | Up to 1919px |
| Extra Large | xl | Bigger than 1920px |

Now on to the window width related CSS classes.

| Class Name | Description |
| --- | --- |
| `xs` | Display only on extra small windows |
| `sm` | Display only on small windows |
| `md` | Display only on medium-sized windows |
| `lg` | Display only on large windows |
| `xl` | Display only on extra large windows |

You can also show some DOM element or component **if it's lower than one of the sizes**. **Same for greater than one of the sizes**. Just attach `lt-` or `gt-` prefixes, which come from "lower than" and "greater than". Example: `lt-md` (display on xs and sm only), `lt-xl` (display on xs, sm, md and lg windows only), `gt-md` (display on greater than medium windows: lg and xl).

::: tip
You can combine the visibility classes with the `inline` class for inline-blocks.

Example: `<span class="gt-sm inline">...</span>`
:::

::: tip
If you want to e.g. show hide based on JavaScript properties, you can use the [Screen Plugin](/options/screen-plugin).
:::

## Platform Related
Visible only on:

| Class Name | Description |
| --- | --- |
| `desktop-only` | Visible only on desktop |
| `mobile-only` | Visible only on mobile |
| `native-mobile-only` | Visible only on Cordova/Capacitor |
| `cordova-only` | Visible only on Cordova wrapped Apps |
| `capacitor-only` | Visible only on Capacitor wrapped Apps |
| `electron-only` | Visible only on Electron wrapped Apps |
| `touch-only` | Visible only on touch capable platforms |
| `platform-ios-only` | Visible only on an iOS platform |
| `platform-android-only` | Visible only on an Android platform |
| `within-iframe-only` | Visible only when entire website is under an IFRAME tag |

Hide on:

| Class Name | Description |
| --- | --- |
| `desktop-hide` | Hide on desktop |
| `mobile-hide` | Hide on mobile |
| `native-mobile-hide` | Hide on Cordova/Capacitor |
| `cordova-hide` | Hide on Cordova wrapped Apps |
| `capacitor-hide` | Hide on Capacitor wrapped Apps |
| `electron-hide` | Hide on Electron wrapped Apps |
| `touch-hide` | Hide on touch capable platforms |
| `platform-ios-hide` | Hide on iOS platform |
| `platform-android-hide` | Hide on Android platform |
| `within-iframe-hide` | Hide only when entire website is under an IFRAME tag |

::: tip
Based on your needs, you might want to also check [Platform Detection](/options/platform-detection) page to see how you can achieve the same effect using Javascript. This latter method allows you to not even render a DOM element or component. It is useful when the rendering process is expensive.
:::

## Orientation Related
| Class Name | Description |
| --- | --- |
| `orientation-portrait` | Visible only when screen orientation is *Portrait* |
| `orientation-landscape` | Visible only when screen orientation is *Landscape* |

## Printing Related
| Class Name | Description |
| --- | --- |
| `print-only` | Visible only on print media - hidden on *screen* media |
| `print-hide` | Visible on *screen* media - hidden on *print* media |
