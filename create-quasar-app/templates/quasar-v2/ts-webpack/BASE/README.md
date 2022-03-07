# {{ productName }} ({{ name }})

{{ description }}

## Install the dependencies
```bash
{{#if_eq autoInstall "npm"}}
npm install
{{else}}
yarn
{{/if_eq}}
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```
{{#preset.lint}}

### Lint the files
```bash
{{#if_eq autoInstall "npm"}}npm run{{else}}yarn{{/if_eq}} lint
```
{{#if_eq lintConfig "prettier"}}

### Format the files
```bash
{{#if_eq autoInstall "npm"}}npm run{{else}}yarn{{/if_eq}} format
```
{{/if_eq}}
{{/preset.lint}}

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
