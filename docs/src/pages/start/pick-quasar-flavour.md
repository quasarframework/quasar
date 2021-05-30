---
title: Getting Started - Pick a Quasar Flavour
desc: 'Get started with Quasar by picking one of its flavours: Quasar CLI, Vue CLI or UMD'
---

**If you'd like to learn more about why choosing Quasar** then read the [Introduction to Quasar](/introduction-to-quasar). Otherwise, let's get started by choosing how you'd like to use Quasar.

There are three ways of using Quasar. Pick the one that suits you best:

- [UMD/Standalone](/start/umd) (embed into an existing project through CDN, progressive integration)
- [Quasar CLI](/start/quasar-cli) (**the premium developer experience and highly recommended**)
- [Vue CLI 3 plugin](/start/vue-cli-plugin)

Here's a quick comparison:

| Feature                                                                                    | Quasar UMD | Quasar CLI | Vue CLI 3 Plugin              |
| ------------------------------------------------------------------------------------------ | ------- | ---------- | ----------------------------- |
| Ability to embed into an existing project                                                  | **Yes** | -          | **Yes, if it is Vue CLI app** |
| Progressive integration of Quasar                                                          | **Yes** | -          | -                             |
| Include Quasar from public CDN                                                             | **Yes** | -          | -                             |
| Build SPA, PWA                                                                             | **Yes** | **Yes**    | **Yes**                       |
| Build SSR (+ optional PWA client takeover)                                                 | -       | **Yes**    | Yes(*)                          |
| Build Mobile Apps via Cordova or Capacitor                                                 | **Yes** | **Yes**    | Yes(*)                          |
| Develop Mobile Apps with HMR directly on your phone.                                       | -       | **Yes**    | Yes(*) |
| Build Desktop Apps via Electron                                                            | -       | **Yes**    | Yes(*)                             |
| Build Browser Extensions                                                                   | -       | **Yes**    | Yes(*)                          |
| Quasar **App Extensions**                                                                  | -       | **Yes**    | - |
| Easy management of App icons & splash screens via [Icon Genie CLI](/icongenie/introduction)    | - | **Yes** | - |
| Dynamic RTL support for Quasar components                                                  | **Yes** | **Yes**    | **Yes**                       |
| Generating your own website/app RTL equivalent CSS rules automatically by Quasar           | -       | **Yes**    | **Yes**                       |
| **Ensure everything "simply works" out of the box**, using latest and greatest Quasar specs.   | -       | **Yes**    | -                             |
| **Tight integration between build modes**, taking full advantage of all Quasar's capabilities. | -       | **Yes**    | -                             |
| One codebase to create SPA, PWA, SSR, Mobile Apps, Electron Apps and Browser Extensions                             | -       | **Yes**    | Yes(*)                      |
| Tree Shaking                                                                               | -       | **Yes**    | **Yes**                       |
| SFC (Single File Component - for Vue) support                                              | -       | **Yes**    | **Yes**                       |
| Advanced configuration through dynamic quasar.conf.js                                      | -       | **Yes**    | -                             |
| Unit & end to end testing support                  | -       | **Yes**    | **Yes**                       |
| TypeScript support                                                              | -       | **Yes**    | **Yes**                       |
|**Best and Most Popular Choice!**  |  |**YES!(*)** |  |


::: tip (*)Important!
Although you may get a similar multi-platform support via the Vue CLI and some Vue community built plugins, these 3rd party supported build paths aren't tightly integrated with Quasar's components. Thus, as you run into problems with these 3rd party plugins, you will have to depend on the support of each individual plugin developer. With Quasar, you have a one-stop-shop should anything go wrong. Also, the Quasar CLI ensures applications are built to the best possible standards in both performance, project size and best practices. You will find no such guarantees anywhere else!
:::

So, let's get you going with **Quasar's CLI**! You'll be up and running with a new project in a matter of minutes.

<q-btn push no-caps color="brand-primary" icon-right="launch" label="Install Quasar CLI" to="/quasar-cli/installation" class="q-mt-sm q-mb-lg" />

