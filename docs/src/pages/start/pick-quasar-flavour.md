---
title: Pick a Quasar Flavour
desc: 'Get started with Quasar by picking one of its flavours: Quasar CLI, Vue CLI or UMD'
---

There are four ways of using Quasar. Pick the one that suits you best:

<div class="q-mx-md row items-stretch q-gutter-xs">
  <q-btn no-caps color="purple" push stack padding="sm lg" to="/start/quasar-cli">
    <span class="text-bold">Quasar CLI (with Vite or Webpack)</span>
    <span style="font-size:0.8em">Strongly recommended - the premium DX</span>
  </q-btn>
  <q-btn label="UMD/Standalone" color="teal-6" no-caps push to="/start/umd" />
  <q-btn label="Vite plugin" color="teal-6" no-caps push to="/start/vite-plugin" />
  <q-btn label="Vue CLI plugin" color="teal-6" no-caps push to="/start/vue-cli-plugin" />
</div>

### Comparison

| Feature                                                                                    | Quasar UMD | Quasar CLI (with Vite or Webpack) | Quasar Vite Plugin                  | Vue CLI Plugin |
| ------------------------------------------------------------------------------------------ | -------    | ---------- | ---------------------------- | -------------- |
| Ability to embed into an existing project                                                  | **Yes**    | -          | **Yes, if it is Vite app**   | **Yes, if it is Vue CLI app** |
| Progressive integration of Quasar                                                          | **Yes**    | -          | -                            | - |
| Include Quasar from public CDN                                                             | **Yes**    | -          | -                            | - |
| Build SPA, PWA                                                                             | **Yes**    | **Yes**    | **Yes**                      | **Yes** |
| Build SSR (+ optional PWA client takeover)                                                 | -          | **Yes**    | -                            | Yes(*) |
| Build Mobile Apps via Cordova or Capacitor                                                 | **Yes**    | **Yes**    | Yes(*)                       | Yes(*) |
| Develop Mobile Apps with HMR directly on your phone.                                       | -          | **Yes**    | Yes(*)                       | Yes(*) |
| Build Desktop Apps via Electron                                                            | -          | **Yes**    | Yes(*)                       | Yes(*) |
| Build Browser Extensions                                                                   | -          | **Yes**    | Yes(*)                       | Yes(*) |
| Quasar **App Extensions**                                                                  | -          | **Yes**    | -                            | - |
| Easy management of App icons & splash screens via [Icon Genie CLI](/icongenie/introduction) | -         | **Yes**    | -                            | - |
| Dynamic RTL support for Quasar components                                                  | **Yes**    | **Yes**    | -                            | **Yes** |
| Generating your own website/app RTL equivalent CSS rules automatically by Quasar           | -          | **Yes**    | -                            | **Yes** |
| **Ensure everything "simply works" out of the box**, using latest and greatest Quasar specs.   | -      | **Yes**    | -                            | - |
| **Tight integration between build modes**, taking full advantage of all Quasar's capabilities. | -      | **Yes**    | -                            | - |
| One codebase to create SPA, PWA, SSR, Mobile Apps, Electron Apps and Browser Extensions        | -      | **Yes**    | -                            | - |
| Tree Shaking                                                                               | -          | **Yes**    | **Yes**                      | **Yes** |
| SFC (Single File Component - for Vue) support                                              | -          | **Yes**    | **Yes**                      | **Yes** |
| Advanced configuration through dynamic quasar.config.js                                      | -          | **Yes**    | -                            | - |
| Unit & end to end testing support                                                          | -          | **Yes**    | **Yes**                      | **Yes** |
| TypeScript support                                                                         | -          | **Yes**    | **Yes**                      | **Yes** |
| **Best and Most Popular Choice!**                                                          |            | **YES!** |                             | |
|                                                                                            | Quasar UMD | Quasar CLI (with Vite or Webpack) | Quasar Vite Plugin                  | Vue CLI Plugin |


::: tip (*) Important!
Although you may get a similar multi-platform support via Vite (directly) or the Vue CLI and some Vue community built plugins, these 3rd party supported build paths aren't tightly integrated with Quasar's components. Thus, as you run into problems with these 3rd party plugins, you will have to depend on the support of each individual plugin developer. With Quasar, you have a one-stop-shop should anything go wrong. Also, the Quasar CLI ensures applications are built to the best possible standards in both performance, project size and best practices. You will find no such guarantees anywhere else!
:::

### Recommendation
Let's get you going with **Quasar's CLI**! You'll be up and running with a new project in no time.

<q-btn icon-right="launch" label="Start with Quasar CLI" to="/start/quasar-cli" class="q-mt-sm q-mb-lg" />
