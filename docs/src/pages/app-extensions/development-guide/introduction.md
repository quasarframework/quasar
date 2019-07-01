---
title: App Extension Development
desc: How to setup your machine for a Quasar App Extension development and getting started quickly.
---

This section of the docs deals with creating your own App Extensions.

It is assumed you have already installed one of the official App Extensions. Having this experience at your disposal is going to be very valuable when you start building your own App Extensions. If you run into problems, please visit our Discord server's channel `#app-extensions`.

## Getting started
An App Extension is an npm package. We will be using the official App Extension starter kit to create one.

```bash
$ quasar create my-ext --kit app-extension
```

It will prompt you about your specific needs. Do you need an install script, an uninstall script, will you be prompting the user with some questions? Pick only what you will be using. You can manually add these later if you decide otherwise.

For the sake of this documentation page, let's assume we answered with `my-ext` to the App Extension `ext-id` question (regarding the prompts above). Remember that the folder name for the App Extension source folder can be different from the actual `ext-id`. At the end, we will publish our new npm package (`quasar-app-extension-my-ext`).

Based on your response, Quasar CLI will create a folder for your App Extension’s source code that will have the following structure:

```bash
.
├── package.json
└── src
    ├── index.js      # Described in Index API
    ├── install.js    # Described in Install API
    ├── prompts.js    # Described in Prompts API
    └── uninstall.js  # Described in Uninstall API
```

Except for `src/index.js`, all the other files are optional. You can manually add or remove them at any point in time.

## Scripts description

| Name | Description |
| --- | --- |
| `src/prompts.js` | Handles the prompts when installing the App Extension |
| `src/install.js` | Extends the installation procedure of the App Extension |
| `src/index.js` | Is executed on `quasar dev` and `quasar build` |
| `src/uninstall.js` | Extends the uninstallation procedure of the App Extension |

## Manually testing

We need to create a Quasar project folder to be able to test it while we develop the extension:

```bash
$ quasar create test-app
```

### Install and prompts scripts

::: tip
Learn more about what you can do with the [Prompts API](/app-extensions/development-guide/prompts-api) and the [Install API](/app-extensions/development-guide/install-api).
:::

Inside the testing Quasar project folder, we manually add our App Extension. Notice that we are not specifying the npm package name (it's not published yet!) but a path to our App Extension folder where we develop it, since we want to test unpublished work:

```bash
$ yarn add --dev file://path/to/our/app/ext/root
# or
$ yarn add --dev link://path/to/our/app/ext/root
```
You will need to figure out which command works best for your environment.

::: warning
There have been many reports of problems linking via `file:` and `link:`. This is outside of Quasar's reach, but is likely to do with your development environment, aka your mileage with Windows will vary.
:::

We then invoke it. The invoking procedure assumes that the App Extension's package is already yarn/npm installed (which we did earlier) and skips that step:

```bash
# we said our <ext-id> will be "my-ext", so:
$ quasar ext invoke my-ext
```

This will trigger the installation of our new App Extension. You need to redo these two steps each time you make changes and you want to test them.

Additionally, if you would like to have HMR (hot module reload) capabilities in your test app while developing your App Extension, then your `quasar.conf.js > devServer > watchOptions` would look like this:

```js
// quasar.conf.js
devServer: {
  watchOptions: {
    ignored: [
      'node_modules',
      
      // be sure to change <myextid> below to
      // your App Extension name:
      '!node_modules/quasar-app-extension-<myextid>'
    ]
  }
}
```

### Uninstall script

::: tip
Learn more about what you can do with the [Uninstall API](/app-extensions/development-guide/uninstall-api).
:::

Assuming you've installed your App Extension following the section above, we can now test the uninstall script (if you have any):

```bash
$ quasar ext uninvoke my-ext
```

The command above similarly does not modify or remove the npm package from package.json and node_modules. It simply calls the uninstall script and removes it from the registered/installed App Extensions list in your testing Quasar app project folder. Your end-user will however call `$ quasar ext remove my-ext` to uninstall it, which also uninstalls the npm package.

You need to redo these install steps and issue the uninvoke command each time you make changes to the uninstall script and you want to test them.

### Index script

In the sections above we described how to test the prompts, install and uninstall scripts. Now it's time for the index script, which is the heart of your App Extension.

This is where you can tamper with all `quasar.config.js` options, extend the Webpack configuration, register Quasar CLI commands, start up external services required for developing your app and many more.

As a result, the index script is run each time `$ quasar dev` and `$ quasar build` are executed.

In order to test the index script, you can repeat the uninstall and install procedures described above each time you change something in the App Extension script code. But it becomes very tedious. If you are developing on a Unix OS (MacOS, Linux), you can take advantage of the `yarn link` command which creates a [symbolic link](https://en.wikipedia.org/wiki/Symbolic_link) from the Quasar testing app's node_modules folder to the folder of your extension:

```bash
$ cd /path/to/app/extension/folder

# we register the extension through yarn
$ yarn link

$ cd /path/to/quasar/testing/app/folder

$ yarn link quasar-app-extension-<ext-id>
# in our demo case, it's this:
# $ yarn link quasar-app-extension-my-ext
```

Remember that if you need to `yarn/npm install` any dependencies into **your** App Extension, then you must also uninstall your App Extension and re-install it in your test app:

```bash
$ cd /path/to/app/extension/folder

# run yarn/npm command (install/uninstall, etc)

# then

$ cd /path/to/quasar/testing/app/folder

# Uninstall the app ext
$ quasar ext uninvoke my-ext

# Re-install the app ext
$ quasar ext invoke my-ext
```

You really only need to `quasar ext invoke my-ext` (install) the App Extension to re-install it. The above information is for completeness.

::: warning
There have been many reports of problems with `yarn link` on Windows. This is outside of Quasar's reach, but is likely to do with your development environment, aka your mileage with Windows will vary.
:::

::: tip
Learn more about what you can do with the [Index API](/app-extensions/development-guide/index-api).
:::

## Publishing
When you finalized your App Extension and you're ready to deploy it, all you need to do is to publish it to the npm repository.

Inside of your App Extension folder, run [yarn publish](https://yarnpkg.com/lang/en/docs/cli/publish/) or [npm publish](https://docs.npmjs.com/cli/publish). Both do the same thing.

::: warning
It's important to remember to NOT strip out the `quasar-app-extension-` prefix from the `name` property of your extension's `package.json`, otherwise Quasar CLI will not recognize it.
:::
