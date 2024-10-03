# Quasar App Extension <%= name %> (<%= pkgName %>)

> TODO: Add a short description of your App Extension. What does it do? How is it beneficial? Why would someone want to use it?

[![npm](https://img.shields.io/npm/v/<%= pkgName %>.svg?label=<%= pkgName %>)](https://www.npmjs.com/package/<%= pkgName %>)
[![npm](https://img.shields.io/npm/dt/<%= pkgName %>.svg)](https://www.npmjs.com/package/<%= pkgName %>)

# Install

```bash
quasar ext add <%= name %>
```

Quasar CLI will retrieve it from NPM and install the extension.

## Global component typings

Add this to `src/quasar.d.ts` to load the global component typings:
```ts
// Load global component typings
/// <reference types="<%= pkgName %>" />
```

## Prompts

> TODO: If your app extension uses prompts, explain them here, otherwise remove this section and remove prompts.ts file.

# Uninstall

```bash
quasar ext remove <%= name %>
```

# Info

> TODO: Add longer information here that will help the user of your app extension.

# Other Info

> TODO: Add other information that's not as important to know

# Development

See [the root README](../README.md) for more information.

# Donate

If you appreciate the work that went into this App Extension, please consider [donating to Quasar](https://donate.quasar.dev).

# License

<%= license %> (c) <%= author %>
