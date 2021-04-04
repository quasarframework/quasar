---
title: Vue SSR Directives
desc: Managing the Vue directives for SSR in a Quasar app.
---

A SSR app has the same code running on server and on client. Declaring a Vue directive (or directly importing it) in a .vue SFC file is usually enough for making it to work on non-SSR builds. But on SSR builds and due to the architecture of Vue 3 (when also using vue-loader to handle the .vue files, like Quasar does), it requires some extra leg work. This page will teach what you need to do.

When building the server-side of your app, Vue requires you to specify the SSR transformation for each of your custom Vue directives, otherwise it will error out saying that it doesn't know how to handle that specific directive when encountered in your SFC templates.

::: tip
You will NOT need to do anything for the Quasar supplied Vue directives to work. The Quasar App CLI takes care of declaring the SSR transformations for it already.
:::

## How to declare a directive

When adding the SSR mode, Quasar CLI will create the `src-ssr/directives` folder. It will watch this folder for any .js (or .ts if TS is enabled) files and inject these transformations into the build.

Let's say that we have a custom Vue directive named `my-dir` that we are using in our app. We've declared or imported it into our app, but now in order to make SSR's server-side code running correctly, we now need to create a file for it. Since the directive is named `my-dir`, we'll create the `my-dir.js` file:

```
// src-ssr/directives/my-dir.js

export default (dir) => {
  return {
    props: []
  }
}
```

The above is essentially a noop SSR transformation for our directive. Based on what your Vue directive does on client-side, you should write the appropriate Vue SSR transformation. Then you should repeat the process for all your **non-Quasar** Vue directives.

::: tip
Please head to the Vue 3 documentation which should explain how to write a Vue SSR transformation for your directive. Please note that at the moment of writing these lines, the Vue 3 SSR documentation website is still incomplete.
:::

If unsure how to write the necessary transformation function, then simply use the noop transformation from the above code sample for all your directives.

::: danger
What you need to make sure is that the name of the files match with the **kebab-case** name of your directives.
:::

## Hot module reload

Due to the fact that these transformations are supplied to vue-loader, whenever you add/remove/change any of the files directly under the `src-ssr/directives` folder, the dev server will automatically reboot. This means that changes are costly so you should keep this in mind.
