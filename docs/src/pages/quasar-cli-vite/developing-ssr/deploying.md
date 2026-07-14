---
title: Deploying SSR
desc: (@quasar/app-vite) How to publish a Quasar server-side rendered app.
---

SPA and PWA output can be served by a static webserver. An SSR build also contains a production Node.js webserver and requires a JavaScript runtime.

## The Distributables Folder

After building in SSR mode (`quasar build -m ssr`), the generated folder contains the compiled application, production webserver, and a deployment-specific `package.json`.

You'll notice that it contains a `package.json` file of its own. It has an npm script defined, called "start":

```js
"scripts": {
  "start": "node index.js"
}
```

Copy the distributables folder to the server, install its production dependencies with your package manager, and run the `start` script. This starts the generated webserver.

::: tip
The distributables folder does not require the rest of the project or a global `@quasar/cli` installation. It does require the dependencies declared in its generated `package.json`.
:::

## Enhancing Performance

By default, the webserver runs on only one of the available server's cores. What you could do is make it use all cores. There is a solution for this: [PM2](http://pm2.keymetrics.io/).

After installing PM2 on your server, your npm start script can look like this instead:

```js
"scripts": {
  "start": "pm2 start index.js"
}
```

## Deploying with Cleavr

You can use [Cleavr](https://cleavr.io) to deploy Quasar SSR apps to several popular VPS providers. Cleavr will automatically set up PM2 with cluster mode enabled for your app.

Add a new **Node.JS SSR** site to Cleavr and then configure the web app settings with the following:

- **Entry point:** index.js
- **Build command:** npx quasar build --mode ssr
- **Artifact path:** dist/ssr

## Serverless

If you are deploying to a Serverless service, then please read about [SSR Webserver](/quasar-cli-vite/developing-ssr/ssr-webserver#serverless) on how to prepare for it.
