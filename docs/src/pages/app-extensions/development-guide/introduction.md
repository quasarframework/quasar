---
title: App Extension Development
desc: How to setup your machine for a Quasar App Extension development and getting started quickly.
scope:
  appExtensionTree:
    l: "."
    c:
    - l: package.json
    - l: src
      c:
      - l: index.js
        e: Described in Index API
      - l: install.js
        e: Described in Install API
      - l: prompts.js
        e: Described in Prompts API
      - l: uninstall.js
        e: Described in Uninstall API
  uiKitTree:
    l: "."
    c:
    - l: app-extension
      c:
      - l: package.json
      - l: src
        c:
        - l: index.js
          e: Described in Index API
        - l: install.js
          e: Described in Install API
        - l: prompts.js
          e: Described in Prompts API
        - l: uninstall.js
          e: Described in Uninstall API
    - l: ui
      c:
      - l: package.json
      - l: build
        e: build scripts
      - l: dev
        e: Quasar app for testing component/directive
      - l: src
        c:
        - l: components
          e: "(optional) Folder for your component(s)"
          c:
          - l: Component.js
            e: "(optional) Code for your component(s)"
          - l: Component.sass
            e: "(optional) Sass for your component(s)"
        - l: directives
          e: "(optional) Folder for your directive(s)"
          c:
          - l: Directive.js
            e: "(optional) Code for your directive(s)"
          - l: Directive.sass
            e: "(optional) Sass for your directive(s)"
        - l: index.common.js
          e: CommonJS entry point
        - l: index.esm.js
          e: ESM entry point
        - l: index.umd.js
          e: UMD entry point
        - l: vue-plugin.js
          e: Exports the associated Vue plugin
        - l: index.sass
          e: Exports the associated SASS files
---

This section of the docs deals with creating your own App Extensions.

It is assumed you have already installed one of the official App Extensions. Having this experience at your disposal is going to be very valuable when you start building your own App Extensions. If you run into problems, please visit our Discord server's channel `#app-extensions`.

## Getting started

An App Extension is an npm package. There are two official kits for creating App Extensions:

1. App Extension (AE) kit
2. UI kit

### App Extension (AE) kit

If your app extension does _not_ involve UI (i.e. does _not_ have components or directives) then use the AE kit. An example of this would be an extension that creates a boot file only.

### UI kit

If your app extension does involve UI (i.e. does have components or directives) then use the UI kit. An example of this would be an extension that provides a UI element for use in your app. This has a `ui` folder for creating your component/directive, a `ui/dev` Quasar application for testing your component/directive in isolation, and an `app-extension` folder for creating the App Extension that will be used for injecting your component/directive via the Quasar CLI into a Quasar app. The UI kit can also be used such that your component/directive can also be used with the Quasar Vite plugin or Vue CLI or UMD.

### 3rd party integration

If your objective is to install a 3rd-party library into Vue, then it depends upon the library...

- If you also aim to provide some UI components or such that uses that Vue plugin, you should use the _UI Kit_. This would be a good choice for including something like a Calendar extension.
- If the only objective is to load it through a simple `app.use(SomeVuePlugin)` in a boot file, and maybe some config updates and such, the _AE Kit_ may be a better choice. This is a good choice for example for something like including Axios.

### Creating the App Extension

```bash
$ yarn create quasar
# or
$ npm init quasar

# pick the AppExtension option
```

It will prompt you about your specific needs. Do you need an install script, an uninstall script, will you be prompting the user with some questions? Pick only what you will be using. You can manually add these later if you decide otherwise.

For the sake of this documentation page, let's assume we answered with `my-ext` to the App Extension `ext-id` question (regarding the prompts above). Remember that the folder name for the App Extension source folder can be different from the actual `ext-id`. At the end, we will publish our new npm package (`quasar-app-extension-my-ext`).

Based on your response, Quasar CLI will create a folder for your App Extension’s source code that will have the following structure:

The app-extension kit:

<doc-tree :def="scope.appExtensionTree" />

The ui kit:

<doc-tree :def="scope.uiKitTree" />

Except for `src/index.js` (from the `app-extension` kit) or `app-extension/src/index.js` (from the `ui` kit) , all the other files are optional. You can manually add or remove them at any point in time.

When using the `UI` kit, you will have two npm packages; one for the App Extension and one for the UI module. For testing with the `dev` app, from the `ui` folder type `yarn dev`. Create pages in the `dev` folder for testing and they will automatically be injected into the test app. Also, check out the `scripts` section in the `package.json` to see what you have available. When you `yarn build`, a `dist` folder will be created and populated with various types of packages (common, esm, and umd).

## App Extension Scripts description

| Name               | Description                                               |
| ------------------ | --------------------------------------------------------- |
| `src/prompts.js`   | Handles the prompts when installing the App Extension     |
| `src/install.js`   | Extends the installation procedure of the App Extension   |
| `src/index.js`     | Is executed on `quasar dev` and `quasar build`            |
| `src/uninstall.js` | Extends the uninstallation procedure of the App Extension |

## Handling package dependencies

If your App Extension has its own dependencies over some packages in order for it to be able to run (except for packages supplied by Quasar CLI, like "quasar", "@quasar/extras", "@quasar/app" -- you should use "api.compatibleWith()" for those in your /install.js and /index.js scripts -- check [Install API](/app-extensions/development-guide/install-api) and [Index API](/app-extensions/development-guide/index-api)), then yarn/npm installing them into your App Extension folder will supply them into the hosting app.

Example: You are creating a UI component that depends on "my-table" npm package (name is bogus, just for making a point here), then you should yarn/npm install "my-table" in your App Extension folder.

::: warning
Never yarn/npm install packages that are supplied by the Quasar CLI, because App Extensions should not be so intrusive and force the user to use a certain Quasar version. Instead, make use of "api.compatibleWith()" for those, which is equivalent to softly saying "Sorry, you need to install this version of Quasar if you want to take advantage of my App Extension".
:::

## Manually testing

We need to create a Quasar project folder to be able to test it while we develop the extension:

```bash
$ yarn create quasar
# or
$ npm init quasar

# pick "App with Quasar CLI"
```

### Install and prompts scripts

::: tip
Learn more about what you can do with the [Prompts API](/app-extensions/development-guide/prompts-api) and the [Install API](/app-extensions/development-guide/install-api).
:::

Inside the testing Quasar project folder, we manually add our App Extension. Notice that we are not specifying the npm package name (it's not published yet!) but a path to our App Extension folder where we develop it, since we want to test unpublished work:

```bash
$ yarn add --dev file://path/to/our/app/ext/app-extension
# or
$ yarn add --dev link://path/to/our/app/ext/app-extension
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

Additionally, if you would like to have HMR (hot module reload) capabilities in your test app while developing your App Extension, then your `quasar.config.js > devServer > watchFiles` would look like this:

```js
// quasar.config.js for
// Quasar CLI with Webpack (@quasar/app-webpack)

devServer: {
  // be sure to change <myextid> below to
  // your App Extension name:
  watchFiles: [
    '/node_modules/quasar-app-extension-<myextid>/*'
  ]
}
```

#### @quasar/app-webpack

You might want to extend the Webpack config. Assuming you are using the [`chainWebpack`](/quasar-cli-webpack/handling-webpack#usage-with-quasar-conf-js) method, your `quasar.config.js > build > chainWebpack` should look like this:

```js
chainWebpack (chain) {
  chain.merge({
    snapshot: {
      managedPaths: []
    }
  })
},
```

#### @quasar/app-vite

You might want to extend the Vite config. Assuming you are using the [`extendViteConf`](/quasar-cli-vite/handling-vite#usage-with-quasar-conf-js) method, your `quasar.config.js > build > extendViteConf` should look like this:

```js
extendViteConf (viteConf, { isClient, isServer }) {
  // do stuff in-place with viteConf
},
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
