---
title: Installing Electron-specific dependencies
desc: (@quasar/app-vite) How to handle Electron-specific dependencies.
---

Use `/src-electron/package.json` for dependencies that belong to the Electron main process or its packaging workflow. Keeping them in this workspace prevents Electron-only packages from becoming renderer dependencies.

```json /src-electron/package.json
{
  "name": "quasar-electron-app",
  "version": "1.0.0",
  "description": "Quasar Electron Folder",
  "private": true,
  "type": "module",
  "devDependencies": {
    "electron": "^<installed-version>"
  }
}
```

Quasar installs the selected packaging tool (`@electron/packager` or `electron-builder`) here on the first production build that needs it.

From `/src-electron`, install packages used at runtime by the main process under `dependencies`. Install Electron, packaging tools, type packages, and other build-time tools under `devDependencies`:

```tabs
<<| bash PNPM |>>
# Runtime dependency installed into the packaged app:
pnpm add <deps>

# Build-time dependency:
pnpm add -D <dev-deps>
<<| bash Yarn |>>
# Runtime dependency installed into the packaged app:
yarn add <deps>

# Build-time dependency:
yarn add -D <dev-deps>
<<| bash NPM |>>
# Runtime dependency installed into the packaged app:
npm install <deps>

# Build-time dependency:
npm install -D <dev-deps>
<<| bash Bun |>>
# Runtime dependency installed into the packaged app:
bun add <deps>

# Build-time dependency:
bun add -D <dev-deps>
```

Renderer dependencies imported by code under `/src` belong in the root `package.json` and are bundled by Vite.
