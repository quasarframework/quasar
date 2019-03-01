---
title: Commands List
---

Familiarize yourself with the list of available commands inside a Quasar project:

``` bash
$ quasar

  ___
 / _ \ _   _  __ _ ___  __ _ _ __
| | | | | | |/ _` / __|/ _` | '__|
| |_| | |_| | (_| \__ \ (_| | |
 \__\_\\__,_|\__,_|___/\__,_|_|



  Example usage
    $ quasar <command> <options>

  Help for a command
    $ quasar <command> --help
    $ quasar <command> -h

  Options
    --version, -v Print Quasar App CLI version

  Commands
    dev, d        Start a dev server for your App
    build, b      Build your app for production
    clean, c      Clean all build artifacts
    new, n        Quickly scaffold page/layout/component/... vue file
    mode, m       Add/remove Quasar Modes for your App
    inspect       Inspect generated Webpack config
    ext, e        Manage Quasar App Extensions
    run, r        Run specific command provided by an installed
                    Quasar App Extension
    describe      Describe a Quasar API (component)
    test, t       Run @quasar/testing App Extension command
                    - requires @quasar/testing App Extension to be installed
                    - this is an alias command for convenience purposes
    info, i       Display info about your machine and your App
    help, h       Displays this message
```

See help for any command:
``` bash
$ quasar [command name] --help
```

## create

Creates an App folder with initial project boilerplate.
``` bash
# currently installs v0.17, for v1 see below
$ quasar create <folder_name>

## for Quasar v1.0-beta, run this instead:
$ quasar create <folder_name> -b dev
```

## info
The Quasar CLI is equipped with a stable combination of multiple NPM build packages (Webpack, Vue, etc) which gets updated frequently after heavy testing.

In order for you to see what versions of Node, NPM, Quasar CLI, Quasar, Vue, Webpack, Cordova, Babel and many more, issue this command in a Quasar project folder:
``` bash
$ quasar info
```

## dev
```bash
$ quasar dev -h

  Description
    Starts the app in development mode (hot-code reloading, error
    reporting, etc)
  Usage
    $ quasar dev -p <port number>
  Options
    --mode, -m       App mode [spa|ssr|pwa|cordova|electron] (default: spa)
    --port, -p       A port number on which to start the application
    --hostname, -H   A hostname to use for serving the application
    --help, -h       Displays this message

    Only for Cordova mode:
    --target, -T     (required) App target
                        [android|ios|blackberry10|browser|osx|ubuntu|webos|windows]
    --emulator, -e   (optional) Emulator name
                        Example: iPhone-7, iPhone-X
```

The Quasar development server allows you to develop your App by compiling and maintaining code in-memory. A web server will serve your App while offering hot-reload out of the box. Running in-memory offers faster rebuilds when you change your code.

> Hot Reload is much more than just refreshing your browser when code changes. It skips the refresh and updates your code on the fly, while maintaining your App's state (like your Vue's model data). Please note that there are cases when this is impossible, so the dev webserver will simply refresh your browser. (Always ensure you are running only one instance of Quasar CLI at a time, otherwise Hot-Reload and other stuff will break!)

Based on what you want to develop, you can start the development server by using "quasar dev" command as follows:

``` bash
# Developing a SPA
$ quasar dev
# ...or
$ quasar dev -m spa

# Developing for SSR
$ quasar dev -m ssr

# Developing a PWA
$ quasar dev -m pwa

# Developing a Mobile App (through Cordova)
$ quasar dev -m cordova -T [android|ios]

# Developing an Electron App
$ quasar dev -m electron
```

If you wish to change the hostname or port serving your App you have 3 options:
* Edit '/quasar.conf.js':
  ```js
  devServer: {
    host: '...',
    port: ...
  }
  ```
* Through '-H' (hostname) and '-p' (port) command options.
* If this is a one time thing, specify the hostname and/or port as an environment variable:
  ``` bash
  $ PORT=3000 quasar dev
  $ HOSTNAME=1.1.1.14 quasar dev
  ```

If there appears to be an issue with hot reload, you can try two fixes:
* Change the permissions for the project folder with

  ```bash
  sudo chown -R username: .
  ```
* or run the dev server with root privileges

  ```bash
  sudo quasar dev
  ```

## build / clean
```bash
$ quasar build -h

  Description
    Builds distributables of your app.
  Usage
    $ quasar build -p <port number>
  Options
    --mode, -m      App mode [spa|ssr|pwa|cordova|electron] (default: spa)
    --target, -T    App target
                      - Cordova (default: all installed)
                        [android|ios|blackberry10|browser|osx|ubuntu|webos|windows]
                      - Electron with default "electron-packager" bundler (default: yours)
                        [darwin|win32|linux|mas|all]
                      - Electron with "electron-builder" bundler (default: yours)
                        [darwin|mac|win32|win|linux|all]
    --debug, -d     Build for debugging purposes
    --skip-pkg, -s  Build only UI (skips creating Cordova/Electron executables)
                      - Cordova (it only fills in /src/cordova/www folder with the UI code)
                      - Electron (it only creates the /dist/electron/UnPackaged folder)
    --help, -h      Displays this message

    ONLY for Electron mode:
    --bundler, -b   Bundler (electron-packager or electron-builder)
                      [packager|builder]
    --arch, -A      App architecture (default: yours)
                      - with default "electron-packager" bundler:
                          [ia32|x64|armv7l|arm64|mips64el|all]
                      - with "electron-builder" bundler:
                          [ia32|x64|armv7l|arm64|all]
```

The Quasar CLI can pack everything together and optimize your App for production. It minifies source code, extracts vendor components, leverages browser cache and much more.

``` bash
# build for production
$ quasar build

# build a PWA (check other modes as well)
$ quasar build -m pwa

# create a production build with ability to debug it
# (has source-maps and code is NOT minified)
$ quasar build -d
```

You can also clean up all the build assets:
``` bash
$ quasar clean
```

## new

Generates Components, Pages, Layouts, Vuex Store.

::: tip
This command is simply a helper in order to quickly scaffold a page/layout/component/vuex store module. You are not required to use it, but can help you when you don't know how to start.
:::

```bash
$ quasar new -h

  Description
    Quickly scaffold a page/layout/component/store module.

  Usage
    $ quasar new [p|page] <page_file_name>
    $ quasar new [l|layout] <layout_file_name>
    $ quasar new [c|component] <component_file_name>
    $ quasar new [b|boot] <boot_name>
    $ quasar new [s|store] <store_module_name>

    # Examples:

    # Create src/pages/MyNewPage.vue:
    $ quasar new p MyNewPage

    # Create src/pages/MyNewPage.vue and src/pages/OtherPage.vue:
    $ quasar new p MyNewPage OtherPage

    # Create src/layouts/shop/Checkout.vue
    $ quasar new layout shop/Checkout.vue

  Options
    --help, -h     Displays this message
```

## mode
```bash
$ quasar mode -h

  Description
    Add/Remove support for PWA / Cordova / Electron modes.
  Usage
    $ quasar mode [add|remove pwa|ssr|cordova|electron]

    # determine what modes are currently installed:
    $ quasar mode

  Options
    --help, -h    Displays this message
```

When you initialize a project with the CLI, you can build SPA (Single Page Website/Application), SSR (Server-side Render Website/Application with optional PWA client takeover), PWA (Progressive Web App), Mobile App (through Cordova), and/or Electron Apps. When you develop for SSR, PWA, Cordova or Electron, you need these modes installed. If you issue "quasar dev" or "quasar build" they will automatically be installed.

These modes will add a "src-*" folder into your project with very specific code for it:

| Folder | Mode | Description |
| --- | --- | --- |
| src-ssr | ssr | Contains the production Node server files. |
| src-pwa | pwa | Contains the Service Worker file that you can tweak. |
| src-cordova | cordova | Is a Cordova project folder that will be using your 'src' as content. Tweak Cordova config, add/remove platforms, splash screens, Cordova plugins and so on from this folder. Do NOT touch "src-cordova/www" folder though as it will get overwritten at every build. |
| src-electron | electron | Has code for the main Electron thread. The renderer thread will be your app in 'src'. |

If for some reason you decide you don't need a mode, you can remove it. **This will permanently delete** the respective "src-*" folder.
```bash
$ quasar mode remove pwa
```

## describe
This command is useful to describe the API of any Quasar components/directives/plugins that your project is using. **It is specific to your Quasar version installed in your project folder.**

Examples: `$ quasar describe QIcon`, `$ quasar describe TouchPan`, `$ quasar describe Cookies`.

```bash
$ quasar describe QIcon

 Describing QIcon component API
 Description is based on your project's Quasar version

 Properties

   name (String)
     Description: Name of the icon, following Quasar convention
     Examples:
       map
       ion-add

   color (String)
     Description: Color name for component from the Quasar Color Palette
     Examples:
       primary
       teal-10

   size (String)
     Description: Size in CSS units, including unit name
     Examples:
       16px
       2rem

   left (Boolean)
     Description: Apply a standard margin on the left side. Useful if icon is on the right side of something.

   right (Boolean)
     Description: Apply a standard margin on the right side. Useful if icon is on the left side of something.

 Slots

   default
     Suggestions: QTooltip or QMenu

 Scoped Slots

   *No scoped slots*

 Events

   *No events*

 Methods

   *No methods*
```

## inspect
This command can be used to inspect the Webpack config generated by Quasar CLI.

```bash
$ quasar inspect -h

  Description
    Inspect Quasar generated Webpack config

  Usage
    $ quasar inspect
    $ quasar inspect -c build
    $ quasar inspect -m electron -p 'module.rules'

  Options
    --cmd, -c        Quasar command [dev|build] (default: dev)
    --mode, -m       App mode [spa|ssr|pwa|cordova|electron] (default: spa)
    --depth, -d      Number of levels deep (default: 5)
    --path, -p       Path of config in dot notation
                        Examples:
                          -p module.rules
                          -p plugins
    --help, -h       Displays this message
```

## ext
This command is used to manage [App Extensions](/quasar-cli/app-extensions/introduction).

```bash
$ quasar ext -h

  Description
    Manage Quasar App Extensions

  Usage
    # display list of installed extensions
    $ quasar ext

    # Add Quasar App Extension
    $ quasar ext add <ext-id>

    # Remove Quasar App Extension
    $ quasar ext remove <ext-id>

    # Add Quasar App Extension, but
    # skip installing the npm package
    # (assumes it's already installed)
    $ quasar ext invoke <ext-id>

    # Remove Quasar App Extension, but
    # skip uninstalling the npm package
    $ quasar ext uninvoke <ext-id>

  Options
    --help, -h       Displays this message
```

## run
This command is used to run commands supplied by the [App Extensions](/quasar-cli/app-extensions/introduction) that you've installed into your project folder.

```bash
$ quasar run -h

  Description
    Run app extension provided commands

  Usage
    $ quasar run <extension-id> <cmd> [args, params]

    $ quasar run iconify create -s
        # Note: "iconify" is an example and not a real extension.
        # Looks for installed extension called "iconify"
        # (quasar-app-extension-iconify extension package)
        # and runs its custom defined "create" command
        # with "-s --mark some_file" params

  Options
    --help, -h       Displays this message
```

## serve
This command can be used in production too and it is being supplied by the globall installation of `@quasar/cli` package.

```bash
$ quasar serve -h

  Description
    Start a HTTP(S) server on a folder.

  Usage
    $ quasar serve [path]
    $ quasar serve . # serve current folder

    If you serve a SSR folder built with the CLI then
    control is yielded to /index.js and params have no effect.

  Options
    --port, -p             Port to use (default: 8080)
    --hostname, -H         Address to use (default: 0.0.0.0)
    --gzip, -g             Compress content (default: true)
    --silent, -s           Supress log message
    --colors               Log messages with colors (default: true)
    --open, -o             Open browser window after starting
    --cache, -c <number>   Cache time (max-age) in seconds;
                           Does not apply to /service-worker.js
                           (default: 86400 - 24 hours)
    --micro, -m <seconds>  Use micro-cache (default: 1 second)
    --history              Use history api fallback;
                           All requests fallback to index.html
    --https                Enable HTTPS
    --cert, -C [path]      Path to SSL cert file (Optional)
    --key, -K [path]       Path to SSL key file (Optional)
    --proxy <file.js>      Proxy specific requests defined in file;
                           File must export Array ({ path, rule })
                           See example below. "rule" is defined at:
                           https://github.com/chimurai/http-proxy-middleware
    --help, -h             Displays this message

  Proxy file example
    module.exports = [
      {
        path: '/api',
        rule: { target: 'http://www.example.org' }
      }
    ]
    --> will be transformed into app.use(path, httpProxyMiddleware(rule))
```

### Custom Node server
When building a SPA or PWA, the distributable folder can be served by any static webserver. To test it out (assuming you don't have a specific publicPath or not using Vue Router "history" mode), you can use the "http-server" npm package.

Or you can build your own server. Here are some examples:
```js
// when using default Vue Router "hash" mode
const
  express = require('express'),
  serveStatic = require('serve-static'),
  port = process.env.PORT || 5000

const app = express()

app.use(serveStatic(...path-to-dist...))
app.listen(port)
```

```js
// when using Vue Router "history" mode
const
  express = require('express'),
  serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback'),
  port = process.env.PORT || 5000

const app = express()

app.use(history())
app.use(serveStatic(...path-to-dist...))
app.listen(port)
```

If you need URL rewrites of API, or simply put you want to proxy your API requests, then you can use "http-proxy-middleware" package:
```js
// add this to one of the two previous examples:
const proxy = require('http-proxy-middleware')

// ...
app.use('/api', proxy({
  '/api': {
    target: `http://my-api.com:5050`,
    pathRewrite: {"^/api" : ""}
  }
}))

// then app.listen(...)
```

Finally, run one of these files:
```bash
$ node my-server.js
```
