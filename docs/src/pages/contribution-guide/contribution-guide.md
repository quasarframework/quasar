---
title: Contribution Guide
desc: How to contribute to Quasar Framework.
---

This guide covers ways in which you can become a part of the ongoing development of Quasar.

But, before we begin, a first important note. Everyone interacting in Quasar is expected to follow the [Quasar code of conduct](https://github.com/quasarframework/quasar/blob/dev/.github/CODE_OF_CONDUCT.md).

Now that we've got that covered, let's go!

After reading this guide, you will know:

* How to use GitHub to report issues.
* How to clone master and run the test suite.
* How to help resolve existing issues.
* How to contribute to the Quasar documentation.
* How to create a Quasar App Extension.
* How to contribute to the Quasar code.

Quasar is not "someone else's framework". Many people have contributed to Quasar ranging from a single character to massive architectural changes or significant documentation - all with the goal of making Quasar better for everyone. Even if you don't feel up to writing code or documentation yet, there are a variety of other ways that you can contribute, from reporting issues to testing patches.

## Help with Support

One of the easiest ways to contribute is to answer questions in the different Q&A systems we have. Be a supportive and positive member of the Quasar community by answering questions you know answers to, or even by adding your best guess. Being a part of such discussions can also be a good learning experience. It's a win-win!

Here are our discussion/Q&A venues:

* [Forum](https://forum.quasar.dev/): The best place to ask questions and get answers about Quasar and its ecosystem.
* [Chat](https://chat.quasar.dev/): A place for Quasar devs to meet and chat in real time.

## Share (and Build) Your Experience

Apart from answering questions and sharing resources in the forum and chat, there are a few other less obvious ways to share and expand what you know:

* **Develop learning materials**. It’s often said that the best way to learn is to teach. If there’s something interesting you’re doing with Quasar, strengthen your expertise by writing a blog post, developing a workshop, or even publishing a gist that you share on social media.
* **Share your tech stack**. Show others which technologies are well tested and can be integrated with Quasar. Promote your project and [fill out your favorite Quasar-based stack](https://stackshare.io/tool/quasar-framework/decisions). Make sure to mention @Quasarframework and all other relevant technologies.
* **Watch a repo you care about**. This will send you notifications whenever there’s activity in that repository, giving you insider knowledge about ongoing discussions and upcoming features. It’s a fantastic way to build expertise so that you’re eventually able to help address issues and pull requests.

## Reporting an Issue

* [GitHub](https://github.com/quasarframework/quasar/issues): If you want to create a bug report or a docs report, that’s what the GitHub issues are for. Make sure that you select the correct template and follow the given instructions while creating an issue.

::: danger Reporting a vulnerability
Please do not report security vulnerabilities with public GitHub issue reports. Follow the [Report a vulnerability](/security/report-a-vulnerability) steps for security issues.
:::

If you've found a problem in Quasar which is not a security risk, do a search on GitHub under [Issues](https://github.com/quasarframework/quasar/issues) to check if it is already answered or even fixed in the development branch (`dev`).

- The issue list of the [main repo](https://github.com/quasarframework/quasar) is **exclusively** for bug reports and docs reports. Non-conforming issues will be closed immediately.

  - For simple beginner questions, you can get quick answers from the [Quasar Discord chat](https://chat.quasar.dev).

  - For more complicated questions, you can use [the Discussions section](https://forum.quasar.dev). Make sure to provide enough information when asking your questions - this makes it easier for others to help you!

  - For feature requests, you can [start a new feature discussion](https://github.com/quasarframework/quasar/discussions/new?category=ideas-proposals).

- Try to search for your issue, it may have already been answered or even fixed in the development branch (`dev`).

- Check if the issue is reproducible with the latest stable version of Quasar. If you are using a pre-release, please indicate the specific version you are using.

- It is **required** that you clearly describe the steps necessary to reproduce the issue you are running into. Although we would love to help our users as much as possible, diagnosing issues without clear reproduction steps is extremely time-consuming and simply not sustainable.

- Use only the minimum amount of code necessary to reproduce the unexpected behavior. A good bug report should isolate specific methods that exhibit unexpected behavior and precisely define how expectations were violated. What did you expect the method or methods to do, and how did the observed behavior differ? The more precisely you isolate the issue, the faster we can investigate.

- Issues with no clear reproduction steps will not be triaged. If an issue labeled "bug/0-needs-info" receives no further input from the issue author for more than 5 days, it will be closed.

- If your issue is resolved but still open, don’t hesitate to close it. In case you found a solution by yourself, it could be helpful to explain how you fixed it.

- Most importantly, we beg your patience: the team must balance your request against many other responsibilities — fixing other bugs, answering other questions, new features, new documentation, etc. The issue list is not paid support and we cannot make guarantees about how fast your issue can be resolved, although we do our very best.

## Helping to Resolve Existing Issues

As a next step beyond reporting issues, you can help the Quasar Team resolve existing ones by providing feedback about them. If you are new to Quasar development, that might be a great way to walk your first steps, you'll get familiar with the code base and the processes.

If you check the issues list in [GitHub Issues](https://github.com/quasarframework/quasar/issues), you'll find lots of issues already requiring attention. What can you do for these? Quite a bit, actually:

#### Verifying Bug Reports

For starters, it helps just to verify bug reports. Can you reproduce the reported issue on your own computer? If so, you can add a comment to the issue saying that you're seeing the same thing.

If an issue is very vague, can you help narrow it down to something more specific? Maybe you can provide additional information to help reproduce a bug, or help by eliminating needless steps that aren't required to demonstrate the problem.

Anything you can do to make bug reports more succinct or easier to reproduce helps folks trying to write code to fix those bugs - whether you end up writing the code yourself or not.

#### Testing Patches

You can also help out by examining pull requests that have been submitted to Quasar via GitHub. In order to apply someone's changes, you need to first create a dedicated branch:
```bash
$ git checkout -b testing_branch
```

Then, you can use their remote branch to update your codebase. For example, let's say the GitHub user JohnSmith has forked and pushed to a topic branch "orange" located at https://github.com/JohnSmith/quasar.
```bash
$ git remote add JohnSmith https://github.com/JohnSmith/quasar.git
$ git pull JohnSmith orange
```

After applying their branch, test it out! Here are some things to think about:

* Does the change actually work?
* Does it have the proper documentation coverage? Should documentation elsewhere be updated?
* Do you like the implementation? Can you think of a nicer or faster way to implement a part of their change?

Once you're happy that the pull request contains a good change, comment on the GitHub issue indicating your approval. Your comment should indicate that you like the change and what you like about it. Something like:

::: tip Example pull request comment
I like the way you've restructured the code in card.vue - much nicer. Documentation is updated too.
:::

If your comment simply reads "+1", then odds are that other reviewers aren't going to take it too seriously. Show that you took the time to review the pull request.

## Contributing to the Quasar Documentation

You can help improve the Quasar documentation by making it more coherent, consistent, or readable, adding missing information, correcting factual errors, fixing typos, or bringing them up to date with the latest edge Quasar.

::: tip Typos or small changes can be fixed directly from the documentation
Use a pencil icon in the top right corner of every documentation page. Edit the source file, preview the changes, add a description of your change and hit `Propose a file change` and on the next screen `Create pull request`.
:::

For larger edits change the Quasar source files (located [here](https://github.com/quasarframework/quasar/tree/dev/docs/src/pages) on GitHub).

### Documentation Best Practices

Over time we consolidated a set of rules which we follow and following them will speed up the merge process:
- Capitalize titles, see [How to Use Capitalize My Title](https://capitalizemytitle.com/).
- Use the present tense.
- Be concise, avoid text / code duplication.
- Link to the external sources which are used as master information sources and are usually updated more frequently, like [Mozilla MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [Vue.js API](https://vuejs.org/api/) rather than compiled tutorials which tend to be outdated soon.
- Do the proofreading before opening a PR
- Do not repeat texts from other sources, but keep only things which are relevant and shows in a context Quasar specific features
- Use official names. For example use `Firebase` instead of `firebase`
- Exclude from PR all drafts and unfinished pages

#### Fork

Navigate to the Quasar [GitHub repository](https://github.com/quasarframework/quasar) and press "Fork" in the upper right-hand corner.

::: warning Select dev branch
Make sure you have `dev` branch selected and this is where all the work is done.
:::

#### Clone the forked repository
To be able to change the documentation, you need to clone forked repository:

```bash
$ git clone https://github.com/your-user-name/quasar.git
$ git checkout dev
```

#### Install dependencies

Install the required dependencies.
```bash
$ cd quasar/docs
$ yarn # or npm install
```

#### Running documentation against your local repository

```bash
$ quasar dev
```

The documentation runs against your local cloned repository.

#### Edit and test your changes locally

#### Commit your changes

When you're happy with the change on your computer, you need to commit the changes to Git:

```bash
$ git commit -a
```

This should fire up your editor to write a commit message. When you have finished, save and close to continue.

#### Update your local repository

It's pretty likely that other changes to master have happened while you were working. Go get them.

1. Add a remote Quasar repository as an upstream

```bash
$ git remote add upstream https://github.com/quasarframework/quasar.git
```

2. Fetch all remote branches

```bash
$ git fetch upstream
```

3. Check out your fork's local `dev` branch.

```bash
$ git checkout dev
> Switched to branch 'dev'
```

4. Merge the changes from `upstream/dev` into your local `dev` branch. This brings your fork's `dev` branch into sync with the upstream repository, without losing your local changes.

```bash
$ git merge upstream/dev
```

No conflicts? Tests still pass? Change still seems reasonable to you? Then move on and open a pull request to apply your changes to the dev branch in main Quasar repository.

#### Issue a pull request

Navigate to your repository you just pushed to (e.g. https://github.com/your-user-name/quasar) and click on "New Pull Request" seen in the left top panel.

Ensure the change sets you introduced are included. Fill in some details about your potential patch including a meaningful title. When finished, press Click on "Create pull request". The Quasar core team will be notified about your submission.

## Write your Story

We're always looking for great write-ups on how you are using Quasar or the great experiences you've had with Quasar. If you write an article, we will publish it on our Medium publication channel and we'll also make sure your article gets the attention it deserves with our social media presence. If you are interested, please contact blog(at)quasar.dev. We'd love to hear from you!

## Create new Quasar App Extension

An easy way to start to contribute to Quasar is to generalize the code you have created on your project and publish it as a Quasar App Extension. Follow this guide on how to [create a new extension](/app-extensions/development-guide/introduction).

When done, submit a PR on [Quasar Awesome](https://github.com/quasarframework/quasar-awesome/blob/master/README.md#community-app-extensions), share your achievement via [Quasar Forum](https://forum.quasar-framework.org/category/15/v1-app-extensions).

## Contributing to the Quasar UI Source Code

As with any project, there are rules to contributing. Ours are written here, please read them carefully. After that, read the [Quasar code of conduct](https://github.com/quasarframework/quasar/blob/dev/.github/CODE_OF_CONDUCT.md) and you’ll be ready to contribute to Quasar’s core repositories.

An article [Look at the source code](https://medium.com/quasar-framework/wip-look-at-the-source-code-please-1b905ea4906) will help you to get familiar with a Quasar code base.

#### Pull Request Guidelines

- Checkout a topic branch from the relevant branch, e.g. `dev` (Qv2) or `v1` (Qv1), and merge back against that branch.

- **DO NOT** check in `dist` in the commits.

- It's OK to have multiple small commits as you work on the PR - we will let GitHub automatically squash it before merging.

- If adding new feature:
  * Provide convincing reason to add this feature. Ideally you should open a suggestion issue first and have it greenlighted before working on it.

- If fixing a bug:
  * If you are resolving a special issue, add `(fix: #xxxx[,#xxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `fix: update entities encoding/decoding (fix #3899)`.
  * Provide detailed description of the bug in the PR. Live demo preferred.

#### Development Setup

You will need [Node.js](http://nodejs.org) version **12.22.1+** along [Yarn](https://yarnpkg.com/) or [NPM](https://docs.npmjs.com/getting-started/installing-node). Read `package.json` and take notice of the scripts you can use.

After cloning the repo run:

``` bash
$ cd ui
$ yarn # or: npm install
```

#### Commonly used NPM scripts

``` bash
# Start dev server with a demo app. This app has Quasar source code linked directly so any change will trigger HMR (Hot Module Reload) on the dev server.
# There's a section for each feature where tests are made.
$ yarn dev # or: npm run dev

# build all dist files, including npm packages
$ yarn build      # or: npm run build
# build only js dist files
$ yarn build js   # or: npm run build js
# build only css dist files
$ yarn build css  # or: npm run build css

# lint sources
$ yarn lint # or: npm run lint
```

#### Project Structure (/ui)

- `build` - contains build-related configuration files. In most cases you don't need to touch them.

- `src` - contains the source code, obviously. The codebase is written in ES2015.

  - `components` - JS, Sass and JSON (API) files for Quasar Vue components

  - `composables` - Quasar's composables for Vue 3 Composition API

  - `directives` - Vue directives supplied by Quasar

  - `plugins` - Quasar plugins

  - `css` - Sass definitions and core code for Quasar themes

  - `utils` - utilities used by the framework and exported to the public API

- `lang` - Quasar language packs

- `icon-set` - Quasar icon sets

- `dist` - contains built files for distribution (only after a build). Note this directory is only updated when a release happens; they do not reflect the latest changes in development branches.

- `dev` - app with Quasar sources linked directly used for testing purposes. Each feature/component has its own `*.vue` file. Adding a new file automatically creates a route for it and adds it to the "homepage" list (based on the file name).

#### Dev Server for Quasar (/ui)
Running `yarn dev` (or `npm run dev`) starts up a dev server which uses HMR (Hot Module Reload) for Quasar source code. You can easily test your changes by making necessary changes to `/dev` `*.vue` files.

## Quasar Contributors

Thank you to all the people who already [contributed to Quasar](https://github.com/quasarframework/quasar/graphs/contributors)!
