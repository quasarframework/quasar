---
title: Quasar Components Transitions
components:
  - transitions/TransitionList
---

There are a few Quasar components that mention about transitions through `transition-show`/`transition-hide` or `transition-prev`/`transition-next` or simply `transition` props. We're going to showcase these transitions here.

<transition-list />

Use the names indicated in the captions above for the transition props. Example:

```html
<q-menu
  transition-show="jump-down"
  transition-hide="jump-up"
/>
```
