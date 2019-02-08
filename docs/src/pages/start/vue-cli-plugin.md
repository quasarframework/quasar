---
title: Vue CLI 3 Quasar Plugin
---

::: danger
Vue CLI 3 Quasar Plugin has not been updated to support v1.0-beta yet. Will be updated soon.
:::

To work with Quasar via its Vue CLI 3 plugin, you will need to make sure you have vue-cli 3.x.x installed globally. To make sure you have Vue CLI 3.0, use this command:

```bash
$ vue --version
```

You should see something like:

```bash
$ vue --version
3.2.3
```

Should you have Vue CLI 2.x.x. installed, you'll need to uninstall it with:

```bash
$ npm uninstall -g vue-cli
# or:
$ yarn global remove vue-cli
```
and then install Vue CLI 3.0 as follows:

```bash
$ yarn global add @vue/cli
# or:
$ npm install -g @vue/cli // recommended
```

If you don't yet have a project created with vue-cli 3.x, then do so with:

```bash
$ vue create my-app
```

## Add Quasar Vue CLI Plugin
Navigate to the newly created project folder and add the cli plugin. Before installing it, make sure to commit your current changes should you wish to revert them later.

```bash
$ cd my-app
$ vue add quasar
```

The CLI will ask you if you want the plugin to replace some existing files. It is recommended that you do this, if you wish to have an example, so you can quickly develop your app.

Your Vue config (in package.json or vue.config.js file, depending on what you chose when you created your vue app) will also contain a `quasar` object with some basic Quasar configuration.
