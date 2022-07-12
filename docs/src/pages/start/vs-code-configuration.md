---
title: Configure VS Code
desc: How to configure VS Code for best usage with Quasar.
---

::: tip
This guide assumes you have already installed VS Code(Visual Studio Code).
:::

## VS Code Extensions

### Essential (_IntelliSense, Linting, Formatting_)

- [Vue Language Features (Volar)](https://marketplace.visualstudio.com/items?itemName=vue.volar)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

### Recommended

- [TODO Highlight](https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight)
- [GitLens — Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)
- [VS Code Icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons)
- [Quasar Docs](https://marketplace.visualstudio.com/items?itemName=CodeCoaching.quasar-docs)

## Quasar CLI

If you created your project with Quasar CLI, you already have the recommended VS Code configuration. 💪

When you open your project on VS Code, it will prompt you to install our recommended extensions if you haven't installed them already.
Just restart VS Code after installing them and you are ready to go! 🚀

## Vite & Vue CLI & UMD

Depending on which features/presets you are using, you can add the related options to `.vscode/settings.json`.

### Common Configuration

```json
{
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true
}
```

### ESLint

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": [
    "source.fixAll.eslint"
  ],
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "vue"]
}
```

#### Without Prettier

```json
{
  "editor.defaultFormatter": "dbaeumer.vscode-eslint"
}
```

#### With Prettier

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### TypeScript

```json
{
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Debugging a Quasar project in VS Code

The best approach is to open that in a browser beside this page so you can review these instructions as you are reading those instructions. And apply the changes to your project as you go.

The first step to properly start debugging is enabling source maps. Quasar automatically enables source maps for development mode. Here is [a good article](https://blog.scottlogic.com/2017/11/01/webpack-source-map-options-quick-guide.html) that describes the different values for the [Webpack's devtool setting](https://webpack.js.org/configuration/devtool/)(_the one that controls the source maps_). Quasar uses _eval-cheap-module-source-map_ by default.

`eval-cheap-module-source-map` builds slow(_not the slowest_), rebuilds fast(_not the fastest_), and preserves the original lines(_not the best quality_). If you want faster builds while giving up on some accuracy, or more accuracy while giving up on speed, you can choose other values. The slowest but the most accurate(_the original_) value of the `devtool` is `source-map`. This makes debugging in VS Code work properly due to your full Vue source files being available in the built-in Chrome debugger. So, it will be easier to find your original source and locate the line that you want to set the breakpoint to. If you want to enable this, you need to update [`quasar.config.js > build > devtool`](/quasar-cli-webpack/quasar-config-js#property-build) like this:

```js
// quasar.config.js
build: {
  // ...

  // this is a configuration passed on
  // to the underlying Webpack
  devtool: 'source-map'
}
```

Then you need to tell VSCode to add a configuration to the debugger. The easiest way to do that is to click on the bug icon on the action bar (for ltr languages, that is the bar on the far left). Once you click on that bug icon, the file tree area will switch to the debug and run area. Click on the gear icon in the title bar of that window and it will bring up a file called _launch.json_. This is where you put the different configurations of launching the application to be debugged. Here are the settings for launching a Quasar app in Chrome. For the Firefox version, you can check out [Vue Cookbook](https://v2.vuejs.org/v2/cookbook/debugging-in-vscode.html#Launching-the-Application-from-VS-Code)(_for Vue 2, might be outdated_).

In the example below, replace `package-name` with the `name` property from your `package.json` file:

```json
{
  "type": "chrome",
  "request": "launch",
  "name": "Quasar App: chrome",
  "url": "http://localhost:8080",
  "webRoot": "${workspaceFolder}/src",
  "breakOnLoad": true,
  "sourceMapPathOverrides": {
    "webpack://package-name/./src/*": "${webRoot}/*"
  }
}
```

Now save the file, then select that configuration in the dropdown on the title bar of the debug and run pane. Before you can launch the debugger, the app must be running. Start the development server by running `quasar dev`. Then click the green "Start Debugging" button in the "Run and Debug" pane(_or press F5_) to launch the debugging session and attach it to your running app. You can now set breakpoints and control step over/in/out etc., all from VSCode. You can also launch the built-in Chrome debugger and it will stay in sync. This might be useful if you also have the [Vue devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) installed (highly recommended).

::: tip
If you just want to use the Chrome or Firefox debuggers but you find it hard to locate the right source file in the browser source tab then you can use the debugger statement in your code to force the debugger to stop on that line and bring up the proper source code.
:::
