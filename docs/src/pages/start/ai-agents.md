---
title: AI Agents
desc: How to give AI coding agents the Quasar documentation and API of the versions your project runs, through the @quasar/mcp server.
badge: beta
---

AI coding agents know a Quasar, not necessarily yours. The `@quasar/mcp` package is an [MCP](https://modelcontextprotocol.io) (Model Context Protocol) server that hands any MCP-capable agent the documentation pages and the component API of the exact Quasar versions installed in your project, offline.

## How it works

The documentation ships with the packages: the pages about components, plugins, directives, composables, utils and styling are inside `quasar` (v2.33+), the ones about the CLI, its modes and configuration inside `@quasar/app-vite` (v3.9+). The API of every component, plugin and directive ships with `quasar` as it always has. The server reads them from your project's `node_modules`, so:

- the answers describe the versions you run, not the latest release;
- nothing is fetched from quasar.dev, it works offline;
- upgrading a package upgrades its documentation.

::: tip
The pages are the same ones you read on this site; every page also has a Markdown button (top right) and a `.md` sibling URL for agents that browse the web.
:::

## Setup

Register the server with your MCP client. Nothing gets installed in your project: `npx` starts the latest server release, so it keeps itself up to date, and when you are offline it starts the copy it cached last time (the retries flag is what keeps that quick).

```json
{
  "mcpServers": {
    "quasar": {
      "command": "npx",
      "args": ["-y", "--fetch-retries=0", "@quasar/mcp@latest"]
    }
  }
}
```

The server serves the project it is started in, which is what every client does when the configuration lives in the project. If yours starts servers from elsewhere, add `"--project", "/path/to/project"` to the arguments.

### Claude Code

```bash
claude mcp add quasar -- npx -y --fetch-retries=0 @quasar/mcp@latest
```

### Codex

```bash
codex mcp add quasar -- npx -y --fetch-retries=0 @quasar/mcp@latest
```

This writes the server into `~/.codex/config.toml`; a project can carry the same section in its own `.codex/config.toml`:

```toml
[mcp_servers.quasar]
command = "npx"
args = ["-y", "--fetch-retries=0", "@quasar/mcp@latest"]
```

### Grok Build

```bash
grok mcp add quasar -- npx -y --fetch-retries=0 @quasar/mcp@latest
```

This writes the server into `~/.grok/config.toml`; add `--scope project` to write `.grok/config.toml` in the project instead. The section has the same shape as Codex's:

```toml
[mcp_servers.quasar]
command = "npx"
args = ["-y", "--fetch-retries=0", "@quasar/mcp@latest"]
```

Grok Build also picks up a project `.mcp.json` written for Claude Code, so one file can serve both.

### Cursor, Windsurf, VS Code and others

Put the JSON above in the client's MCP configuration file (`.cursor/mcp.json`, `.windsurf/mcp.json`, `.vscode/mcp.json` with a `servers` key instead of `mcpServers`, ...). Every MCP client documents where that file lives.

## What the agent gets

| Tool            | Purpose                                                                    |
| --------------- | -------------------------------------------------------------------------- |
| `list_pages`    | every documentation page available offline, grouped by package             |
| `search_docs`   | the pages matching some keywords                                           |
| `get_page`      | a page, or one section of it                                               |
| `list_api`      | the names of the API descriptors (`QBtn`, `Notify`, `Ripple`, ...)         |
| `get_api`       | the props, slots, events and methods of one of them                        |
| `check_updates` | whether newer releases of `quasar`, `@quasar/app-vite` or the server exist |

At the start of a session the server tells the agent which versions it serves and whether updates are available, so the agent can suggest an upgrade. That check runs in the background at most once a day, like the Quasar CLI's own update notice, never while offline, and honors the `NO_UPDATE_NOTIFIER` environment variable.

::: warning
A project on releases predating the bundled documentation still gets the API through `get_api`, but no pages: the server names the packages to upgrade.
:::
