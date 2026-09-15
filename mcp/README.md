![Quasar Framework logo](https://cdn.quasar.dev/logo-v2/header.png)

# @quasar/mcp

> An [MCP](https://modelcontextprotocol.io) server that gives AI agents the Quasar documentation and component API of the exact versions installed in your project.

<img alt="@quasar/mcp npm version" src="https://img.shields.io/npm/v/%40quasar/mcp.svg?label=@quasar/mcp">

[![mcp tests](https://github.com/quasarframework/quasar/actions/workflows/mcp-tests.yml/badge.svg?branch=dev)](https://github.com/quasarframework/quasar/actions/workflows/mcp-tests.yml)

The documentation pages ship inside the `quasar` and `@quasar/app-vite` packages (in their `dist/mcp` folder), and the component API inside `quasar` (`dist/api`), so the server works offline and always describes what you run. There is no fallback to quasar.dev: a project on releases predating the bundled docs gets the API only, and the server says so.

## Setup

Add the server to your MCP client, from the project folder. Nothing gets installed in the project: `npx` starts the latest release when online and the cached copy when offline (the retries flag keeps that fallback quick):

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

The server serves the project it is started in. Clients that start servers elsewhere can point it at the project with `--project <dir>`.

See the [AI Agents](https://quasar.dev/start/ai-agents) page for the per-client instructions.

## Tools

| Tool            | What it returns                                                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `list_pages`    | every page available offline, grouped by the package shipping it                                                                   |
| `search_docs`   | the pages matching some keywords, with a snippet and the sections they occur in                                                    |
| `get_page`      | one page, one section of it, or its outline, as markdown                                                                           |
| `list_api`      | the names of the API descriptors: components, plugins, directives, utilities                                                       |
| `get_api`       | the props, slots, events and methods of one of them (or one part), as the site shows them; `format: "json"` for the raw descriptor |
| `check_updates` | whether newer releases of quasar, @quasar/app-vite or this server exist                                                            |

At session start the server also tells the agent which package versions it serves, what is missing, and which updates are available (checked in the background, cached for a day, never while offline, the same mechanism the Quasar CLI uses; `NO_UPDATE_NOTIFIER` disables it).

## Chat Support

Ask questions at the official community Discord server: [https://chat.quasar.dev](https://chat.quasar.dev)

## Community Forum

Ask questions at the official community forum: [https://forum.quasar.dev](https://forum.quasar.dev)

## Contributing

I'm excited if you want to contribute to Quasar under any form (report bugs, write a plugin, fix an issue, write a new feature). Please read the [Contributing Guide](../CONTRIBUTING.md).

## Semver

Quasar is following [Semantic Versioning 2.0](https://semver.org/).

## License

Copyright (c) 2026-present Razvan Stoenescu

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
