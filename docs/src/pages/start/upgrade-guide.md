---
title: Upgrade Guide
desc: How to upgrade Quasar from older versions to the latest one.
---

::: danger Quasar v2 beta
Until the final stable version is released, some aspects of the framework may change. We're not planning for additional changes, but unforeseen reported issues may require us to do breaking changes (unlikely, but keep this in mind). So please make sure that you read each v2 beta version's release notes carefully before upgrading.
:::

We did our best so that this transition from Quasar v1 to v2 to be as painless as possible. The API of Quasar components, directives and plugins

## Upgrading from older v2 to latest v2

### With UMD
Simply replace the version string in all the CSS and JS tags that refer to Quasar to the newer version.

### With Quasar CLI

```bash
# run these commands inside
# of a Quasar v2 project

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

Please note that Quasar v2 is based on Vue 3, as opposed to previous version which was based on Vue 2. This means that your app code (Vue components, directives, etc) should be Vue 3 compliant too, not just the Quasar UI. If you are using additional libraries in your app, please make sure that you have their Vue 3 versions.

If you get stuck, check out the forums and visit Discord server for help. Not just from staff, but from the community as well.

::: warning Info
It should be noted that we have tried our hardest to make sure everything in the Upgrade documentation is correct. However, because this has been a manual process there are likely errors. If you find any, don't be afraid to make a PR and propose a change to that which needs to be corrected.
:::

#### Vue 3

Since you will also switch to [Vue 3](https://v3.vuejs.org), it's best that you also take a look at its [migration guide](https://v3.vuejs.org/guide/migration/introduction.html).

If you're using .vue files, you'll most likely have a fairly easy transition since 1) vue-loader (supplied by `@quasar/app`) is the one parsing the [SFC syntax](https://v3.vuejs.org/guide/single-file-component.html) and instructing Vue 3 what to do and 2) you can still use the Options API (although we recommend that you convert to the newer and better [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html)).

We suggest that you first convert your project to Quasar v2 while maintaining Options API (because your components are already in Options API form and you probably want to ensure everything is working first). After this transition you can convert all your Vue components to Composition API, but in no way is this a requirement.

Vue 3 is to be used along with a new major version of [Vue Router](https://next.router.vuejs.org), which comes with its own [breaking changes](https://next.router.vuejs.org/guide/migration/) that you should be aware of.

### Initial Steps

// todo
### Quasar components

// the following is a draft

* Important Vue 3 breaking changes:

v-model equivalent:
"value" -> "modelValue";
"@input" -> "@update:modelValue"

scopedSlots -> slots

* Use "class" and "style" instead of "content-class" / "content-style" for QDrawer/QDialog/QMenu/QTooltip

* QBreadcrumbsEl
Removed: "append" (due to new vue-router)
Added: "tag", "ripple"

* QChatMessage
"label-html" -> "label-sanitize"
"name-html" -> "name-sanitize"
"text-html" -> text-sanitize"
"stamp-html" -> stamp-sanitize"

* QDate
"@update:modelValue" > details > removed "changed"

* QExpansionItem
Removed: "append" (due to new vue-router)

### Quasar directives

// the following is a draft
### Quasar plugins

// the following is a draft

* Loading
html -> sanitize

* Meta plugin
Composition API form; Options API form
