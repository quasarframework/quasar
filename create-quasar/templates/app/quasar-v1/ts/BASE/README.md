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
```<% } %>

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://v1.quasar.dev/quasar-cli/quasar-conf-js).
