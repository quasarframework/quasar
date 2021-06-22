---
title: Configure VS Code
desc: How to configure VSCode for best usage with Quasar.
---

::: tip
This guide assumes you have already installed Quasar CLI 1.0 or greater and Visual Studio Code.
:::

## Standard ES-Lint rules

Without some customizations the default formatting in VS Code will generate a seemingly endless number of errors when `quasar dev` or `quasar build` commands are run because they include a call to es-lint with the ruleset specified when you create a project. The configuration in this guide is for the standard ruleset.

### Install VS Code Extensions for Standard

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)

### Update VS Code settings file for Standard

To edit the settings, use the command `Open Settings JSON` in the Command Palette in the View menu (ctrl+shift+p).

```js
{
  "editor.formatOnPaste": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
      "source.fixAll": true
  },
  "javascript.format.insertSpaceBeforeFunctionParenthesis": true,
  "javascript.format.placeOpenBraceOnNewLineForControlBlocks": false,
  "javascript.format.placeOpenBraceOnNewLineForFunctions": false,
  "typescript.format.insertSpaceBeforeFunctionParenthesis": true,
  "typescript.format.placeOpenBraceOnNewLineForControlBlocks": false,
  "typescript.format.placeOpenBraceOnNewLineForFunctions": false,
  "vetur.format.defaultFormatter.html": "js-beautify-html",
  "vetur.format.defaultFormatter.js": "vscode-typescript"
}
```

### Test Standard on a new Quasar project

```bash
# I selected default values for all options to create this guide
$ quasar create qt

# Verify it runs without error
$ cd qt
$ quasar dev
```

You can now edit files without violating the standard es-lint rules!

## Prettier ES-Lint rules

### Install VS Code Extensions for Prettier

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)

### Update VS Code settings file for Prettier

To edit the settings use the command `Open Settings JSON` in the Command Palette in the View menu (ctrl+shift+p).

```js
{
    "editor.formatOnPaste": true,
    "editor.formatOnSave": true,

    "editor.codeActionsOnSave": {
        "source.fixAll": true
    },

    "vetur.format.defaultFormatter.html": "prettyhtml",
    "vetur.format.defaultFormatter.js": "prettier-eslint"
}
```

### Test Prettier on a new Quasar project

```bash
# I selected default values for all options to create this guide
# except for the linting profile, I selected prettier instead of standard
$ quasar create qtp

# Verify it runs without error
$ cd qtp
$ quasar dev
```

You can now edit files without violating the standard es-lint rules!

## Recommended additional VS Code extensions and settings updates

- [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)
- [Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)
- [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Format in context menus](https://marketplace.visualstudio.com/items?itemName=lacroixdavid1.vscode-format-context-menu)
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)
- [Sass](https://marketplace.visualstudio.com/items?itemName=Syler.sass-indented)
- [Sass Lint](https://marketplace.visualstudio.com/items?itemName=glen-84.sass-lint)
- [npm](https://marketplace.visualstudio.com/items?itemName=eg2.vscode-npm-script)
- [npm Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Sorting HTML and Jade attributes](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-attrs-sorter)
- [TODO Highlight](https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight)
- [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)
- [Vue Peek](https://marketplace.visualstudio.com/items?itemName=dariofuzinato.vue-peek)
- [VS Code Icons](https://marketplace.visualstudio.com/items?itemName=robertohuertasm.vscode-icons)

To edit the settings use the command `Open Settings JSON` in the Command Palette in the View menu (ctrl+shift+p).

```js
{
  "attrsSorter.order": [
    "is",
    "v-for",
    "v-if",
    "v-else-if",
    "v-else",
    "v-show",
    "v-cloak",
    "v-once",
    "v-pre",
    "id",
    "ref",
    "key",
    "v-slot",
    "v-slot.+",
    "#.*",
    "slot",
    "v-model",
    "v-model.+",
    "v-bind",
    "v-bind.+",
    ":.+",
    "v-text",
    "v-text.+",
    "v-html",
    "v-html.+",
    "class",
    "v-on.+",
    "@.+",
    "name",
    "data-.+",
    "ng-.+",
    "src",
    "for",
    "type",
    "href",
    "values",
    "title",
    "alt",
    "role",
    "aria-.+",
    "$unknown$"
  ],
  "todohighlight.isEnable": true,
  "todohighlight.include": [
    "**/*.js",
    "**/*.jsx",
    "**/*.ts",
    "**/*.tsx",
    "**/*.html",
    "**/*.php",
    "**/*.css",
    "**/*.sass",
    "**/*.scss",
    "**/*.vue"
  ],
  "workbench.iconTheme": "vscode-icons"
}
```

## Debugging a Quasar project in VS Code

1. First, head to [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) and read it thoroughly.
2. Then, since Quasar is based on Vue, you will also want to refer to [Vue Cookbook for VSCode debugging](https://vuejs.org/v2/cookbook/debugging-in-vscode.html) for setting up debugging Vue apps.

The best approach is to open that in a browser beside this page so you can review these instructions as you are reading those instructions. And apply the changes to your project as you go.

The first step of the Vue cookbook says it is to enable source maps. Quasar automatically enables source maps for development mode. Here is [a good article](https://blog.scottlogic.com/2017/11/01/webpack-source-map-options-quick-guide.html) that describes the different values for the [webpack devtool setting](https://webpack.js.org/configuration/devtool/) (the one that turns on or off source maps.) Quasar uses _cheap-module-eval-source-map_ by default.

While `cheap-module-eval-source-map` may build faster, it makes debugging harder and it makes debugging in VSCode near impossible. The recommended value of devtool in this case is `source-map`. This makes debugging in VSCode work properly due to your full vue source files being available in the built in chrome debugger thus it will be easier to find your original source and easier to correctly locate the line that you want to set the break point to. If you want to enable this, you would add this line to your _quasar.config.js_ file:

```js
// quasar.conf.js
build: {
  // ...

  // this is a configuration passed on
  // to the underlying Webpack
  devtool: 'source-map'
}
```

Then you need to tell VSCode to add a configuration to the debugger. The easiest way to do that is to click on the bug icon on the action bar (for ltr languages, that is the bar on the far left). Once you click on that bug icon, the file tree area will switch to the debug and run area. Click on the gear icon in the title bar of that window and it will bring up a file called _launch.json_. This is where you put the different configurations of launching the application to be debugged. Here are the settings for launching a Quasar app in Chrome. For the Firefox version, look at the Vue cookbook mentioned above.

```js
{
  "type": "chrome",
  "request": "launch",
  "name": "Quasar App: chrome",
  "url": "http://localhost:8080",
  "webRoot": "${workspaceFolder}/src",
  "breakOnLoad": true,
  "sourceMapPathOverrides": {
    "webpack:///./src/*": "${webRoot}/*"
  }
}
```

Now save the file, then select that configuration in the drop down on the title bar of the debug and run pane. Before you can launch the debugger, the app must be running. From the command line, launch dev mode of your app with `quasar dev`. Then click the green "go" button in the debug and run pane to launch the debugging session and attach to your running app. You can now set break points and control step over/in/out etc, all from VSCode. You can also launch the built in Chrome debugger and it will stay in sync. This might be useful if you also have the [Vue devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) installed (highly recommended).

::: tip
If you just want to use the Chrome or Firefox debuggers but you find it hard to locate the right source file in the browser source tab then you can use the debugger statement in your code to force the debugger to stop on that line and bring up the proper source code.
:::



