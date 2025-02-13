<% /* TODO: Consider reworking the AE docs and moving this to the docs */ %>
# Runtime directory

This directory contains runtime files for your app extension. The code here will run in the browser context. Some example use cases for this directory include:

- Distributing a Vue component, directive, plugin, etc.
- Distributing JS/TS code such as constants, composables, utilities, services, etc.
- Creating a Quasar boot file to register from the app extension.

## Instructions

Use `index.ts` to export your runtime code as part of the library. The exported code can then be imported like so:

```js
import { someFunction } from '<%= pkgName %>'
```

If you need more entrypoints(e.g. `<%= pkgName %>/another`) for a good reason, you can create the respective files and add an entry to `package.json > exports`.

### Boot files

For each boot file you create, you will need to add an entrypoint to `package.json > exports`. For example, given a boot file at `./boot/some-boot-file.ts`, you would add the following to `package.json`:

```json
{
  "exports": {
    "./boot/some-boot-file": {
      "types": "./dist/runtime/boot/some-boot-file.d.ts",
      "import": "./dist/runtime/boot/some-boot-file.js"
    },
  }
}
```

Afterwards, you can use the Index API ([`src/index.ts`](../index.ts)) to register the boot file:

```ts
// ...
export default function (api: IndexAPI) {
  // ...
  api.extendQuasarConf((conf, api) => {
    conf.boot!.push('~<%= pkgName %>/boot/some-boot-file');
    // ...
  });
}
```
