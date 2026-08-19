---
title: Baseline fixture, codeblocks
desc: Exercises the fence renderer, titles, attr encoding and tabs.
---

## Code blocks

```js
const plain = 'fence without a title'
```

```bash /project folder
$ quasar dev
```

```html src/App.vue
<template>
  <div>"quotes" & <angle> brackets exercise encodeForAttr</div>
</template>
```

```js
import { Notify } from 'quasar'
```

```ruby
puts 'unsupported language falls back to text'
```

## Tabs

```tabs A titled tab set
<<| js First |>>
const first = true
<<| ts |>>
const second: boolean = true
```
