---
title: Quasar Components Transitions
desc: Out of the box CSS transitions for Quasar components.
components:
  - ./TransitionList
---

There are a few Quasar components that implement transitions through `transition-show` / `transition-hide` or `transition-prev` / `transition-next` or simply `transition` props:

- `transition-show` / `transition-hide`
  - [QBtnDropdown](/vue-components/button-dropdown)
  - [QInnerLoading](/vue-components/inner-loading)
  - [QTooltip](/vue-components/tooltip)
  - [QMenu](/vue-components/menu)
  - [QDialog](/vue-components/dialog)
  - [QSelect](/vue-components/select) (through QMenu and QDialog)
  - [QPopupProxy](/vue-components/popup-proxy) (through QMenu and QDialog)

- `transition-prev` / `transition-next`
  - [QCarousel](/vue-components/carousel)
  - [QTabPanels](/vue-components/tab-panels)
  - [QStepper](/vue-components/stepper)

- `transition`
  - [QIntersection](/vue-components/intersection)

We're going to showcase these transitions here.

<transition-list />

Use the names indicated in the captions above for the transition props. Example:

```html
<q-menu
  transition-show="jump-down"
  transition-hide="jump-up"
/>
```
