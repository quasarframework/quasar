---
title: No SSR
desc: The QNoSsr Vue component makes it easy to differentiate content between server-side and client-side.
keys: QNoSsr
related:
  - /quasar-cli/developing-ssr/introduction
---
The QNoSsr component makes sense only if you are creating a SSR website/app.

It avoids rendering its content on the server and leaves that for client only. Useful when you got code that is not isomorphic and can only run on the client side, in a browser.

Alternatively, you can also use it to render content only on server-side and it automatically removes it if it ends up running on a client browser.

## QNoSsr API

<doc-api file="QNoSsr" />

## Usage

### Basic

```html
<q-no-ssr>
  <div>This won't be rendered on server</div>
</q-no-ssr>
```

### Multiple client nodes

```html
<q-no-ssr>
  <div>This won't be rendered on server.</div>
  <div>This won't either.</div>
</q-no-ssr>
```

### Multiple client nodes with tag prop

```html
<q-no-ssr tag="blockquote">
  <div>This won't be rendered on server.</div>
  <div>This won't either.</div>
</q-no-ssr>
```

### Placeholder property

```html
<q-no-ssr placeholder="Rendered on server">
  <div>This won't be rendered on server</div>
</q-no-ssr>
```

### Placeholder slot

```html
<q-no-ssr>
  <div>This won't be rendered on server</div>
  <template v-slot:placeholder>
    <div>Rendered on server</div>
  </template>
</q-no-ssr>
```

### Multiple content in placeholder slot

```html
<q-no-ssr>
  <div>This won't be rendered on server</div>
  <template v-slot:placeholder>
    <div>Rendered on server (1/2)</div>
    <div>Rendered on server (2/2)</div>
  </template>
</q-no-ssr>
```

### Only placeholder slot

```html
<q-no-ssr>
  <template v-slot:placeholder>
    <div>Rendered on server</div>
  </template>
</q-no-ssr>
```
