---
title: SSG 404 Error Page
desc: (@quasar/app-vite) How to render a 404 error page for SSG mode with Quasar CLI.
---

::: warning Warning! Beta Stage
The Quasar SSG Mode is currently in the "beta" stage. Based on the community feedback, the API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

By default, a `404.html` file will be generated on production with Quasar CLI. However, you can change the name for it or even instruct Quasar CLI to skip generating it.

## Configuration

```js /quasar.config file
ssg: {
  /**
   * The name of the html file that will be used for the 404 page.
   * If set to false, no 404 page will be generated.
   *
   * You will need to properly configure the webserver to serve this
   * file for 404 errors.
   *
   * Make sure to name it so that the SSG generated html files
   * don't conflict with it!
   *
   * @default '404.html'
   */
  error404HtmlFilename?: string | false;
}
```

You will then need to configure your deployment webserver to point to this html file when a 404 error is encountered.
