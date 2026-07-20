---
title: Configure VS Code
description: How to configure VS Code for best usage with Quasar.
canonical: https://quasar.dev/start/vs-code-configuration
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

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
- [Common Intellisense](https://marketplace.visualstudio.com/items?itemName=simonhe.common-intellisense)

## Quasar CLI (with Vite)

If you created your project with Quasar CLI, you already have the recommended VS Code configuration. 💪

When you open your project on VS Code, it will prompt you to install our recommended extensions if you haven't installed them already.
Just restart VS Code after installing them and you are ready to go! 🚀

## Quasar Vite Plugin

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
  "editor.codeActionsOnSave": ["source.fixAll.eslint"],
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
  "js/ts.tsdk.path": "node_modules/typescript/lib"
}
```
