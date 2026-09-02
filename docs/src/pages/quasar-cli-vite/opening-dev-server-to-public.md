---
title: Opening Your Dev Server to the Public
desc: (@quasar/app-vite) How to offer temporary access to your development server to anyone on the Internet.
---

At some point you may want to show someone else the project you've been working on. Fortunately, there are a couple of good tools to accomplish this, [localhost.run](https://localhost.run/) and [Ngrok](https://ngrok.com/). Both create a tunnel to your dev server and (by default) auto-generate an internet address on their respective servers to offer to your clients or anyone special you'd like to show your work to.

::: warning
Opening your dev server to the public poses security risks. Be absolutely cautious when using tools like this.

The Quasar development server is not a hardened production server and does not add authentication. A tunnel can expose development-only routes, source maps, error details, and anything reachable through `devServer.proxy`. Never place secrets in client-exposed environment variables, and do not tunnel a project connected to sensitive development or production data.

Prefer a tunnel with access controls, share its URL only with intended recipients, and stop both the tunnel and development server as soon as testing is finished.
:::

## Allowing the tunnel's hostname

Out of the box, the dev server only answers requests whose `Host` header is `localhost`, a subdomain of `.localhost`, or an IP address. A tunnel serves your app under its own hostname (something like `b8ootd-ip-157-211-195-182.tunnelmole.com`), so your visitors would otherwise be greeted by:

```
Blocked request. This host ("b8ootd-ip-157-211-195-182.tunnelmole.com") is not allowed.
```

Add the hostname that your tunnel handed you to `quasar.config > devServer > allowedHosts` (the `devServer` section is the [Vite server config](https://vite.dev/config/server-options)):

```js /quasar.config file
devServer: {
  allowedHosts: ['b8ootd-ip-157-211-195-182.tunnelmole.com']
}
```

A running `quasar dev` picks up quasar.config changes on its own, so there is no need to restart it by hand.

Most tunnels hand out a fresh subdomain on each run. Should you not want to edit quasar.config every time, a leading dot allows a domain together with all of its subdomains:

```js /quasar.config file
devServer: {
  // allows any subdomain of the tunneling service
  allowedHosts: ['.tunnelmole.com']
}
```

::: warning
Treat this as a temporary change and remove the entry once you are done, especially before committing.

Never use `allowedHosts: true` (which accepts any `Host` header) as a shortcut: it opens your dev server to DNS rebinding attacks, where a website that some other tab of your browser visits can reach your app and read whatever it serves.
:::

## Testing a Capacitor app through a tunnel

A tunnel is also a handy way to run the native app on a phone that is not on your local network, or to get a secure context (HTTPS) for APIs such as the camera or geolocation.

Do not put the tunnel's hostname into `devServer.host`. That option is the address the dev server binds to, so it must be a local IP or hostname; a public hostname fails with "Invalid devServer host: no local network address matches it". Keep the default host and instead allow the tunnel's hostname as shown above, then point the native app at the tunnel by setting `server.url` in your Capacitor config. Quasar only fills in `server.url` when you have not set it yourself (see [defineCapacitorConfig](/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor#the-definecapacitorconfig-helper)):

```js /quasar.config file
devServer: {
  allowedHosts: ['b8ootd-ip-157-211-195-182.tunnelmole.com']
}
```

```ts /src-capacitor/capacitor.config.ts
import { defineCapacitorConfig } from '@quasar/app-vite/capacitor'

export default defineCapacitorConfig({
  appId: 'org.example.app',
  appName: 'My App',
  server: {
    url:
      process.env.QUASAR_DEV === 'true'
        ? 'https://b8ootd-ip-157-211-195-182.tunnelmole.com'
        : undefined
  }
})
```

Hot module reloading follows the page's origin, so it works through the tunnel without further configuration.

## Using Tunnelmole

Tunnelmole will work on any machine with Node.js 16+ installed and has no non-JavaScript dependencies.

First, install `tunnelmole` package globally:

```tabs
<<| bash PNPM |>>
pnpm add -g tunnelmole
<<| bash Yarn |>>
yarn global add tunnelmole
<<| bash NPM |>>
npm install -g tunnelmole
<<| bash Bun |>>
bun add -g tunnelmole
```

Then, assuming you are running quasar on port `80`, run the following:

```bash
tmole 80
```

If your port is different to `80`, change `80` to your port.

Here's the full command with output:

```
$ tmole 80
http://b8ootd-ip-157-211-195-182.tunnelmole.com is forwarding to localhost:80
https://b8ootd-ip-157-211-195-182.tunnelmole.com is forwarding to localhost:80
```

If you are self hosting your own Tunnelmole service or you have a set an API key for the official service, you can run the following to use a custom subdomain (again, replace `80` with your port if it is different).

```bash
tmole 80 as mysubdomain.tunnelmole.com
```

It is also possible to launch Tunnelmole from code after adding it as a development dependency with your project's package manager.

First import tunnelmole. Both ES and CommonJS modules are supported.

Importing tunnelmole as an ES module

```js
// import as ESM:
import { tunnelmole } from 'tunnelmole'

// or import as CommonJS module:
const tunnelmole = require('tunnelmole/cjs')
```

Once the module is imported you can start tunnelmole with the code below, changing port `80` to the port your application listens on if it is different.

```js
const url = await tunnelmole({
  port: 80
  // Optionally, add "domain: 'mysubdomain.tunnelmole.com'" if using a custom subdomain
})
// url = https://idsq6j-ip-157-211-195-169.tunnelmole.com
```

## Using localhost.run

1. Assuming you have an SSH shell, you only need issue the following command (substituting your details)

```bash
ssh -R 80:localhost:8080 ssh.localhost.run
# In case your development server doesn't run on port 8080 you need to change the number to the correct port
```

2. That's it, and you will now have a random subdomain based on your current system username assigned to you like so:

```bash
ssh -R 80:localhost:8080 ssh.localhost.run
# Connect to http://fakeusername-random4chars.localhost.run or https://fakeusername-random4chars.localhost.run
# Press ctrl-c to quit.
```

It's not currently possible to request your own subdomain.

## Using Ngrok

1. Download and install ngrok [here](https://ngrok.com/download).
   (Please note that the ngrok executable file does not need to be placed in or run from inside your cordova folder. When on a mac it's best to place the ngrok executable file inside `/usr/local/bin` to be able to run it globally.)

2. Start your Dev server: `quasar dev`

3. Create your ngrok connection

```bash
ngrok http 8080
# In case your development server doesn't run on port 8080 you need to change the number to the correct port
```

4. ngrok shows the url in the command line when it started.

```
Tunnel Status                 online
Version                       2.0/2.0
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://92832de0.ngrok.io -> localhost:8080
Forwarding                    https://92832de0.ngrok.io -> localhost:8080

Connections                  ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

Please be careful as the 'Forwarding' URL will be accessible to anyone until this connection is closed again.

### Inspecting traffic

When running ngrok, visit `http://localhost:4040` to inspect the traffic.

This tool allows for custom domains, password protection and a lot more. If you require further assistance, please refer to the [ngrok docs](https://ngrok.com/docs) for more information.
