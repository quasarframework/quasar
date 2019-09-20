---
title: Configure VS Code for use with Quasar
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

To edit the settings use the command `Open Settings JSON` in the Command Palette in the View menu (ctrl+shift+p).

```js
{
    "editor.formatOnPaste": true,
    "editor.formatOnSave": true,

    "eslint.autoFixOnSave": true,
    "eslint.validate": [
        {
            "language": "vue",
            "autoFix": true
        },
        {
            "language": "html",
            "autoFix": true
        },
        {
            "language": "javascript",
            "autoFix": true
        }
    ],

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

    "eslint.autoFixOnSave": true,
    "eslint.validate": [
        {
            "language": "vue",
            "autoFix": true
        },
        {
            "language": "html",
            "autoFix": true
        },
        {
            "language": "javascript",
            "autoFix": true
        }
    ],

  "prettier.eslintIntegration":true,

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
- [language-stylus](https://marketplace.visualstudio.com/items?itemName=sysoev.language-stylus)
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
    "**/*.scss",
    "**/*.vue",
    "**/*.styl"
  ],
  "workbench.iconTheme": "vscode-icons"
}
```

## Debugging a Quasar project in VS Code

- [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)

> Detailed instructions on how to configure with Quasar coming soon.
