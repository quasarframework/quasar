---
title: Other CSS Helper Classes
desc: The list of CSS helper classes for mouse, size, orientation and border that are supplied by Quasar.
---
There are a lot of CSS classes that you can use while writing your Vue templates. Very handy to ease the complexity of your VueModels and templates.

The list below is not complete. Also check the other CSS documentation pages like Typography, Visibility, Shadows, Positioning.

## Mouse Related

| Class Name | Description |
| --- | --- |
| `non-selectable` | User won't be able to select DOM node along with its text |
| `no-pointer-events` | DOM element does not become a target of mouse events - clicks, hover and so on |
| `all-pointer-events` | The opposite of `no-pointer-events` |
| `cursor-pointer` | Change mouse pointer on DOM element to look as if on a clickable link |
| `cursor-not-allowed` | Change mouse pointer on DOM element to look as if action will not be carried out |
| `cursor-inherit` | Change mouse pointer on DOM element to look as the same as parent option |
| `cursor-none` | No mouse cursor is rendered |

## Scroll Related

| Class Name | Description |
| --- | --- |
| `scroll` | Applies CSS tweaks to make scroll work at its best on ALL platforms |
| `no-scroll` | Hides scrollbars on the DOM node |
| `overflow-auto` | Sets overflow to auto |
| `overflow-hidden` | Sets overflow to hidden |
| `overflow-hidden-y` | Sets overflow to hidden on the y-axis |
| `no-scrollbar` | Removes the scrollbar |

## Size Related
| Class Name | Description |
| --- | --- |
| `fit` | Width and Height is set to 100% |
| `full-height` | Height is set to 100% |
| `full-width` | Width is set to 100% |
| `window-height` | Height is set to 100vh with top and bottom margins 0 |
| `window-width` | Width is set to 100vw with left and right margins 0 |
| `block` | Sets `display` property set to `block` |

## Orientation Related
| Class Name | Description |
| --- | --- |
| `rotate-45` | Rotate by 45 degrees |
| `rotate-90` | Rotate by 90 degrees |
| `rotate-135` | Rotate by 135 degrees |
| `rotate-180` | Rotate by 180 degrees |
| `rotate-225` | Rotate by 225 degrees |
| `rotate-270` | Rotate by 270 degrees |
| `rotate-315` | Rotate by 315 degrees |
| `flip-horizontal` | Flip DOM element horizontally |
| `flip-vertical` | Flip DOM element vertically |

## Border Related
| Class Name | Description |
| --- | --- |
| `no-border` | Removes any border |
| `no-border-radius` | Removes any radius the border might have |
| `no-box-shadow` | Removes any applied box-shadow |
| `no-outline` | Removes any outline applied on the border |
| `rounded-borders` | Applies a generic border radius |
| `borders-radius-inherit` | Inherit border radius from the parent element (**v1.9+**) |
