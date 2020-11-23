---
title: Upgrade Guide
desc: How to upgrade Quasar from older versions to the latest one.
---

## Upgrading from older v2 to latest v2

### With UMD
Simply replace the version string in all the CSS and JS tags that refer to Quasar to the newer version.

### With Quasar CLI

```bash
# run these commands inside
# of a Quasar v1 project

# check for upgradable packages
$ quasar upgrade

# do the actual upgrade
$ quasar upgrade --install
```

::: warning Note for code editor terminals
If you're using a code editor terminal instead of the real one, you run `quasar upgrade` and get an error *Command not found* or *@quasar/cli* version appears to be *undefined*, you will need to go to the settings of your code editor terminal and untick the option (or its equivalent) *Add 'node_modules/.bin' from the project root to %PATH%* then restart your code editor.
:::

### With Vue CLI

```bash
$ yarn upgrade quasar@latest
```

You may also want to make sure you have the latest of `@quasar/extras` package too:

```bash
$ yarn add @quasar/extras@latest
```

## Upgrading from v1 to v2

Before you start down this journey of upgrading Quasar Legacy to Quasar v1 you should know a few things:
1) Read the documentation before asking questions on Discord server or forums.
2) Prepare a CodePen so staff can help you.
3) Dig into the Quasar source code (it'll help you understand the framework as well as teach you best practices for programming with Vue).
4) Don't use framework components as mixins unless absolutely necessary (wrap them if you need).
5) Don't target inner component stuff with CSS selectors unless absolutely necessary.
6) We recommend `yarn` whenever possible because of its speed and efficient use. However, when using globals, we still recommend using `npm`, especially if you use `nvm` (Node Version Manager).
7) Use `git` for repository management and make regular commits, it is like taking notes on the process and lets you revert to a previous state in case you get stuck.
8) Use Quasar boot files for any pre-mounting app routines.
9) Be very cautious when using other libraries - Quasar can't ensure they will be fully compatible
10) Finally, become a [backer/sponsor](https://donate.quasar.dev) and get access to the special Discord support chat room for priority support.

### Introduction to Upgrading

While upgrading Legacy Quasar projects appears like a reasonable choice, it may not always present itself as the best solution. Just be aware that there are alternative measures that may be faster and more efficient. For instance, sometimes it is best to create a new project and port your old project. In this manner, if you do it slowly and methodologically you can see issues and resolve them quickly. This is the opposite of upgrading a project in-place, which can break everything simultaneously. Should you go with the upgrade, we have assembled the steps needed below. However, you will still need to update any Quasar components that went through a revision to get to v1.

In either case, when you build out your project as you go through this process, you may get a build error that gives no valid information and you will have no idea what might be causing it. Should this happen to you, we recommend running `quasar build` instead of `quasar dev` as the production build will sometimes give different information (from webpack) than the dev build.

If you get stuck, check out the forums and visit Discord server for help. Not just from staff, but from the community as well.

Whichever path you take, good luck!

::: warning Info
It should be noted that we have tried our hardest to make sure everything in the Upgrade documentation is correct. However, because this has been a manual process there are likely errors. If you find any, don't be afraid to make a PR and propose a change to that which needs to be corrected.
:::

