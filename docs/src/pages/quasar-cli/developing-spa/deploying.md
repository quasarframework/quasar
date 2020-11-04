---
title: Deploying a SPA
desc: How to publish a Single Page App built by Quasar CLI.
---

There exist many services that allow deploying applications with ease.
To list all of them would not be possible so we will focus on the general deployment process and some specifics for common services.

If your favorite deployment tool is missing feel free to create a pull request on GitHub to add it to the list.

## General deployment

The first step in deploying your Quasar SPA is always to build a production-ready bundle of your files, which gets rid of development statements and minifies your source.

To produce such a build use Quasar CLI with the following command
```bash
$ quasar build
```

This command will build your project in SPA mode and output your production ready bundle to a newly created folder `/dist/spa`.

To serve your production files it is *required* to use a web server, so to serve over http(s):// protocol. Simply opening the `index.html` file from within your browser will not work, since this uses the file:// protocol instead.

Common choices for web servers are [nginx](https://www.nginx.com/), [Caddy](https://caddyserver.com/), [Apache](https://httpd.apache.org/), [Express](https://expressjs.com/); but you should be able to use whatever web server you want.

The web server requires no special setup (unless you built with Vue Router in "history" mode in `quasar.conf.js`). The main requirement is to be able to serve static files from a directory, so consult the documentation of your web server on how to set up static file serving.

An example config for nginx may look like this:
```
server {
    listen 80 http2;
    server_name quasar.myapp.com;

    root /home/user/quasar.myapp.com/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    index index.html;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    access_log off;
    error_log  /var/log/nginx/quasar.myapp.com-error.log error;

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## Important Hosting Configuration

It's important that you do not allow browsers to cache the `index.html` file. Because otherwise updates to this file or to your app might slip through the cracks for browsers that load the index.html from cache.

This is why you must always make sure to add `"Cache-Control": "no-cache"` to the headers of the `index.html` file via your hosting service.

As an example how this is done for Google Firebase, you would add the following to the `firebase.json` configuration:

```json
{
  "hosting": {
    "headers": [
      {
        "source": "/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css|eot|otf|ttf|ttc|woff|woff2|font.css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=604800"
          }
        ]
      }
    ]
  }
}
```

## Deploying with Vercel
Deploying your Quasar application with [Vercel](https://vercel.com/) is really easy.
All you have to do is to download the [vercel-cli](https://vercel.com/download#now-cli) and log in by running:
```bash
$ vercel login
```

Then proceed to build your Quasar application using the steps described in "General deployment" section.

After the build is finished, change directory into your deploy root (example: `/dist/spa`) and run:
```bash
# from /dist/spa (or your distDir)
$ vercel
```

The Vercel CLI should now display information regarding your deployment, like the URL. That's it. You're done.

### Vercel configuration tips
You should consider adding some additional configurations to your project.

* Since Vercel expects the _build_ script to be defined, you may add in `package.json` the following scripts: 
```json
  {
    ..
    "scripts": {
      ...
      "build": "quasar build",
      "deploy": "vercel"
    }
  }
```

* Since Vercel expects the build results to be in `/public` directory, and _Quasar_ has it in `/dist/spa` by default,
consider updating `quasar.conf.js` accordingly:
```js
module.exports = function (ctx) {
  return {
    ...
    build: {
      ...
      distDir: ctx.mode.spa ? 'public' : null,
    }
```

* In order to support SPA routing in the deployed app, consider adding `vercel.json` file in your root folder:
```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}
```
## Deploying with Heroku

Unfortunately, Heroku does not support static sites out of the box. But don't worry, we just need to add an HTTP server to our project so Heroku can serve our Quasar application.

In this example, we will use [Express](https://expressjs.com/) to create a minimal server which Heroku can use.

First, we need to install the required dependencies to our project:
```bash
$ yarn add express serve-static connect-history-api-fallback
```

Now that we have installed the required dependencies, we can add our server. Create a file called `server.js` in the root directory of your project.
```js
const
  express = require('express'),
  serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback'),
  port = process.env.PORT || 5000

const app = express()

app.use(history())
app.use(serveStatic(__dirname + '/dist/spa'))
app.listen(port)
```

Heroku assumes a set of npm scripts to be available, so we have to alter our `package.json` and add the following under the `script` section:
```js
"build": "quasar build",
"start": "node server.js",
"heroku-postbuild": "yarn && yarn build"
```

Now it is time to create an app on Heroku by running:
```bash
$ heroku create
```

and deploy to Heroku using:
```bash
$ heroku deploy
```

## Deploying with Surge

[Surge](https://surge.sh/) is a popular tool to host and deploy static sites.

If you want to deploy your application with Surge you first need to install the Surge CLI tool:
```bash
$ npm install -g surge
```

Next, we will use Quasar CLI to build our app:
```bash
$ quasar build
```

Now we can deploy our application using Surge by calling:
```bash
$ surge dist/spa
```

Now your application should be successfully deployed using Surge. You should be able to adapt this guide to any other static site deployment tool.

## Deploying on GitHub Pages

To deploy your Quasar application to GitHub pages the first step is to create a special repository on GitHub which is named `<username>.github.io`. Clone this repository to your local machine.

Next, you need to build your Quasar application like it is described in the "General deployment section". This will result in a `/dist/spa` directory. Copy the content of this folder to your cloned repository.

The last step is to add a commit in your repository and push to GitHub. After a short time, you should be able to visit your Quasar application at `https://<username>.github.io/`.

### Adding a custom domain to GitHub pages

Please see the [GitHub pages guides](https://help.github.com/articles/using-a-custom-domain-with-github-pages/) for an in-depth explanation on how to set up a custom domain.

### Automated deployment to GitHub pages with push-dir

Manual copying all your files to your GitHub Pages repository can be a cumbersome task to do. This step can be automated by using the [push-dir](https://github.com/L33T-KR3W/push-dir) package.

First, install the package with:
```js
$ yarn add --dev push-dir
```

Then add a `deploy` script command to your `package.json`:
```json
"scripts": {
  "deploy": "push-dir --dir=dist/spa --remote=gh-pages --branch=master"
}
```

Add your GitHub Pages repository as a remote named `gh-pages`:
```bash
$ git remote add gh-pages git@github.com:<username>/<username>.github.io.git
```

Now you can build and deploy your application using:
```bash
$ quasar build
$ yarn deploy
```
which will push the content of your build directory to your master branch on your GitHub Pages repository.
