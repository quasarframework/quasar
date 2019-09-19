---
title: Vue CLI 3 Quasar Plugin
desc: How to embed Quasar into a Vue CLI app.
---

::: warning
Cross-platform support with Vue CLI v3+ is handled by community plugins. These are not tightly integrated with Quasar as with Quasar CLI and may have issues.

Also, before you begin on this path of development with Quasar, we need you to understand the following. To guarantee you the best developer experience with Quasar, we highly recommend using Quasar's CLI and building your project with it. You'll get the full range of features offered by Quasar, like full cross-platform build support and you can still do practically everything you'd like to do with Vue too, i.e. use Vue plugins via Quasar's [Boot Files](/quasar-cli/cli-documentation/boot-files#Anatomy-of-an-boot-file).
:::

To work with Quasar via its Vue CLI plugin, you will need to make sure you have @vue/cli v3+ installed globally. To make sure you have the right version, use this command:

```bash
$ vue --version
```

Should you have Vue CLI 2.x.x. installed, you'll need to uninstall it with:

```bash
$ npm uninstall -g vue-cli
```

Install Vue CLI v3+ as follows:

```bash
$ npm install -g @vue/cli
```

If you don't yet have a project created with @vue/cli v3+, then do so with:

```bash
$ vue create my-app
```

## Add Vue CLI Quasar Plugin
Navigate to the newly created project folder and add the cli plugin. Before installing it, make sure to commit your current changes should you wish to revert them later.

::: warning
Cross-platform support with Vue CLI 3 is handled by community plugins. These are not tightly integrated with Quasar as with Quasar CLI and may have issues.
:::

```bash
$ cd my-app
$ vue add quasar
```

The CLI will ask you if you want the plugin to replace some existing files. It is recommended that you do this, if you wish to have an example, so you can quickly develop your app.

Your Vue config (in package.json or vue.config.js file, depending on what you chose when you created your vue app) will also contain a `quasar` object with some basic Quasar configuration.
