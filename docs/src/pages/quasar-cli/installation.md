---
title: Quasar CLI Installation
---

Make sure you have Node >=8 and NPM >=5 installed on your machine.

```bash
# Uninstall quasar-cli if you have it from <1.0 versions
$ npm uninstall -g quasar-cli
# or..
$ yarn global remove quasar-cli
# or if that does not remove quasar-cli (mac/linux only):
$ QUASAR=$(which quasar); sudo rm ${QUASAR}

# Node.js >= 8.9.0 is required.
$ npm install -g @quasar/cli
# or:
$ yarn global add @quasar/cli
```

::: tip TIPS
* The v1.0+ CLI is compatible with pre v1.0 project folders too, so you DON'T need to worry that your older projects won't run anymore.
* You are not required to have vue cli installed anymore in order to generate a Quasar project folder.
:::

Then we create a project folder with Quasar CLI:
```bash
# currently installs v0.17, for v1 see below
$ quasar create <folder_name>

## for Quasar v1.0-beta, run this instead:
$ quasar create <folder_name> -b dev
```

Note that you don't need separate projects if you want to build any of the options described above. This one project can seamlessly handle all of them.

To continue your learning about Quasar, you should familiarize yourself with the Quasar CLI in depth, because you will be using it a lot.

## How it works

Quasar CLI is made up of two packages: `@quasar/cli` and `@quasar/app`. The first one is optional and only allows you to create a project folder and globally run Quasar commands. The second package is the heart of it and it gets installed into every Quasar project folder.

Once a project folder has been generated, Quasar CLI will only help in running `@quasar/app`'s commands globally. You don't need it for anything else at this point. To ensure full independence from Quasar CLI you can write npm scripts (in your `package.json`) to run Quasar commands. It is `@quasar/app` (which is specific to each project) that will run all the CLI commands.

Example of adding a few npm scripts into your `package.json`:

```js
// package.json
"scripts": {
  "dev": "quasar dev",
  "build": "quasar build",
  "build:pwa": "quasar build -m pwa"
}
```

The above will allow you to run `$ yarn dev`/`$ npm run dev` or `$yarn build`/`$ npm run build` without the need of a globally installed `@quasar/cli`, should you wish to do so.

Alternatively, you can even use [npx](https://github.com/zkat/npx) to run quasar commands without the need of a globally installed `@quasar/cli`.

```bash
$ npx quasar dev
```
