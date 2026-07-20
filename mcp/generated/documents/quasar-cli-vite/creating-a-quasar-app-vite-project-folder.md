---
title: Creating a @quasar/app-vite Project
description: (@quasar/app-vite) How to create a Project folder with @quasar/app-vite.
canonical: https://quasar.dev/quasar-cli-vite/creating-a-quasar-app-vite-project-folder
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

::: tip Requirements:

- Node.js v22+
- PNPM v11+ (recommended), Yarn v1 classic, NPM or Bun

:::

## Spawn a project folder

```tabs
<<| bash PNPM |>>
# optional, if you don't have it already:
pnpm add -g @quasar/cli

# now create the project folder:
pnpm create quasar@latest
<<| bash Yarn |>>
# optional, if you don't have it already:
yarn global add @quasar/cli

# now create the project folder:
yarn create quasar
<<| bash NPM |>>
# optional, if you don't have it already:
npm i -g @quasar/cli

# now create the project folder:
npm init quasar@latest
<<| bash Bun |>>
# optional, if you don't have it already:
bun add -g @quasar/cli

# now create the project folder:
bun create quasar@latest
```

Pick `App with Quasar CLI`.

::: tip
Under the cover, the package managers globally install our `create-quasar` package and run it. It is NOT recommended, however, to manually install this package yourself because you can easily get out of sync with the "latest" version. We push updates constantly!
:::

## Optional params

```
Usage
  [dir] [options]

  # examples:
  my-app --template app --engine vite-3 --defaults
  --template ae --preset prompts --preset oxlint --defaults

Options
  --template, -t  Type of project to create: app | ae
  --overwrite, -o Overwrite existing dir if it exists
  --preset        Preset to apply (can be used multiple times)
                  - template "app" presets:
                    typescript, sass, oxlint, eslint, i18n, pinia, fbr (filename-based routing)
                  - template "ae" presets:
                    typescript, oxlint, prompts, install, uninstall
  --name          Name of the project for package.json (must be a valid npm package name)
  --author        Author name for package.json
  --no-git        Do not initialize a git repository
  --install, -i   When invoked through a package manager it's a boolean (eg. --install)
                  Otherwise, the package manager to auto-install with:
                    --install pnpm
                    --install yarn
                    --install npm
                    --install bun

  --engine, -e    (ONLY for template "app") Quasar App Local CLI to use
                    Please note that these do NOT refer to the version of
                    Vite, but rather to the @quasar/app-vite version to use:
                      vite-3 or vite-2
  --product       (ONLY for template "app") Product name for the app

  --defaults, -d  Use default values for the remaining non-specified options
  --no-color      Disable colored output
  --help, -h      Displays this message
```

Examples:

```bash
pnpm create quasar@latest my-app --template app --engine vite-3
pnpm create quasar@latest --template ae --preset prompts --preset oxlint
```

By using the `--defaults` option, you are telling our script to fill in with the default values for the remaining non-specified options. This can make the process not requiring to be prompted at all.
