<img src="https://img.shields.io/npm/v/<%= scope.pkgName %>.svg?label=<%= scope.pkgName %>">

Compatible with:

- Quasar UI v2 and Vue 3
- Quasar CLI with Vite v3+

# Structure

- [/app-extension](app-extension) - App Extension for Quasar CLI
- [/playground](playground) - playground app for live testing

# Development

```bash
$ <%= scope.packageManager?.name ?? 'pnpm' %> i # install the dependencies

$ <%= scope.packageManager?.name ?? 'pnpm' %> dev # start the playground; edits to the app-extension reflect on rerun
```

For more development-related explanation, see:

- [App Extension development guide](https://quasar.dev/app-extensions/development-guide/introduction)
- [Runtime files](https://quasar.dev/app-extensions/development-guide/runtime-files)
<% if (scope.preset.install) { %>- [Install templates](https://quasar.dev/app-extensions/development-guide/install-api#template-directory-layout)<% } %>

# Donate

If you appreciate the work that went into this project, please consider [donating to Quasar](https://donate.quasar.dev).

# License

MIT (c) <%= scope.author %>
