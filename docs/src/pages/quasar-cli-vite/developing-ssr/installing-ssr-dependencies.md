---
title: Installing SSR-specific dependencies
desc: (@quasar/app-vite) How to handle SSR-specific dependencies.
---

Notice the `/src-ssr/package.json` file in your generated `/src-ssr` folder. The purpose of it is for you to be able to install packages used by the SSR mode directly under this folder (and not pollute the common `/src`).

```tabs /src-ssr/package.json
<<| json Hono |>>
{
  "name": "quasar-ssr-app-hono",
  "version": "1.0.0",
  "description": "Quasar SSR server folder",
  "type": "module",
  "private": true,
  "dependencies": {
    "hono": "^4.12.12",
    "@hono/node-server": "^2.0.0"
  }
}
<<| json Express |>>
{
  "name": "quasar-ssr-app-express",
  "version": "1.0.0",
  "description": "Quasar SSR server folder",
  "private": true,
  "type": "module",
  "dependencies": {
    "express": "^5.0.0",
    "compression": "^1.8.1",
    "helmet": "^8.1.0"
  },
  "devDependencies": {
    "@types/compression": "^1.8.1", // for TS only
    "@types/express": "^5.0.6" // for TS only
  }
}
<<| json Fastify |>>
{
  "name": "quasar-ssr-app-fastify",
  "version": "1.0.0",
  "private": true,
  "description": "Quasar SSR server folder",
  "type": "module",
  "dependencies": {
    "@fastify/compress": "^8.3.1",
    "@fastify/static": "^9.1.1",
    "fastify": "^5.8.4"
  },
  "devDependencies": {
    "@fastify/middie": "^9.3.1"
  }
}
<<| json Koa |>>
{
  "name": "quasar-ssr-app-koa",
  "version": "1.0.0",
  "description": "Quasar SSR server folder",
  "private": true,
  "type": "module",
  "dependencies": {
    "koa": "^3.2.0",
    "koa-compress": "^5.2.1",
    "koa-connect": "^2.1.1",
    "koa-mount": "^4.2.0",
    "koa-static": "^5.0.0"
  },
  "devDependencies": {
    "@types/koa": "^3.0.2", // for TS only
    "@types/koa-mount": "^4.0.5", // for TS only
    "@types/koa-static": "^4.0.4" // for TS only
  }
}
```

::: warning
If you import anything from node_modules in /src-ssr, then be aware that:

- Packages in `/src-ssr/package.json > dependencies` are runtime dependencies. Quasar adds them to the generated `/dist/ssr/package.json`, and they must be installed when deploying the build.
- Packages in `devDependencies`, such as `@types/*`, are build-time dependencies and are not added to the generated package.

<br>Only runtime `dependencies` are carried into the generated package manifest, keeping production installation focused on what the server needs.
:::

Installing SSR specific packages, like the actual webserver & middlewares & plugins:

```tabs
<<| bash PNPM |>>
# run in /src-ssr for runtime dependencies:
pnpm add <deps>

# run in /src-ssr for deps used by the build system (if any)
pnpm add -D <dev-deps>
<<| bash Yarn |>>
# run in /src-ssr for runtime dependencies:
yarn add <deps>

# run in /src-ssr for deps used by the build system (if any)
yarn add -D <dev-deps>
<<| bash NPM |>>
# run in /src-ssr for runtime dependencies:
npm install <deps>

# run in /src-ssr for deps used by the build system (if any)
npm install -D <dev-deps>
<<| bash Bun |>>
# run in /src-ssr for runtime dependencies:
bun add <deps>

# run in /src-ssr for deps used by the build system (if any)
bun add -D <dev-deps>
```
