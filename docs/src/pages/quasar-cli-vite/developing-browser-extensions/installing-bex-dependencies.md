---
title: Installing BEX-specific dependencies
desc: (@quasar/app-vite) How to handle BEX-specific dependencies.
---

Notice the `/src-bex/package.json` file in your generated `/src-bex` folder. The purpose of it is for you to be able to install packages used by the BEX mode directly under this folder (and not pollute the common `/src`).

```tabs /src-bex/package.json
<<| json Javascript |>>
{
  "name": "quasar-bex-app",
  "version": "1.0.0",
  "description": "Quasar BEX Folder",
  "private": true,
  "type": "module"
}
<<| json TypeScript |>>
{
  "name": "quasar-bex-app",
  "version": "1.0.0",
  "description": "Quasar BEX Folder",
  "private": true,
  "type": "module",
  "devDependencies": {
    "@types/chrome": "^0.2.5"
  }
}
```

Installing BEX specific packages:

```tabs
<<| bash PNPM |>>
# run in /src-bex for deps:
pnpm add <deps>

# run in /src-bex for deps used by the build system (eg. @types/chrome)
pnpm add -D <dev-deps>
<<| bash Yarn |>>
# run in /src-bex for deps:
yarn add <deps>

# run in /src-bex for deps used by the build system (eg. @types/chrome)
yarn add -D <dev-deps>
<<| bash NPM |>>
# run in /src-bex for deps:
npm install <deps>

# run in /src-bex for deps used by the build system (eg. @types/chrome)
npm install -D <dev-deps>
<<| bash Bun |>>
# run in /src-bex for deps:
bun add <deps>

# run in /src-bex for deps used by the build system (eg. @types/chrome)
bun add -D <dev-deps>
```
