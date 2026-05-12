# Quasar AE <%= scope.name %> Playground

Playground for Quasar AE <%= scope.name %>

## Install the dependencies

<% if (scope.packageManager) { %>```bash
<%= scope.packageManager.name %> install
```<% } else { %>```bash
# One of the following, depending on your package manager
npm install
yarn install
pnpm install
bun install
```<% } %>

### Start the app in development mode (hot-code reloading, error reporting, etc.)

<% if (scope.packageManager) { %>```bash
<%= scope.packageManager.name %> run dev
```<% } else { %>```bash
# One of the following, depending on your package manager
npm run dev
yarn dev
pnpm dev
bun dev
```<% } %>

### Lint the files

<% if (scope.packageManager) { %>```bash
<%= scope.packageManager.name %> run lint
```<% } else { %>```bash
# One of the following, depending on your package manager
npm run lint
yarn lint
pnpm lint
bun lint
```<% } %>

### Format the files

<% if (scope.packageManager) { %>```bash
<%= scope.packageManager.name %> run format
```<% } else { %>```bash
# One of the following, depending on your package manager
npm run format
yarn format
pnpm format
bun format
```<% } %>

### Build the app for production

<% if (scope.packageManager) { %>```bash
<%= scope.packageManager.name %> run build
```<% } else { %>```bash
# One of the following, depending on your package manager
npm run build
yarn build
pnpm build
bun build
```<% } %>

### Customize the configuration

See [Configuring quasar.config file](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
