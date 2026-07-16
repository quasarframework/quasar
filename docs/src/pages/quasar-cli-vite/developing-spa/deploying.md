---
title: Deploying a SPA
desc: (@quasar/app-vite) How to publish a Single Page App built by Quasar CLI.
---

Many services can deploy a static SPA. This page focuses on the general requirements and gives examples for several common providers.

If your favorite deployment tool is missing feel free to create a pull request on GitHub to add it to the list.

## General deployment

The first step is to build a production bundle:

To produce such a build use Quasar CLI with the following command:

```bash
quasar build
```

By default, this writes the production-ready files to `/dist/spa`. If you configure `build.distDir`, deploy that directory instead.

Serve these files through HTTP or HTTPS. Opening `index.html` directly with the `file://` protocol is not supported.

Common choices for web servers are [nginx](https://www.nginx.com/), [Caddy](https://caddyserver.com/), [Apache](https://httpd.apache.org/), [Express](https://expressjs.com/); but you should be able to use whatever web server you want.

Hash-mode routing requires only static file hosting. History-mode routing also requires a fallback that serves `index.html` when a requested application route does not match a static file. Do not rewrite requests for existing assets.

An example config for nginx may look like this:

```nginx
server {
    listen 80;
    server_name quasar.myapp.com;

    root /home/user/quasar.myapp.com/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.html;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location = /robots.txt  { access_log off; log_not_found off; }

    access_log off;
    error_log  /var/log/nginx/quasar.myapp.com-error.log error;

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## Important Hosting Configuration

Do not cache `index.html` for long periods. Otherwise, returning visitors may continue loading asset URLs from an older deployment. Hashed JavaScript, CSS, and other immutable assets can be cached for much longer.

Configure a revalidation policy for `index.html`, such as `Cache-Control: no-cache`, through your hosting service.

As an example how this is done for Google Firebase, you would add the following to the `firebase.json` configuration:

```json firebase.json
{
  "hosting": {
    "headers": [
      {
        "source": "/index.html",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css|eot|otf|ttf|ttc|woff|woff2|font.css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

## Deploying with Cloudflare Pages

Cloudflare Pages can deploy the SPA directly from a Git repository. Configure the Pages project with:

- Build command: `quasar build`
- Build output directory: `dist/spa`

Cloudflare rebuilds the site when you push to the connected production or preview branches. When no top-level `404.html` is deployed, Pages treats the project as a SPA and routes unknown paths to `index.html`.

For a direct upload instead, install Wrangler and deploy the built directory:

```tabs
<<| bash PNPM |>>
pnpm add -D wrangler
pnpm quasar build
pnpm wrangler pages deploy dist/spa
<<| bash Yarn |>>
yarn add -D wrangler
yarn quasar build
yarn wrangler pages deploy dist/spa
<<| bash NPM |>>
npm install -D wrangler
npx quasar build
npx wrangler pages deploy dist/spa
<<| bash Bun |>>
bun add -D wrangler
bunx quasar build
bunx wrangler pages deploy dist/spa
```

If you change `build.distDir`, pass the configured output directory instead. See the [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/) for Git integration, direct uploads, redirects, and custom domains.

## Deploying with Vercel

Connect the Git repository to Vercel and configure:

- Build command: `quasar build`
- Output directory: `dist/spa`

For CLI deployment, install the [Vercel CLI](https://vercel.com/docs/cli), log in, and run it from the project root:

```bash
vercel login
vercel
```

For history-mode routing, add `vercel.json` at the project root. The filesystem check lets static assets resolve before the SPA fallback:

```json vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

You can also define project scripts:

```json /package.json
"scripts": {
  "build": "quasar build",
  "deploy": "vercel --prod"
}
```

If you change `build.distDir`, update Vercel's output directory to match.

## Deploying with Heroku

Heroku does not serve static sites directly, so the application needs a small HTTP server.

In this example, we will use [Express](https://expressjs.com/) to create a minimal server which Heroku can use.

First, we need to install the required dependencies to our project:

```tabs
<<| bash PNPM |>>
pnpm add express serve-static connect-history-api-fallback
<<| bash Yarn |>>
yarn add express serve-static connect-history-api-fallback
<<| bash NPM |>>
npm install express serve-static connect-history-api-fallback
<<| bash Bun |>>
bun add express serve-static connect-history-api-fallback
```

Now that we have installed the required dependencies, we can add our server. Create a file called `server.js` in the root directory of your project.

```js
import path from 'node:path'
import express from 'express'
import serveStatic from 'serve-static'
import history from 'connect-history-api-fallback'

const port = process.env.PORT || 5000
const app = express()

app.use(history())
app.use(serveStatic(path.join(import.meta.dirname, 'dist/spa')))
app.listen(port)
```

Heroku expects a set of package scripts, so add the following under `scripts` in `package.json`:

```js /package.json
"scripts": {
  "build": "quasar build",
  "start": "node server.js",
  "heroku-postbuild": "quasar build"
}
```

Now it is time to create an app on Heroku by running:

```bash
heroku create
```

and deploy to Heroku using:

```bash
git init
heroku git:remote -a <heroku app name>

git add .
git commit -am "make it better"
git push heroku main
```

For existing Git repositories, simply add the heroku remote:

```bash
heroku git:remote -a <heroku app name>
```

## Deploying with Surge

[Surge](https://surge.sh/) is a popular tool to host and deploy static sites.

If you want to deploy your application with Surge you first need to install the Surge CLI tool:

```tabs
<<| bash PNPM |>>
pnpm add --global surge
<<| bash NPM |>>
npm install --global surge
```

Next, we will use Quasar CLI to build our app:

```bash
quasar build
```

Now we can deploy our application using Surge by calling:

```bash
surge dist/spa
```

Now your application should be successfully deployed using Surge. You should be able to adapt this guide to any other static site deployment tool.

## Deploying on GitHub Pages

GitHub Pages can deploy the production bundle with GitHub Actions. In the repository settings, select **Pages > Build and deployment > GitHub Actions**, then add `.github/workflows/deploy.yml`:

```yaml
name: Deploy Quasar SPA to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm quasar build
      - uses: actions/upload-pages-artifact@v4
        with:
          path: dist/spa

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

For a project site served from `https://<username>.github.io/<repository>/`, set `build.publicPath` to `/<repository>/`. A user or organization site named `<username>.github.io` is served from `/` and does not need that override.

GitHub Pages does not provide a general history-mode fallback to `index.html`. Use Vue Router's hash mode unless every route has a corresponding static file or another layer handles the rewrites.

To use a custom domain, configure it in the repository's Pages settings. See the [GitHub Pages documentation](https://docs.github.com/en/pages) for DNS and domain-verification instructions.
