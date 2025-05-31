![Quasar Framework logo](https://cdn.quasar.dev/logo-v2/header.png)

# Quasar Framework

> Build high-performance VueJS user interfaces in record time: responsive Single Page Apps, SSR Apps, PWAs, Browser extensions, Hybrid Mobile Apps and Electron Apps. If you want, all using the same codebase!

[![Join the chat at https://chat.quasar.dev](https://img.shields.io/badge/chat-on%20discord-7289da.svg)](https://chat.quasar.dev)
<a href="https://forum.quasar.dev" target="_blank"><img src="https://img.shields.io/badge/community-forum-brightgreen.svg"></a>
[![https://good-labs.github.io/greater-good-affirmation/assets/images/badge.svg](https://good-labs.github.io/greater-good-affirmation/assets/images/badge.svg)](https://good-labs.github.io/greater-good-affirmation)

## Scaffolding app

This app is used to scaffold Quasar CLI project folders.

```bash
npm init quasar
# or:
yarn create quasar
# or:
pnpm create quasar
# or:
bun create quasar
```

## Command-Line Parameters

The create-quasar tool supports both interactive and non-interactive modes. By default, it runs in interactive mode, prompting you for each option. However, you can also provide command-line parameters to automate the project creation process.

### Basic Usage

```bash
npm init quasar -- --type app --folder my-project
# or
yarn create quasar --type app --folder my-project
```

### Non-Interactive Mode

To run in fully non-interactive mode, use the `--yes` flag. This will use default values for any parameters not explicitly specified:

```bash
npm init quasar -- --type app --folder my-project --yes
```

### Template-Specific Options

Each template type (app, app-extension, ui-kit) has its own set of specific options. To see the available options for a particular template type, use:

```bash
npm init quasar -- --help --type <template-type>
```

For example:

```bash
npm init quasar -- --help --type app
npm init quasar -- --help --type app-extension
npm init quasar -- --help --type ui-kit
```

### Examples

#### Creating a standard app with specific options:

```bash
npm init quasar -- --type app --folder my-app --script-type js --engine vite-2 --preset eslint,pinia,axios --css scss --yes
```

#### Creating an app extension:

```bash
npm init quasar -- --type app-extension --folder my-extension --name my-ext --description "My Quasar Extension" --preset prompts,install --yes
```

#### Creating a UI kit:

```bash
npm init quasar -- --type ui-kit --folder my-ui-kit --name my-component --features component,ae --yes
```

## Supporting Quasar

Quasar Framework is an MIT-licensed open source project. Its ongoing development is made possible thanks to the support by these awesome [backers](https://github.com/rstoenescu/quasar-framework/blob/dev/backers.md).

**Please read our manifest on [Why donations are important](https://quasar.dev/why-donate)**. If you'd like to become a donator, check out [Quasar Framework's Donator campaign](https://donate.quasar.dev).

## Documentation

Head on to the Quasar Framework official website: [https://quasar.dev](https://quasar.dev)

## Stay in Touch

For latest releases and announcements, follow on Twitter: [@quasarframework](https://twitter.com/quasarframework)

## Chat Support

Ask questions at the official community Discord server: [https://chat.quasar.dev](https://chat.quasar.dev)

## Community Forum

Ask questions at the official community forum: [https://forum.quasar.dev](https://forum.quasar.dev)

## Contributing

I'm excited if you want to contribute to Quasar under any form (report bugs, write a plugin, fix an issue, write a new feature). Please read the [Contributing Guide](../CONTRIBUTING.md).

## Semver

Quasar is following [Semantic Versioning 2.0](https://semver.org/).

## License

Copyright (c) 2015-present Razvan Stoenescu

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
