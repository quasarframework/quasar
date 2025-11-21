# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Quasar Framework is a Vue.js framework for building cross-platform applications (SPA, SSR, PWA, Mobile Apps via Capacitor/Cordova, Desktop Apps via Electron, and Browser Extensions). This is a pnpm monorepo containing multiple interconnected packages.

## Monorepo Structure

The repository uses pnpm workspaces with the following key packages:

- **ui/** - Core Quasar UI component library (Vue components, directives, plugins, composables, utils)
- **app-vite/** - Quasar CLI with Vite build system (@quasar/app-vite)
- **app-webpack/** - Quasar CLI with Webpack build system (@quasar/app-webpack)
- **vite-plugin/** - Vite plugin for Quasar (@quasar/vite-plugin)
- **cli/** - Quasar CLI wrapper (@quasar/cli)
- **create-quasar/** - Project scaffolding tool
- **icongenie/** - Icon and splash screen generator (separate workspace)
- **extras/** - Icon sets, fonts, and animations (@quasar/extras)
- **docs/** - Documentation site
- **utils/** - Shared utilities (eslint-config, ssr-helpers, babel-preset-app, etc.)

## Package Manager

**Always use pnpm** - The repository enforces pnpm via a preinstall hook. Do not use npm or yarn.

```bash
pnpm i                    # Install all dependencies
```

## Common Commands

### Building

```bash
# Build everything (vite-plugin + ui)
pnpm build

# Build individual packages
cd ui && pnpm build
cd vite-plugin && pnpm build
cd app-vite && pnpm prepare:types
```

The UI package build supports partial builds:
```bash
cd ui
pnpm build js          # Build JavaScript only
pnpm build css         # Build CSS only
pnpm build js types    # Build with type definitions
```

### Linting

```bash
pnpm lint              # Lint all packages in parallel
pnpm lint:root         # Lint root-level files only
pnpm lint:non-workspace # Lint icongenie (not in main workspace)
```

Individual packages have their own lint scripts.

### Testing

```bash
# Run all tests (requires build first)
pnpm test

# UI component tests
cd ui
pnpm test              # Run all UI tests
pnpm test:watch        # Watch mode
pnpm test:watch:ui     # Watch mode with UI
pnpm test:specs        # Run spec tests
pnpm test:specs:ci     # Spec tests in CI mode

# Vite plugin tests
cd vite-plugin
pnpm test              # Run all tests (usage + runtime)
pnpm test:usage        # Test usage patterns
pnpm test:runtime      # Test runtime behavior
pnpm test:watch        # Watch mode
```

The monorepo uses Vitest with a workspace configuration (vitest.workspace.js).

### Development

```bash
# UI package development
cd ui
pnpm dev               # Start dev server (playground)
pnpm dev:ssr           # Start SSR dev server
pnpm dev:umd           # Test UMD build
pnpm dev:build         # Build playground
pnpm dev:build:ssr     # Build playground SSR

# Vite plugin development
cd vite-plugin
pnpm dev               # Start playground dev server
```

## Architecture

### UI Package Architecture

The UI package (`ui/`) is the core of Quasar and follows a modular structure:

**Entry Points:**
- `src/index.dev.js` - Development entry used by @quasar/vite-plugin
- `src/index.ssr.js` - SSR entry
- `src/index.umd.js` - UMD build entry
- `src/install-quasar.js` - Main installation logic

**Core Modules:**
- `src/components/` - 80+ Vue components (QBtn, QTable, QDialog, etc.)
- `src/directives/` - Vue directives (v-ripple, v-touch-pan, etc.)
- `src/plugins/` - Quasar plugins (Platform, Screen, Dark, Notify, Dialog, etc.)
- `src/composables/` - Vue composables (useQuasar, useMeta, useDialogPluginComponent, etc.)
- `src/utils/` - Utility functions (colors, date, format, scroll, etc.)
- `src/css/` - SASS/CSS styles

**Auto-Installed Plugins:**
The following plugins are automatically installed when Quasar is initialized:
- Platform (device/browser detection)
- Body (body classes)
- Dark (dark mode)
- Screen (responsive breakpoints)
- History (navigation history)
- Lang (i18n)
- IconSet (icon management)

**Build System:**
- Build scripts in `ui/build/` generate multiple output formats
- Outputs to `ui/dist/` include client, server, UMD builds, types, API docs, Vetur/Web-types metadata
- Supports RTL CSS generation via postcss-rtlcss

### App CLIs Architecture (app-vite & app-webpack)

Both app CLIs share a similar structure with mode-specific implementations:

**Modes Supported:**
- `spa` - Single Page Application (default port 9000)
- `ssr` - Server-Side Rendering (port 9100)
- `pwa` - Progressive Web App (port 9200)
- `electron` - Electron desktop app (port 9300)
- `cordova` - Cordova mobile app (port 9400)
- `capacitor` - Capacitor mobile app (port 9500)
- `bex` - Browser Extension (port 9600)

**Key Files:**
- `lib/quasar-config-file.js` - Quasar config file parsing and validation
- `lib/app-builder.js` - Build orchestration
- `lib/app-devserver.js` - Development server
- `lib/modes/` - Mode-specific implementations
- `lib/config-tools.js` - Configuration utilities
- `templates/` - Project templates for different modes

**Quasar Config:**
Projects using the CLI are configured via `quasar.config.js` (or .ts) which is processed and validated by the CLI. The config uses esbuild for fast processing.

### Vite Plugin Architecture

The `@quasar/vite-plugin` package provides Vite integration:
- Auto-imports Quasar components
- Configures Vue plugin with Quasar-specific `transformAssetUrls`
- Handles SASS variables injection
- Supports tree-shaking for optimal bundle sizes

## Testing Strategy

### UI Tests
- Component tests in `ui/testing/runtime/` using Vitest + @vue/test-utils
- Spec tests in `ui/testing/specs/` that validate component API consistency
- Specs use AST parsing to ensure components match their JSON definitions

### Vite Plugin Tests
- Usage tests validate plugin configuration
- Runtime tests validate actual Quasar functionality in Vite environment

## Development Guidelines

### Component Development

When working on UI components:
- Components are in `ui/src/components/{component-name}/`
- Each component exports via an `index.js` file
- Component definition includes `.json` file with API metadata (used for docs and type generation)
- CSS is in corresponding SASS files under `ui/src/css/`
- Must pass spec tests that validate the component API

### Code Style

The repository uses ESLint 9+ with flat config:
- Root: `eslint.config.mjs`
- Packages have individual `eslint.config.js` files
- Use `pnpm lint` before committing

### Type Definitions

TypeScript definitions are critical:
- UI package types are in `ui/types/`
- App CLIs have types in their respective `types/` directories
- Build processes generate type definitions
- Use `pnpm prepare:types` in relevant packages

## Working with the Build System

### UI Build Process

The UI build (`ui/build/script.build.js`) orchestrates:
1. JavaScript compilation (ESBuild)
   - Client build (dist/quasar.client.js)
   - Server build (dist/quasar.server.prod.js)
   - UMD builds (dist/quasar.umd.js)
2. CSS compilation (SASS + PostCSS)
   - LTR and RTL variants
   - Individual component CSS
3. Type definitions generation
4. API JSON generation
5. Vetur/Web-types metadata

### Vite Plugin Build

The vite-plugin uses Rollup (via `build/rollup.config.js`) to create CJS and ESM outputs.

## Important Patterns

### Component Registration

Quasar components follow a naming convention:
- Component names start with `Q` (e.g., QBtn, QTable)
- Kebab-case directive names start with `q-` (e.g., q-ripple)
- This regex is used for auto-detection: `/^(Q[A-Z]|q-)/`

### Plugin System

Quasar plugins follow a standard pattern:
```javascript
{
  install: (pluginOpts) => { /* install logic */ },
  __installed: false
}
```

### Composables

Composables are exported from `ui/src/composables/` and provide reactive utilities for common tasks (dialog handling, meta tags, global Quasar instance access, etc.).

## Git Workflow

- Main branch: `dev`
- PR target: `dev`
- CI runs UI tests on PRs via GitHub Actions (`.github/workflows/tests-on-pr.yml`)
- Tests require build artifacts (UI and vite-plugin must be built first)

## Additional Resources

- Documentation: https://quasar.dev
- Contributing Guide: https://quasar.dev/how-to-contribute/contribution-guide
- Issues: https://github.com/quasarframework/quasar/issues
