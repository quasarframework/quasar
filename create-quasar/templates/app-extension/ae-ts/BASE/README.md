<img src="https://img.shields.io/npm/v/<%= pkgName %>.svg?label=<%= pkgName %>">

Compatible with:

- Quasar UI v2 and Vue 3
- Quasar CLI with Vite v1.5+ and v2
- Quasar CLI with Webpack v3.10+ and v4

# Structure

- [/app-extension](app-extension) - App Extension for Quasar CLI
- [/playground](playground) - collection of playground apps to test the UI and App Extension

# Development

```bash
$ <%= packageManager?.name ?? 'pnpm' %> i # install the dependencies

$ <%= packageManager?.name ?? 'pnpm' %> build # build the app-extension. Run this after making any change in ./app-extension

$ <%= packageManager?.name ?? 'pnpm' %> dev:vite # start the app-vite playground
$ <%= packageManager?.name ?? 'pnpm' %> dev:webpack # start the app-webpack playground
```

For more development-related explanation, see:
- [`app-extension/src/runtime/README.md`](app-extension/src/runtime/README.md)
<% if (preset.install) { %>- [`app-extension/src/templates/README.md`](app-extension/src/templates/README.md)<% } %>

# Donate

If you appreciate the work that went into this project, please consider [donating to Quasar](https://donate.quasar.dev).

# License

<%= license %> (c) <%= author %>
