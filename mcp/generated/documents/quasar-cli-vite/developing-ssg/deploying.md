---
title: Deploying SSG
description: (@quasar/app-vite) How to publish a Quasar SSG app.
canonical: https://quasar.dev/quasar-cli-vite/developing-ssg/deploying
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

::: warning Warning! Beta Stage
The Quasar SSG Mode is currently in the "beta" stage. Based on the community feedback, the API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

An SSG build produces a directory of static files. You deploy those files to a static web server or static hosting provider. There is no Node.js renderer to run in production.

The important difference from a SPA deployment is that SSG can generate many html files, not just one `index.html`. Your host should serve those generated files first, then apply any client-side fallback rules that you explicitly need.

## Build Output

Build the app in SSG mode:

```bash
quasar build -m ssg
```

The default output folder is:

> dist/ssg

Deploy the contents of `dist/ssg`, not the folder itself, unless your host asks for a publish directory.

For example, when a route is rendered as `/guide/install`, the generated file is usually written as:

> dist/ssg/guide/install/index.html

Static hosts that support directory indexes can serve that file for `/guide/install` or `/guide/install/`.

## Static Host Checklist

Use this order when configuring a host:

1. Serve existing files and generated route directories first.
2. Serve long-lived cache headers for hashed assets such as JavaScript, CSS, fonts, and images.
3. Serve html files with short or no browser caching, especially when deploying frequent updates.
4. If you use hybrid SSG + partial CSR, rewrite the designated client-rendered routes to the CSR shell file.
5. Serve the generated `404.html` file for real not-found requests.

Avoid copying the usual SPA rule of rewriting every unknown request to `index.html`. That can hide missing generated pages and can make a pre-rendered SSG site behave like a regular SPA.

## 404 Page

By default, Quasar generates:

> dist/ssg/404.html

Configure your host to serve it when a request does not match a generated file or static asset.

You can change or disable this filename with `ssg.error404HtmlFilename` in `/quasar.config`:

```js /quasar.config file
export default defineConfig(() => {
  return {
    ssg: {
      error404HtmlFilename: '404.html'
    }
  }
})
```

Some hosts automatically use a root `404.html` file. Others require an explicit `error_page`, rewrite, or fallback rule.

## Hybrid SSG + Partial CSR

If you configure `ssg.clientSideRenderingRoutes`, Quasar can generate a separate html shell for routes that should be rendered only on the client:

```js /quasar.config file
export default defineConfig(() => {
  return {
    ssg: {
      clientSideRenderingHtmlFilename: 'csr.html',

      /**
       * Exclude these routes from pre-rendering and generate csr.html
       * Note on picomatch patterns:
       *   "/admin" matches the exact route only
       *   "/admin/**" matches the exact route and all sub-routes of /admin
       *   "/admin/*" matches only direct sub-routes of /admin
       *   "/admin/{users,settings}" matches both exact routes /admin/users and /admin/settings
       */
      clientSideRenderingRoutes: ['/dashboard/**', '/admin']
    }
  }
})
```

In this setup, configure your host to rewrite only those route patterns to:

> dist/ssg/csr.html

Do not use `csr.html` as the fallback for every unknown URL unless you intentionally want unmatched routes to become client-rendered pages. Keep `404.html` for real not-found requests.

## Examples

### Example: nginx

This example serves generated SSG files first, uses a CSR shell only for `/dashboard` and `/admin`, and uses `404.html` for all other missing files:

::: tip
This and the following examples assume that `build.publicPath` is `/`. If you deploy under a sub-folder, prefix the request paths and fallback destinations with that sub-folder.
:::

```nginx
server {
    listen 80;
    server_name example.com;

    root /var/www/example.com/dist/ssg;
    index index.html;

    location = /dashboard {
        try_files $uri $uri/ /csr.html;
    }

    location ^~ /dashboard/ {
        try_files $uri $uri/ /csr.html;
    }

    location = /admin {
        try_files $uri $uri/ /csr.html;
    }

    location ^~ /admin/ {
        try_files $uri $uri/ /csr.html;
    }

    location / {
        try_files $uri $uri/ =404;
    }

    error_page 404 /404.html;
}
```

If your site does not use hybrid CSR routes, remove the `/dashboard` and `/admin` blocks.

### Example: Netlify

Set the publish directory to:

> dist/ssg

For a fully pre-rendered SSG site, the generated files and root `404.html` are enough. Netlify automatically serves the root `404.html` for requests that do not resolve to a static file.

For hybrid CSR routes, add a `_redirects` file to `/public`. Quasar copies it to the root of the output folder:

```text public/_redirects
/dashboard    /csr.html  200
/dashboard/*  /csr.html  200
/admin        /csr.html  200
/admin/*      /csr.html  200
```

Netlify serves existing static files before applying these unforced rewrites. You do not need a catch-all rule for `404.html`.

Adjust the route patterns to match your `ssg.clientSideRenderingRoutes` configuration. See the [Netlify redirects documentation](https://docs.netlify.com/manage/routing/redirects/overview/) for more options.

### Example: Cloudflare Pages

Set the build output directory to:

> dist/ssg

Cloudflare Pages serves matching html files and automatically uses a root `404.html` for not-found requests. The presence of `404.html` is also important because, without it, Cloudflare Pages assumes that the site is an SPA and applies an automatic SPA fallback.

For hybrid CSR routes, add the same route-specific proxy rules to `/public/_redirects`:

```text public/_redirects
/dashboard    /csr.html  200
/dashboard/*  /csr.html  200
/admin        /csr.html  200
/admin/*      /csr.html  200
```

Cloudflare Pages applies `_redirects` rules before matching static files. Make sure these patterns match only routes that you intentionally excluded from SSG rendering. Do not add a catch-all proxy to `csr.html`.

See the Cloudflare Pages documentation for details about [redirects](https://developers.cloudflare.com/pages/configuration/redirects/) and [not-found behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/#not-found-behavior).

### Example: Vercel

Set the output directory to:

> dist/ssg

For a fully pre-rendered SSG site, Vercel can serve the generated static files directly.

For hybrid CSR routes, add rewrites for only those routes:

```json vercel.json
{
  "rewrites": [
    { "source": "/dashboard", "destination": "/csr.html" },
    { "source": "/dashboard/:path*", "destination": "/csr.html" },
    { "source": "/admin", "destination": "/csr.html" },
    { "source": "/admin/:path*", "destination": "/csr.html" }
  ]
}
```

Vercel automatically serves a `404.html` from the output directory when no other static file or route matches. See the [Vercel rewrites documentation](https://vercel.com/docs/rewrites) for more routing options.

### Example: GitHub Pages

GitHub Pages works best for fully pre-rendered SSG sites:

1. Build with `quasar build -m ssg`.
2. Publish the contents of `dist/ssg`.
3. Keep the generated `404.html` at the root of the published output.

GitHub Pages does not provide path-specific rewrite rules like `nginx`, Netlify, Cloudflare Pages, or Vercel. If your app depends on hybrid CSR fallbacks such as `/admin/** -> /csr.html`, choose a host that supports rewrites or make those routes part of the generated SSG page list.

For a project site such as `https://username.github.io/repository/`, also set `build.publicPath` to `/repository/` before building.

## SSG with PWA

When `ssg.pwa` is enabled, Quasar also generates service worker assets and an offline shell, usually:

> dist/ssg/offline.html

Deploy the whole `dist/ssg` directory, including the service worker and manifest assets. Make sure your host does not rewrite service worker files, the web manifest, icons, or generated Workbox assets to another html file.

See [SSG with PWA](/quasar-cli-vite/developing-ssg/ssg-with-pwa) for the SSG-specific PWA options.

## Deploying Under a Sub-Folder

If the site is served from a sub-folder, configure the public path before building:

```js /quasar.config file
export default defineConfig(() => {
  return {
    build: {
      publicPath: '/docs/'
    }
  }
})
```

Then configure the host so the generated files are served from the same base path. Test deep links directly in the browser, not only client-side navigation from the home page.

## Cache Headers

The exact syntax and the provider defaults vary, but a good starting point for a self-managed server is:

- Html files: `Cache-Control: no-cache`
- Hashed assets: `Cache-Control: public, max-age=31536000, immutable`
- Service worker files: follow the recommendations from the [PWA deployment guide](/quasar-cli-vite/developing-pwa/deploying)

Do not allow stale html files to remain cached after a new deployment. Otherwise a browser may load old html that points to assets no longer present on the server.

Managed hosts may already provide deployment-aware caching. Check the host's defaults before overriding them. For example, Cloudflare Pages recommends its default caching behavior for most sites and supports custom browser headers through a `/public/_headers` file.

## Final Verification

After deployment, open a few URLs directly in a fresh browser tab:

- `/`
- a generated nested route such as `/guide/install`
- a not-found route that should show `404.html`
- a hybrid CSR route, if configured
- a refresh on a generated route after client-side navigation

If these direct requests work, the static host is serving the SSG output correctly.
