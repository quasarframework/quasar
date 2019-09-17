---
title: Quasar CLI Installation
desc: How to install the Quasar CLI on your development machine.
---

Make sure you have Node >=8 and NPM >=5 installed on your machine.

```bash
# Node.js >= 8.9.0 is required.
$ npm install -g @quasar/cli
```

Then we create a project folder with Quasar CLI:

```bash
$ quasar create <folder_name>
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

The above will allow you to run `$ yarn dev` or `$yarn build` without the need of a globally installed `@quasar/cli`, should you wish to do so.

Alternatively, you can even use [npx](https://github.com/zkat/npx) to run quasar commands without the need of a globally installed `@quasar/cli`.

```bash
$ npx quasar dev
```
