<% /* TODO: Consider reworking the AE docs and moving this to the docs */ %>
# Runtime directory

This directory contains runtime files for your app extension. The code here will run in the browser context. Some example use cases for this directory include:

- Distributing a Vue component, directive, plugin, etc.
- Distributing JS/TS code such as constants, composables, utilities, services, etc.
- Creating a Quasar boot file to register from the app extension.

## Instructions

Use `index.ts` to export your runtime code as part of the library. The exported code can then be imported like so:

```js
import { someFunction } from '<%= scope.pkgName %>'
```

If you need more entrypoints(e.g. `<%= scope.pkgName %>/another`) for a good reason, you can create the respective files and add an entry to `package.json > exports`.

### Boot files

The default `package.json > exports` block contains a `./*` entry mapped to `./src/runtime/*`, so any boot file you place under `./src/runtime/boot/` is reachable without further config. For example, a boot file at `./src/runtime/boot/some-boot-file.ts` is available as `<%= scope.pkgName %>/boot/some-boot-file` automatically.

If you want a more explicit entry (e.g., to override or document it), add it to `package.json > exports`:

```json
{
  "exports": {
    "./boot/some-boot-file": "./src/runtime/boot/some-boot-file.ts"
  }
}
```

Afterwards, you can use the Index API ([`src/index.ts`](../index.ts)) to register the boot file:

```ts
// ...
export default function (api: IndexAPI) {
  // ...
  api.extendQuasarConf((conf, api) => {
    conf.boot!.push('~<%= scope.pkgName %>/boot/some-boot-file');
    // ...
  });
}
```
