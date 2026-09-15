---
title: Configure VS Code
desc: How to configure VS Code for best usage with Quasar, from the extensions and the linter and formatter settings to the Quasar MCP server for Copilot.
---

::: tip
This guide assumes you have already installed VS Code (Visual Studio Code).
:::

## VS Code Extensions

### Essential (_IntelliSense, Linting, Formatting_)

- [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=vue.volar), the Vue language features
- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- the extension of the linter and formatter your project uses, one of:
  - [Oxc](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode), for projects on oxlint + oxfmt (the pick Quasar CLI recommends when scaffolding)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), for projects on ESLint + Prettier

### Recommended

- [TODO Highlight](https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight)
- [GitLens — Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)
- [VS Code Icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons)
- [Quasar Docs](https://marketplace.visualstudio.com/items?itemName=CodeCoaching.quasar-docs)
- [Common Intellisense](https://marketplace.visualstudio.com/items?itemName=simonhe.common-intellisense)

## Quasar CLI (with Vite)

If you created your project with Quasar CLI, you already have the recommended VS Code configuration: `.vscode/settings.json` and `.vscode/extensions.json` are scaffolded for the linter and formatter you picked (oxlint + oxfmt, or ESLint + Prettier), and `.vscode/mcp.json` registers the Quasar MCP server for VS Code's AI agents.

When you open your project in VS Code, it prompts you to install the recommended extensions if you haven't installed them already. Just restart VS Code after installing them and you are ready to go!

## Quasar Vite Plugin

Depending on which features/presets you are using, add the related options to `.vscode/settings.json`. These are the settings a Quasar CLI project ships with.

### Common Configuration

Bracket pair guides, and the generated folders kept out of search results (`.quasar` and the temporary config file are written by Quasar CLI; drop them if you use the Vite plugin only):

```json
{
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true,

  "search.exclude": {
    "dist/": true,
    ".quasar/": true,
    "/quasar.config.js.temporary.*": true
  }
}
```

### oxlint + oxfmt

Formatting on save through oxfmt, and the lint fixes oxlint can apply on their own:

```json
{
  "editor.defaultFormatter": "oxc.oxc-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.oxc": "always"
  },
  "oxc.fmt.configPath": ".oxfmtrc.json"
}
```

With TypeScript configuration files, point at them instead:

```json
{
  "oxc.configPath": "oxlint.config.ts",
  "oxc.fmt.configPath": "oxfmt.config.ts"
}
```

### ESLint + Prettier

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": ["source.fixAll.eslint"],
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "vue"]
}
```

Without Prettier, let ESLint format too:

```json
{
  "editor.defaultFormatter": "dbaeumer.vscode-eslint"
}
```

### TypeScript

Use the project's own TypeScript, the one the build uses, rather than the version bundled with VS Code:

```json
{
  "js/ts.tsdk.path": "node_modules/typescript/lib"
}
```

## AI agents

VS Code's own agents (GitHub Copilot in agent mode, and any extension speaking MCP) get the Quasar documentation and API of the exact versions your project runs through the [@quasar/mcp server](/start/ai-agents). Register it in `.vscode/mcp.json` (a project scaffolded with Quasar CLI already has this file); nothing gets installed in the project:

```json
{
  "servers": {
    "quasar": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "--fetch-retries=0", "@quasar/mcp@latest"]
    }
  }
}
```

The [AI Agents](/start/ai-agents) page covers the other clients, what the agent gets, and how updates are handled.
