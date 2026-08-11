---
title: Contribution Guide
desc: How to contribute to Quasar Framework.
---

This guide covers ways in which you can become a part of the ongoing development of Quasar.

But, before we begin, a first important note. Everyone interacting in Quasar is expected to follow the [Quasar Code of Conduct](https://github.com/quasarframework/quasar/blob/dev/.github/CODE_OF_CONDUCT.md).

Now that we've got that covered, let's go!

After reading this guide, you will know:

- How to use GitHub to report issues.
- How to help resolve existing issues.
- How to contribute to the Quasar documentation.
- How to create a Quasar App Extension.
- How to contribute to the Quasar source code.

Quasar is not "someone else's framework". Many people have contributed to Quasar ranging from a single character to massive architectural changes or significant documentation - all with the goal of making Quasar better for everyone. Even if you don't feel up to writing code or documentation yet, there are a variety of other ways that you can contribute, from reporting issues to testing patches.

## Help with Support

One of the easiest ways to contribute is to answer questions in the different Q&A systems we have. Be a supportive and positive member of the Quasar community by answering questions you know answers to, or even by adding your best guess. Being a part of such discussions can also be a good learning experience. It's a win-win!

Here are our discussion/Q&A venues:

- [GitHub Discussions](https://forum.quasar.dev/): A place to ask questions and get answers about Quasar and its ecosystem. It's also a great place to share your knowledge and experience with others, and to discuss your ideas and feature requests.
- [Discord Server](https://chat.quasar.dev/): A place for Quasar devs to meet and chat in real time. You can ask questions, share your knowledge, and help others. It's also possible to post job offers or look for a job there.

## Share (and Build) Your Experience

Apart from answering questions and sharing resources in Discussions and chat, there are a few other less obvious ways to share and expand what you know:

- **Develop learning materials**. It's often said that the best way to learn is to teach. If there's something interesting you're doing with Quasar, strengthen your expertise by writing a blog post, recording a video, developing a workshop, or even publishing a gist that you share on social media. Make sure to mention @quasarframework so we can help amplify it.
- **Watch a repo you care about**. This will send you notifications whenever there's activity in that repository, giving you insider knowledge about ongoing discussions and upcoming features. It's a fantastic way to build expertise so that you're eventually able to help address issues and pull requests.

## Reporting an Issue

- [GitHub](https://github.com/quasarframework/quasar/issues): If you want to create a bug report or a docs report, that's what the GitHub issues are for. Make sure that you select the correct template and follow the given instructions while creating an issue.

::: danger Reporting a vulnerability
Please do not report security vulnerabilities with public GitHub issue reports. Follow the [Report a vulnerability](/security/report-a-vulnerability) steps for security issues.
:::

If you've found a problem in Quasar which is not a security risk, do a search on GitHub under [Issues](https://github.com/quasarframework/quasar/issues) to check if it is already answered or even fixed in the development branch (`dev`).

- The issue list of the [main repo](https://github.com/quasarframework/quasar) is **exclusively** for bug reports and docs reports. Non-conforming issues will be closed immediately.
  - For simple beginner questions, you can get quick answers from the [Quasar Discord chat](https://chat.quasar.dev).

  - For more complicated questions, you can use [the Discussions section](https://forum.quasar.dev). Make sure to provide enough information when asking your questions - this makes it easier for others to help you!

  - For feature requests, first [check the existing ideas](https://github.com/quasarframework/quasar/discussions/categories/ideas-proposals), then [start a new feature discussion](https://github.com/quasarframework/quasar/discussions/new?category=ideas-proposals) if yours isn't there yet.

- Check if the issue is reproducible with the latest stable version of Quasar. Please always indicate the specific version you are using.

- It is **required** that you clearly describe the steps necessary to reproduce the issue you are running into. Although we would love to help our users as much as possible, diagnosing issues without clear reproduction steps is extremely time-consuming and simply not sustainable.

- Use only the minimum amount of code necessary to reproduce the unexpected behavior. A good bug report should isolate specific methods that exhibit unexpected behavior and precisely define how expectations were violated. What did you expect the method or methods to do, and how did the observed behavior differ? The more precisely you isolate the issue, the faster we can investigate.

- Issues with no clear reproduction steps will not be triaged. If an issue labeled "bug/0-needs-info" receives no further input from the issue author for a significant period of time, it will be closed.

- If your issue is resolved but still open, don't hesitate to close it. In case you found a solution by yourself, it could be helpful to explain how you fixed it.

- Most importantly, we beg your patience: the team must balance your request against many other responsibilities — fixing other bugs, answering other questions, new features, new documentation, etc. The issue list is not paid support and we cannot make guarantees about how fast your issue can be resolved, although we do our very best.

## Helping to Resolve Existing Issues

As a next step beyond reporting issues, you can help the Quasar Team resolve existing ones by providing feedback about them. If you are new to Quasar development, that might be a great way to walk your first steps, you'll get familiar with the code base and the processes.

If you check the issues list in [GitHub Issues](https://github.com/quasarframework/quasar/issues), you'll find lots of issues already requiring attention. What can you do for these? Quite a bit, actually:

#### Verifying Bug Reports

For starters, it helps just to verify bug reports. Can you reproduce the reported issue on your own computer? If so, you can add a comment to the issue saying that you're seeing the same thing.

If an issue is very vague, can you help narrow it down to something more specific? Maybe you can provide additional information to help reproduce a bug, or help by eliminating needless steps that aren't required to demonstrate the problem.

Anything you can do to make bug reports more succinct or easier to reproduce helps folks trying to write code to fix those bugs - whether you end up writing the code yourself or not.

#### Testing Patches

You can also help out by examining pull requests that have been submitted to Quasar via GitHub. The easiest way to try out someone's changes is with the [GitHub CLI](https://cli.github.com/), from your clone of the repo:

```bash
gh pr checkout 12345 # the pull request's number
```

Alternatively, with plain git:

```bash
git fetch upstream pull/12345/head:testing_branch
git checkout testing_branch
```

After checking out their branch, test it out! Here are some things to think about:

- Does the change actually work?
- Does it have the proper documentation coverage? Should documentation elsewhere be updated?
- Do you like the implementation? Can you think of a nicer or faster way to implement a part of their change?

Once you're happy that the pull request contains a good change, comment on the GitHub issue indicating your approval. Your comment should indicate that you like the change and what you like about it. Something like:

::: tip Example pull request comment
I like the way you've restructured the code in card.vue - much nicer. Documentation is updated too.
:::

If your comment simply reads "+1", then odds are that other reviewers aren't going to take it too seriously. Show that you took the time to review the pull request.

## Contributing to the Quasar Documentation

You can help improve the Quasar documentation by making it more coherent, consistent, or readable, adding missing information, correcting factual errors, fixing typos, or bringing them up to date with the latest edge Quasar.

::: tip Typos or small changes can be fixed directly from the documentation
Use the "Caught a mistake? Edit this page in browser" link at the bottom of every documentation page. Edit the source file, preview the changes, add a description of your change and hit `Propose changes`, then on the next screen `Create pull request`.
:::

For larger edits, work on the documentation source files (located [here](https://github.com/quasarframework/quasar/tree/dev/docs/src/pages) on GitHub) as described below.

### Documentation Best Practices

Over time we consolidated a set of rules which we follow and following them will speed up the merge process:

- Capitalize titles, see [How to Use Capitalize My Title](https://capitalizemytitle.com/).
- Use the present tense.
- Be concise, avoid text / code duplication.
- Link to the external sources which are used as master information sources and are usually updated more frequently, like [Mozilla MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [Vue.js API](https://vuejs.org/api/) rather than compiled tutorials which tend to be outdated soon.
- Do the proofreading before opening a PR.
- Do not repeat texts from other sources, but keep only things which are relevant and show Quasar specific features in a context.
- Use official names. For example use `Firebase` instead of `firebase`.
- Exclude from PR all drafts and unfinished pages.

#### Fork

Navigate to the Quasar [GitHub repository](https://github.com/quasarframework/quasar) and press "Fork" in the upper right-hand corner.

::: warning Select dev branch
Make sure you have the `dev` branch selected - this is where all the work is done.
:::

#### Clone the forked repository

To be able to change the documentation, you need to clone the forked repository:

```bash
git clone https://github.com/your-user-name/quasar.git
cd quasar
git checkout dev
```

#### Install dependencies

Install the required dependencies.

```bash
pnpm i
```

#### Running documentation against your local repository

```bash
cd docs
pnpm dev
```

The documentation runs against your local cloned repository, with hot reload as you edit the markdown pages in `docs/src/pages`.

#### Commit your changes

When you're happy with the change on your computer, commit it to Git, following the [Commit Conventions](/how-to-contribute/commit-conventions):

```bash
git commit -a
```

#### Update your local repository

It's pretty likely that other changes have happened while you were working. Go get them.

1. Add the main Quasar repository as an upstream remote

```bash
git remote add upstream https://github.com/quasarframework/quasar.git
```

2. Fetch all remote branches

```bash
git fetch upstream
```

3. Check out your fork's local `dev` branch.

```bash
git checkout dev
# > Switched to branch 'dev'
```

4. Merge the changes from `upstream/dev` into your local `dev` branch. This brings your fork's `dev` branch into sync with the upstream repository, without losing your local changes.

```bash
git merge upstream/dev
```

No conflicts? Change still seems reasonable to you? Then move on and open a pull request to apply your changes to the `dev` branch in the main Quasar repository.

#### Issue a pull request

Navigate to the repository you just pushed to (e.g. https://github.com/your-user-name/quasar) and click on "New Pull Request" seen in the left top panel.

Ensure the change sets you introduced are included. Fill in some details about your potential patch including a meaningful title. When finished, click on "Create pull request". The Quasar core team will be notified about your submission.

## Create a New Quasar App Extension

An easy way to start to contribute to Quasar is to generalize the code you have created on your project and publish it as a Quasar App Extension. Follow this guide on how to [create a new extension](/app-extensions/development-guide/introduction).

When done, submit a PR on [Quasar Awesome](https://github.com/quasarframework/quasar-awesome/blob/master/README.md#community-app-extensions) to have it listed, and share your achievement on [GitHub Discussions](https://forum.quasar.dev) and [Discord](https://chat.quasar.dev).

## Contributing to the Quasar Source Code

As with any project, there are rules to contributing. Ours are written here, please read them carefully. After that, read the [Quasar code of conduct](https://github.com/quasarframework/quasar/blob/dev/.github/CODE_OF_CONDUCT.md) and you'll be ready to contribute to Quasar's core repositories.

The [main repository](https://github.com/quasarframework/quasar) is a pnpm monorepo. All the work happens on the `dev` branch, which hosts these packages:

- `/ui` - the Quasar UI library (the `quasar` npm package)
- `/app-vite` - the Vite-based CLI for managing Quasar apps (`@quasar/app-vite`)
- `/cli` - the global CLI (`@quasar/cli`)
- `/vite-plugin` - Quasar's plugin for vanilla Vite apps (`@quasar/vite-plugin`)
- `/extras` - icon sets and fonts (`@quasar/extras`)
- `/icongenie` - the Icon Genie CLI (`@quasar/icongenie`)
- `/create-quasar` - the `pnpm create quasar` / `npm create quasar` scaffolding tool
- `/docs` - this very website
- `/utils` - assorted `@quasar/*` utility packages

The Webpack-based CLI (`@quasar/app-webpack`) is maintained on its own branch of the same repository.

#### Pull Request Guidelines

- Checkout a topic branch from the `dev` branch and merge back against it.

- Keep each PR to one logical change; **DO NOT** check in `dist` or other generated files in the commits.

- Follow the [Commit Conventions](/how-to-contribute/commit-conventions).

- It's OK to have multiple small commits as you work on the PR - we will let GitHub automatically squash it before merging.

- Any user-observable change (new options, changed defaults or behavior) is incomplete until the related tests, types, API JSON files and documentation pages are updated in the same PR.

- If adding a new feature:
  - Provide a convincing reason to add this feature.
  - Ideally you should open a suggestion in the [Ideas / Proposals discussions](https://github.com/quasarframework/quasar/discussions/categories/ideas-proposals) first and have it green-lighted before working on it. Otherwise, you risk spending a lot of time on something which might not get accepted at all or not in the form you expect.

- If fixing a bug:
  - If you are resolving a specific issue, add `(fix: #xxxx[,#xxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `fix: update entities encoding/decoding (fix #3899)`.
  - Provide a detailed description of the bug in the PR. A live demo is preferred.

#### Development Setup

You will need [Node.js](https://nodejs.org) version **v22.22+** (v24 is what our CI runs) along with [pnpm v11+](https://pnpm.io/).

After cloning the repo, run this in its root folder:

```bash
pnpm i
```

#### Commonly Used Scripts

Run these from the root of the repo:

```bash
# build the Quasar UI dist files (the other packages
# and test suites rebuild them on their own when needed)
pnpm build

# format & lint the source code
pnpm lint

# run the Quasar UI test suites
pnpm test
```

Each package also defines its own scripts - check its `package.json` (and its README, where available) before working on it.

#### Project Structure (/ui)

- `build` - build-related configuration files and scripts. In most cases you don't need to touch them.

- `src` - the source code:
  - `components` - JS, Sass and JSON (API) files for Quasar Vue components

  - `composables` - Quasar's composables for the Vue Composition API

  - `directives` - Vue directives supplied by Quasar

  - `plugins` - Quasar plugins

  - `css` - Sass definitions and core code for Quasar styles

  - `utils` - utilities used by the framework and exported to the public API

- `lang` - Quasar language packs

- `icon-set` - Quasar icon sets

- `types` - the TypeScript typings

- `playground` - a Quasar app with the Quasar sources linked directly, used for development and testing purposes. Each feature/component has its own `*.vue` file in `playground/src/pages`; adding a new file automatically creates a route for it and adds it to the homepage list.

- `test` - the test suites (unit, SSR/hydration and UMD end-to-end tests)

- `dist` - contains built files for distribution (only after a build).

#### Dev Server for Quasar (/ui)

Running `pnpm dev` in `/ui` starts up the playground app on a dev server which uses HMR (Hot Module Reload) for the Quasar source code. You can easily test your changes by making the necessary changes to the `playground/src/pages` `*.vue` files. Variants of it target other build modes (like `pnpm dev:ssr` and `pnpm dev:umd`).

Before submitting your PR, please run the UI test suites (`pnpm test` in `/ui`) and the linter (`pnpm lint` in the repo root).

## Financial Contribution

Quasar Framework is an MIT-licensed open source project. Its ongoing development is made possible thanks to the support of our awesome [sponsors and backers](/sponsors-and-backers).

**Please read our manifest on [Why donations are important](/why-donate)**. If you'd like to become a donator, check out [Quasar Framework's Donation campaign](https://donate.quasar.dev).

## Quasar Contributors

Thank you to all the people who already [contributed to Quasar](https://github.com/quasarframework/quasar/graphs/contributors)!
