---
title: SSG 404 Error Page
desc: (@quasar/app-vite) How to render a 404 error page for SSG mode with Quasar CLI.
---

::: warning Warning! Beta Stage
The Quasar SSG Mode is currently in the "beta" stage. Based on the community feedback, the API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

By default, a production SSG build renders the app's Vue Router not-found route and writes it to `dist/ssg/404.html`.

For this to produce the expected page, your router should include a catch-all route:

```js /src/router/routes file
{
  path: '/:catchAll(.*)*',
  component: () => import('pages/ErrorNotFound.vue')
}
```

## Configuration

```js /quasar.config file
export default defineConfig(() => ({
  ssg: {
    // Default: '404.html'
    error404HtmlFilename: 'not-found.html'
  }
}))
```

Set `error404HtmlFilename: false` if the host supplies its own error page or if you generate custom 404 files through `getSsgPages()`.

The filename alone does not configure your host. Static providers such as Netlify, Cloudflare Pages, Vercel, and GitHub Pages automatically recognize a root `404.html`. Other servers may need an explicit rule. For nginx:

```nginx
location / {
    try_files $uri $uri/ =404;
}

error_page 404 /404.html;
```

Keep the HTTP response status as `404`; serving the correct markup with a `200` response creates a soft 404. See [Deploying SSG](/quasar-cli-vite/developing-ssg/deploying#404-page) for more host-specific guidance.
