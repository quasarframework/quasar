---
title: Typography
---
We'll handle the typography supplied by Quasar in the sections below.

## Headings
<div v-for="heading in [
    { label: 'Headline 1', cls: 'text-h1', equivalent: 'h1' },
    { label: 'Headline 2', cls: 'text-h2', equivalent: 'h2' },
    { label: 'Headline 3', cls: 'text-h3', equivalent: 'h3' },
    { label: 'Headline 4', cls: 'text-h4', equivalent: 'h4' },
    { label: 'Headline 5', cls: 'text-h5', equivalent: 'h5' },
    { label: 'Headline 6', cls: 'text-h6', equivalent: 'h6' },
    { label: 'Subtitle 1', cls: 'text-subtitle1' },
    { label: 'Subtitle 2', cls: 'text-subtitle2' },
    { label: 'Body 1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.', cls: 'text-body1' },
    { label: 'Body 2. Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate aliquid ad quas sunt voluptatum officia dolorum cumque, possimus nihil molestias sapiente necessitatibus dolor saepe inventore, soluta id accusantium voluptas beatae.', cls: 'text-body2' },
    { label: 'Caption text', cls: 'text-caption' },
    { label: 'Overline', cls: 'text-overline' }
  ]"
  class="row items-center q-mb-lg"
  :key="heading.label"
>
  <div class="col-sm-3 col-12">
    <q-badge color="primary">.{{ heading.cls }}</q-badge>
    <q-badge color="secondary" class="q-ml-sm" v-if="heading.equivalent">{{ heading.equivalent }}</q-badge>
  </div>
  <div class="col-sm-9 col-12" :class="heading.cls">
    {{ heading.label }}
  </div>
</div>

## Font Weights
<div v-for="weight in ['thin', 'light', 'regular', 'medium', 'bold', 'bolder']" class="row items-center q-mb-md" :key="weight">
  <div class="col-sm-3 col-12">
    <q-badge color="primary">.text-weight-{{ weight }}</q-badge>
  </div>
  <div class="col-sm-9 col-12 q-mb-none q-pl-md q-pt-sm q-pb-sm">
    <div :class="`text-weight-${weight}`"> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</div>
  </div>
</div>

## CSS Helper Classes
| Class Name | Description |
| --- | --- |
| `text-right` | Align text to the right |
| `text-left` | Align text to the left |
| `text-center` | Align text to the center |
| `text-justify` | Text will be justified |
| `text-truncate` | Applies all CSS tweaks to truncate text when container is too small |
| `text-bold` | Text will be in bold |
| `text-italic` | Text will be in italic |
| `text-no-wrap` | Non wrapable text (applies `white-space: nowrap`) |
| `text-uppercase` | Transform text to uppercase |
| `text-lowercase` | Transform text to lowercase |
| `text-capitalize` | Capitalize first letter of the text |

## Default Font
The default webfont embedded is [Roboto](https://fonts.google.com/specimen/Roboto). **But it is not required**. You can use whatever font(s) you like.

Roboto comes with 5 different font weights you can use: 100, 300, 400, 500, 700.

This is where Roboto font comes embedded by default, if you are looking to remove it:

```js
// file: /quasar.conf.js
extras: [
  'roboto-font'
]
```
