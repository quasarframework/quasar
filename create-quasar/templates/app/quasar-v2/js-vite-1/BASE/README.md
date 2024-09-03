# <%= productName %> (<%= name %>)

<%= description %>

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```
<% if (preset.lint) { %>

### Lint the files
```bash
yarn lint
# or
npm run lint
```
<% if (lintConfig === 'prettier') { %>

### Format the files
```bash
yarn format
# or
npm run format
```
<% } %>
<% } %>

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
