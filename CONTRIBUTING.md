# Quasar Contributing Guide

Hi! I’m really excited that you are interested in contributing to Quasar. Before submitting your contribution though, please make sure to take a moment and read through the following guidelines.

- [Code of Conduct](./.github/CODE_OF_CONDUCT.md)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Financial Contribution](#financial-contribution)

## Issue Reporting Guidelines

- The issue list of this repo is **exclusively** for bug reports and feature requests. Non-conforming issues will be closed immediately.

  - For simple beginner questions, you can get quick answers from the [Quasar Discord chat](https://chat.quasar.dev).

  - For more complicated questions, you can use [the official forum](https://forum.quasar.dev/). Make sure to provide enough information when asking your questions - this makes it easier for others to help you!

- Try to search for your issue, it may have already been answered or even fixed in the development branch (`dev`).

- Check if the issue is reproducible with the latest stable version of Quasar. If you are using a pre-release, please indicate the specific version you are using.

- It is **required** that you clearly describe the steps necessary to reproduce the issue you are running into. Although we would love to help our users as much as possible, diagnosing issues without clear reproduction steps is extremely time-consuming and simply not sustainable.

- Use only the minimum amount of code necessary to reproduce the unexpected behavior. A good bug report should isolate specific methods that exhibit unexpected behavior and precisely define how expectations were violated. What did you expect the method or methods to do, and how did the observed behavior differ? The more precisely you isolate the issue, the faster we can investigate.

- Issues with no clear repro steps will not be triaged. If an issue labeled "need repro" receives no further input from the issue author for more than 5 days, it will be closed.

- If your issue is resolved but still open, don’t hesitate to close it. In case you found a solution by yourself, it could be helpful to explain how you fixed it.

- Most importantly, we beg your patience: the team must balance your request against many other responsibilities — fixing other bugs, answering other questions, new features, new documentation, etc. The issue list is not paid support and we cannot make guarantees about how fast your issue can be resolved.

## Pull Request Guidelines

- The `master` branch is basically just a snapshot of the latest stable release. All development should be done in dedicated branches. **Do not submit PRs against the `master` branch.**

- Checkout a topic branch from the relevant branch, e.g. `dev`, and merge back against that branch.

- **DO NOT** checkin `dist` in the commits.

- It's OK to have multiple small commits as you work on the PR - we will let GitHub automatically squash it before merging.

- If adding new feature:
  - Provide convincing reason to add this feature. Ideally you should open a suggestion issue first and have it greenlighted before working on it.

- If fixing a bug:
  - If you are resolving a special issue, add `(fix: #xxxx[,#xxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `fix: update entities encoding/decoding (fix #3899)`.
  - Provide detailed description of the bug in the PR. Live demo preferred.

## Development Setup

You will need [Node.js](http://nodejs.org) **version 12.22.1+** along [Yarn](https://yarnpkg.com/) or [NPM](https://docs.npmjs.com/getting-started/installing-node). Read `package.json` and take notice of the scripts you can use.

After cloning the repo, in each subfolder run:

``` bash
$ yarn # or: npm install
```

### Commonly used NPM scripts

``` bash
# Start dev server with a demo app. This app has Quasar source code linked directly so any change will trigger HMR (Hot Module Reload) on the dev server.
# There's a section for each feature where tests are made.
$ yarn dev [theme] # or: npm run dev [theme]

# build all dist files, including npm packages
$ yarn build      # or: npm run build
# build only js dist files
$ yarn build js   # or: npm run build js
# build only css dist files
$ yarn build css  # or: npm run build css

# lint sources
$ yarn lint # or: npm run lint
```

## Project Structure (/ui)

- **`build`**: contains build-related configuration files. In most cases you don't need to touch them.

- **`src`**: contains the source code, obviously. The codebase is written in ES2015.

  - **`components`**: JS and Stylus files (one for each theme) for Quasar Vue components

  - **`directives`**: Vue directives supplied by Quasar

  - **`features`**: code for global features outside of the components

  - **`css`**: Stylus definitions and core code for Quasar themes

  - **`utils`**: utilities used by the framework and exported to the public API

  - **`index.js`**: starting point for Quasar

- **`lang`**: Quasar language packs

- **`icon-set`**: Quasar icon sets

- **`dist`**: contains built files for distribution (only after a build). Note this directory is only updated when a release happens; they do not reflect the latest changes in development branches.

- **`dev`**: app with Quasar sources linked directly used for testing purposes. Each feature/component has its own `*.vue` file. Adding a new file automatically creates a route for it and adds it to the "homepage" list (based on the file name).

## Dev Server for Quasar (/ui)
Running `yarn dev` (or `npm run dev`) starts up a dev server which uses HMR (Hot Module Reload) for Quasar source code. You can easily test your changes by making necessary changes to `/dev` `*.vue` files.

## Financial Contribution

Quasar Framework is an MIT-licensed open source project. Its ongoing development is made possible thanks to the support by these awesome [backers](../backers.md).

**Please read our manifest on [Why donations are important](https://quasar.dev/why-donate)**. If you'd like to become a donator, check out [Quasar Framework's Donator campaign](https://donate.quasar.dev).
