---
title: The import.meta.env and dotenv files support
desc: (@quasar/app-vite) How to use import.meta.env in a Quasar app.
---

Using `import.meta.env` can help you in many ways:

- differentiating runtime procedure depending on Quasar Mode (SPA/PWA/Cordova/Electron)
- differentiating runtime procedure depending if running a dev or production build
- adding flags to it based on terminal environment variables at build time

::: tip Terminology on client vs backend code
We will be using `client code` and `backend code` on this page:

- The backend code refers to the /quasar.config file and the code that your client users don't have access to, like the SSR Webserver or SSR/SSG Server code.
- The client code refers to code that is being shipped to your client, like /src, /src-pwa, /src-electron, SSR Client etc.

:::

## Values provided by Quasar CLI

| `import.meta.env.<name>` | Type    | Meaning                                                                                      |
| ------------------------ | ------- | -------------------------------------------------------------------------------------------- |
| `QUASAR_DEV`             | Boolean | Code runs in development mode                                                                |
| `QUASAR_PROD`            | Boolean | Code runs in production mode                                                                 |
| `QUASAR_DEBUG`           | Boolean | Code runs in development mode or `--debug` flag was set for production mode                  |
| `QUASAR_CLIENT`          | Boolean | Code runs on client (not on server)                                                          |
| `QUASAR_SERVER`          | Boolean | Code runs on server (not on client)                                                          |
| `QUASAR_MODE`            | String  | Quasar CLI mode (`spa`, `pwa`, ...)                                                          |
| `QUASAR_<MODE>_MODE`     | Boolean | Code runs in `<MODE>` Quasar mode. Example: QUASAR_ELECTRON_MODE                             |
| `QUASAR_TARGET`          | String  | Can be `ios` or `android` for Cordova/Capacitor modes and `chrome` or `firefox` for BEX mode |

## Usage

### Javascript / Typescript

```js Basic example
if (import.meta.env.QUASAR_DEV) {
  console.log(`I'm on a development build`)
}

// import.meta.env.MODE is the <mode> in
// "quasar dev/build -m <mode>"
// (defaults to 'spa' if -m parameter is not specified)

if (import.meta.env.QUASAR_MODE === 'electron') {
  // ...
}

// alternatively, use:
if (import.meta.env.QUASAR_ELECTRON_MODE) {
  // ...
}
```

When compiling your website/app, `if ()` branches depending on import.meta.env are evaluated, and if the expression is `false`, they get stripped out of the file. Example:

```js Stripping out code
if (import.meta.env.QUASAR_DEV) {
  console.log('dev')
} else {
  console.log('build')
}

// running with "quasar dev" will result in:
console.log('dev')
// while running with "quasar build" will result in:
console.log('build')
```

Notice above that the `if`s are evaluated and also completely stripped out at compile-time, resulting in a smaller bundle.

Also, you can combine what you learned above with dynamic imports:

```js Dynamic import
if (import.meta.env.QUASAR_MODE === 'electron') {
  import('my-fancy-npm-package').then(package => {
    // notice "default" below, which is the prop with which
    // you can access what your npm imported package exports
    package.default.doSomething()
  })
}

// alternatively:
if (import.meta.env.QUASAR_ELECTRON_MODE) {
  // ...
}
```

### The /index.html file

<!-- prettier-ignore -->
```
<%= importMetaEnv.MY_ENV_VAR_OR_DEFINE %>
<!-- or shorthand: -->
%MY_ENV_VAR_OR_DEFINE%

<% if (importMetaEnv.MY_ENV_VAR_OR_DEFINE) { %>Wow!<% } %>
```

## Adding to import.meta.env

### With /quasar.config file

You can add your own definitions through the `/quasar.config` file:

```ts /quasar.config file
build: {
  /**
   * Define global constant replacements. Entries will be defined as globals
   * during dev and statically replaced during build.
   *
   * This gets supplied to Vite's & Rolldown's own "define" option,
   * which in turn uses Oxc's "define" feature to perform replacements.
   *
   * All non-string values are automatically JSON.stringified by Quasar CLI.
   * This ensures consistency between Vite & Rolldown builds and avoids Rolldown to fail.
   *
   * @example { __APP_VERSION__: JSON.stringify('v1.0.0') }
   * @example { 'import.meta.env.APP_VERSION': JSON.stringify('v1.0.0') }
   * @example { __API_URL__: 'window.__backend_api_url' }
   */
  define?: Record<
    string,
    string | number | boolean | undefined | null | any[] | Record<string, any>
  >;

  /**
   * Sugar for `define` option. Define global constant replacements that will
   * be automatically transformed into "define" entries with the `import.meta.env` prefix
   * and already JSON-stringified.
   *
   * @example { SOME_DEFINE: 'my-string' } will be transformed into { 'import.meta.env.SOME_DEFINE': '"my-string"' }
   * @example { VERSION: 22 } will be transformed into { 'import.meta.env.VERSION': '22' }
   */
  defineEnv?: Record<
    string,
    string | number | boolean | undefined | null | any[] | Record<string, any>
  >;
}
```

```js /quasar.config example
export default defineConfig(ctx => {
  return {
    // ...

    build: {
      // passing down to UI code from the quasar.config file
      define: {
        'import.meta.env.API': JSON.stringify(
          ctx.dev ? 'https://dev.api.com' : 'https://prod.api.com'
        ),
        'import.meta.env.VERSION': JSON.stringify(22)
      },

      // ALTERNATIVE using the sugar syntax of defineEnv:
      defineEnv: {
        API: ctx.dev ? 'https://dev.api.com' : 'https://prod.api.com',
        VERSION: 22
      }
    }
  }
})
```

Then, in your website/app, you can access `import.meta.env.API` and it will point to one of those two links above, depending on dev or production build type. The `import.meta.env.VERSION` will also be available.

::: tip
There is a fundamental difference between `build.define` and `build.defineEnv`. The build.defineEnv is syntax sugar over build.define:

- It automatically translates to build.define syntax, adding "import.meta.env." to the key prefix and JSON stringifies the value.
- The build.define can also be used to inject non "import.meta.env" definitions. Example:

<br>

```js
build: {
  define: {
    __APP_VERSION__: JSON.stringify('v1.0.0')
  }
}

// then use as __APP_VERSION__ directly
```

:::

### From command line

We can set variables from the terminal.

```bash
MY_API=api.com QCLI_MY_API=api.com  quasar build
```

```js
// client code:
console.log(import.meta.env.QCLI_MY_API) // "api.com"
console.log(import.meta.env.MY_API) // undefined

// backend code
console.log(import.meta.env.QCLI_MY_API) // "api.com"
console.log(import.meta.env.MY_API) // "api.com"
```

We can combine it with values coming from the terminal:

```bash
# we set an env variable in terminal
MY_API=api.com quasar build
MY_API=api.com quasar dev
```

```js /quasar.config file
// then we pick it up in the /quasar.config file
build: {
  defineEnv: {
    API: ctx.dev
      ? 'https://dev.' + import.meta.env.MY_API
      : 'https://prod.' + import.meta.env.MY_API
  }
}
```

### From dotenv files

```bash /.env
# NOT exposed to client code, but exposed to backend;
# it does NOT start with QCLI_ prefix:
SOME_VAR=content

# this will be embedded into backend & client code,
# as it starts with QCLI_ prefix:
QCLI_SOME_VAR=content
```

```js Usage example
import.meta.env.SOME_VAR // ❌ Not available in client code
import.meta.env.QCLI_SOME_VAR // ✅ Available in client code
```

Your dotenv files can contain references (cross dotenv files, but the order matters):

```bash /.env
PASSWORD="s1mpl3"

# reference PASSWORD above:
DB_PASS=$PASSWORD

# reference a variable coming from terminal;
# let's say we have SOME_VALUE defined in terminal:
MY_VAR=$SOME_VALUE
```

## Wrong usage

You might be getting `X is undefined` errors in the browser console if you are accessing the variables in a wrong way or if you have a misconfiguration.

```js
// in /quasar.config file:
build: {
  defineEnv: {
    FOO: 'hello',
  }
}

// in your app:
console.log(import.meta.env.FOO) // ✅
console.log(import.meta.env.foo) // ❌ Case sensitive
console.log(import.meta.env.F0O) // ❌ Typo in the variable name (middle o is 0(zero))
console.log(import.meta.env.BAR) // ❌ It's not defined in config
```

For code in your `/src-ssr`, `/src-electron`, etc. (Quasar Mode folders) there are additional restrictions:

```js
const { FOO } = import.meta.env // ❌ It doesn't allow destructuring or similar
console.log(import.meta.env.FOO) // ✅ It can only replace direct usage like this

function getEnv(name) {
  return import.meta.env[name] // ❌ It can't analyze dynamic usage
}

console.log(import.meta.env) // ❌ It will output {}
```

## The order when constructing import.meta.env

As you may have noticed, the `import.meta.env` gets constructed from multiple inputs. You may have cases where you overwrite a definition. To make it clear, this is the order that is taken into account:

1. Dotenv files
2. Terminal variables
3. /quasar.config > build > define
4. /quasar.config > build > defineEnv

## Type inference

Quasar CLI automatically infers and maintains the type for process.env (terminal variables), dotenv files, /quasar.config > define & defineEnv.

| Example value | Inferred type | Replaced with  |
| ------------- | ------------- | -------------- |
| true          | boolean       | `true`         |
| 42            | number        | `42`           |
| null          | null          | `null`         |
| hello         | string        | `"hello"`      |
| [1,2,3]       | string        | `"[1,2,3]"`    |
| {some:'obj'}  | string        | `"{some:obj}"` |

Here is an example with the input/config and output (your code):

```tabs Input/config
<<| bash Terminal |>>
# we declare some process env variables when invoking a quasar cmd:
FLAG_BOOL=true FLAG_STR=HelloWorld FLAG_NULL=null FLAG_ARR=[1,2,3] FLAG_OBJ={key:'val'} quasar dev
<<| js /quasar.config file |>>
build: {
  define: {
    DEFINE_BOOL: JSON.stringify(true),
    DEFINE_STR: JSON.stringify("hello"),
    DEFINE_NUMBER: JSON.stringify(42),
    DEFINE_NULL: JSON.stringify(null),
    DEFINE_ARR: JSON.stringify([1,2,3]),
    DEFINE_OBJ: JSON.stringify({key: "val"})
  },

  defineEnv: {
    DEFINE_ENV_BOOL: true,
    DEFINE_ENV_STR: "hello",
    DEFINE_ENV_NUMBER: 42,
    DEFINE_ENV_NULL: null,
    DEFINE_ENV_ARR: [1,2,3],
    DEFINE_ENV_OBJ: {key:"val"}
  }
}
<<| bash /.env |>>
# backend only:
DOTENV_BOOL=true
DOTENV_STR=hello
DOTENV_NUMBER=42
DOTENV_NULL=null
DOTENV_ARR=[1,2,3]
DOTENV_OBJ={"key":"val"}

# client (with default QCLI_ prefix) & backend:
QCLI_DOTENV_BOOL=true
QCLI_DOTENV_STR=hello
QCLI_DOTENV_NUMBER=42
QCLI_DOTENV_NULL=null
QCLI_DOTENV_ARR=[1,2,3]
QCLI_DOTENV_OBJ={"key":"val"}
```

```tabs In your code
<<| js From terminal |>>
console.log(
  import.meta.env.FLAG_BOOL, // true
  typeof import.meta.env.FLAG_BOOL // boolean
);
console.log(
  import.meta.env.FLAG_STR, // "HelloWorld"
  typeof import.meta.env.FLAG_STR // string
);
console.log(
  import.meta.env.FLAG_NULL, // null
  import.meta.env.FLAG_NULL === null // is true
);
console.log(
  import.meta.env.FLAG_ARR, // "[1,2,3]"
  typeof import.meta.env.FLAG_ARR // string
);
console.log(
  import.meta.env.FLAG_OBJ, // "{key:'val'}"
  typeof import.meta.env.FLAG_OBJ // string
);
<<| js From build.define |>>
console.log(DEFINE_BOOL, typeof DEFINE_BOOL); // true boolean
console.log(DEFINE_STR, typeof DEFINE_STR); // "hello" string
console.log(DEFINE_NUMBER, typeof DEFINE_NUMBER); // 42 number
console.log(DEFINE_NULL, DEFINE_NULL === null); // null true
console.log(DEFINE_ARR, typeof DEFINE_ARR); // "[1,2,3]" string
console.log(DEFINE_OBJ, typeof DEFINE_OBJ); // "{key: "value" } string
<<| js From build.defineEnv |>>
console.log(
  import.meta.env.DEFINE_ENV_BOOL, // true
  typeof import.meta.env.DEFINE_ENV_BOOL // boolean
);
console.log(
  import.meta.env.DEFINE_ENV_STR, // "hello"
  typeof import.meta.env.DEFINE_ENV_STR // string
);
console.log(
  import.meta.env.DEFINE_ENV_NUMBER, // 42
  typeof import.meta.env.DEFINE_ENV_NUMBER // number
);
console.log(
  import.meta.env.DEFINE_ENV_NULL, // null
  import.meta.env.DEFINE_ENV_NULL === null // true
);
console.log(
  import.meta.env.DEFINE_ENV_ARR, // "[1,2,3]"
  typeof import.meta.env.DEFINE_ENV_ARR // string
);
console.log(
  import.meta.env.DEFINE_ENV_OBJ, // "{key:'val'}"
  typeof import.meta.env.DEFINE_ENV_OBJ // string
);
<<| js From dotenv (client code) |>>
/**
 * /src, /src-pwa, /src-electron etc
 */
console.log(
  import.meta.env.QCLI_DOTENV_BOOL, // true
  typeof import.meta.env.QCLI_DOTENV_BOOL // boolean
);
console.log(
  import.meta.env.QCLI_DOTENV_STR, // "hello"
  typeof import.meta.env.QCLI_DOTENV_STR // string
);
console.log(
  import.meta.env.QCLI_DOTENV_NUMBER, // 42
  typeof import.meta.env.QCLI_DOTENV_NUMBER // number
);
console.log(
  import.meta.env.QCLI_DOTENV_NULL, // null
  import.meta.env.QCLI_DOTENV_NULL === null // true
);
console.log(
  import.meta.env.QCLI_DOTENV_ARR, // "[1,2,3]"
  typeof import.meta.env.QCLI_DOTENV_ARR // string
);
console.log(
  import.meta.env.QCLI_DOTENV_OBJ, // "{key:'val'}"
  typeof import.meta.env.QCLI_DOTENV_OBJ // string
);

// Not exposed to client code due to missing QCLI_ configurable prefix:
console.log(
  import.meta.env.DOTENV_BOOL, // undefined
  import.meta.env.DOTENV_STR, // undefined
  import.meta.env.DOTENV_NUMBER, // undefined
  import.meta.env.DOTENV_NULL // undefined
  import.meta.env.DOTENV_ARR, // undefined
  import.meta.env.DOTENV_OBJ, // undefined
);
<<| js From dotenv (backend code) |>>
/**
 * /quasar.config file, /src-ssr, /src-ssg
 */
console.log(
  import.meta.env.QCLI_DOTENV_BOOL, // true
  typeof import.meta.env.QCLI_DOTENV_BOOL // boolean
);
console.log(
  import.meta.env.QCLI_DOTENV_STR, // "hello"
  typeof import.meta.env.QCLI_DOTENV_STR // string
);
console.log(
  import.meta.env.QCLI_DOTENV_NUMBER, // 42
  typeof import.meta.env.QCLI_DOTENV_NUMBER // number
);
console.log(
  import.meta.env.QCLI_DOTENV_NULL, // null
  import.meta.env.QCLI_DOTENV_NULL === null // true
);
console.log(
  import.meta.env.QCLI_DOTENV_ARR, // "[1,2,3]"
  typeof import.meta.env.QCLI_DOTENV_ARR // string
);
console.log(
  import.meta.env.QCLI_DOTENV_OBJ, // "{key:'val'}"
  typeof import.meta.env.QCLI_DOTENV_OBJ // string
);

console.log(
  import.meta.env.DOTENV_BOOL, // true
  typeof import.meta.env.DOTENV_BOOL // boolean
);
console.log(
  import.meta.env.DOTENV_STR, // "hello"
  typeof import.meta.env.DOTENV_STR // string
);
console.log(
  import.meta.env.DOTENV_NUMBER, // 42
  typeof import.meta.env.DOTENV_NUMBER // number
);
console.log(
  import.meta.env.DOTENV_NULL, // null
  import.meta.env.DOTENV_NULL === null // true
);
console.log(
  import.meta.env.DOTENV_ARR, // "[1,2,3]"
  typeof import.meta.env.DOTENV_ARR // string
);
console.log(
  import.meta.env.DOTENV_OBJ, // "{key:'val'}"
  typeof import.meta.env.DOTENV_OBJ // string
);
```

## IntelliSense with TypeScript

Quasar CLI takes into account process.env (terminal variables), dotenv files and /quasar.config > build.define & build.defineEnv to automatically inject the types for it. No `env.d.ts` needed in your project folder.

::: tip
You can inspect the auto-injected types from the `/.quasar/quasar.d.ts` file. This file is auto-generated, so do not manually change it as it will get overwritten on next quasar command call.
:::

However, there are cases which are not auto-handled by Quasar CLI:

- Definitions coming from dotenv files used ONLY for the /quasar.config file itself, but not for your app also.
- Dynamic process.env variables. Say you have a /package.json script: "dev:xyz": "XYZ=true quasar dev"; if you only define XYZ for this specific call, then on the other calls without XYZ=true the Quasar CLI won't be able to know about a possible XYZ definition so it won't inject it.

For cases like above, you can define it yourself:

```ts Example: /env.d.ts
/**
 * Add types (that are not auto-magically added by Quasar CLI already)
 * for your custom variables to avoid TypeScript errors, like dynamic
 * process.env variables or definitions in dotenv files configured ONLY
 * for the /quasar.config file itself.
 *
 * @example
 * interface ImportMetaEnv {
 *   readonly MY_VAR: string;
 *   readonly MY_OTHER_VAR: string;
 * }
 */
interface ImportMetaEnv {}
```

For cases where the auto-type inference and declaration does not work for your specific case, you can instruct Quasar CLI to ignore it through the /quasar.config file and declare it yourself instead in `/env.d.ts`:

```js
build: {
  env: {
    /**
     * Ignore auto-infering and declaring type for these variables;
     * Variables can come from process.env (terminal variables) or
     * dotenv files or quasar.config > build > define/defineEnv.
     *
     * Use the full variable name as transformed in the code.
     * @example 'all' to ignore all variables
     * @example ['import.meta.env.OTHER_VAR', '__SOME_VAR__'] to ignore specific variables.
     * @default []
     */
    ignoreType: ['import.meta.env.MY_SPECIAL_VAR']
  }
}
```

## More on dotenv files

A `.env` file (pronounced "dotenv") is a simple text file used to store environment variables for a software project. Instead of hardcoding sensitive information or configuration settings directly into the source code, you can place them in this file.

The variables defined get transformed to `import.meta.env.<VAR_NAME>` and replaced at build time.

### Why Use a .env File?

- Security: It keeps sensitive data, like database passwords, API keys, and secret tokens—safe. Because .env files are kept out of version control (like GitHub), your secrets aren't exposed to the public or everyone on your team.
- Portability: It allows your application to behave differently depending on the environment (development, testing, or production) without changing the code. You just swap out the .env file for each environment.
- Simplicity: It centralizes configuration into one easy-to-read file.

### Dotenv filenames

These files will be automatically detected and used (the order matters):

```
.env        # loaded in all cases
.env.local  # loaded in dev only, ignored by git
```

...where "ignored by git" assumes a default project folder created after releasing this package, otherwise add `.env.local` to your `/.gitignore` file.

You can configure Quasar CLI to take into account even more files, as you'll learn in the next sections.

### What Does It Look Like?

A `.env` file uses a straightforward `KEY=VALUE` format. There are no spaces around the equals sign, and quotes are usually only needed if the value contains spaces.

```bash /.env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=super_secret_password
DB_PORT=5432

# API Keys
STRIPE_API_KEY=sk_test_123456789
NODE_ENV=development
```

### Exposing to client code

For security purposes and exposing variables with clear intent only, Quasar CLI filters out variables names not starting with the `QCLI_` prefix for the code exposed to the client-side, while leaving all of them for backend code (example: SSR/SSG server-side code that the clients cannot view it directly). This prefix can be changed through the /quasar.config file.

```bash
# NOT exposed to client code, but exposed to backend;
# it does NOT start with QCLI_ prefix:
SOME_VAR=content

# this will be embedded into backend & client code,
# as it starts with QCLI_ prefix:
QCLI_SOME_VAR=content
```

```js Usage example
import.meta.env.SOME_VAR // ❌ Not available in client code
import.meta.env.QCLI_SOME_VAR // ✅ Available in client code
```

### The Golden Rule of Dotenv

Never commit your .env file to version control.

You must always add .env to your project's .gitignore file immediately. If you accidentally push a .env file containing real API keys to a public repository, bots can scrape those keys in seconds and exploit them.

Instead, you might want to include a `.env.example` or `.env.template` file in the project folder. This file includes the keys but leaves the values blank or fills them with dummy data, showing other developers what variables the project needs to run:

```bash /.env.template
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_PORT=
STRIPE_API_KEY=
NODE_ENV=
```

### Configuring Dotenv Files

```ts /quasar.config file
build: {
  env: {
    /**
     * For security reasons, only variables with this prefix from the env files
     * and Node.js process.env will be exposed to the code shipped to the client.
     * The client app code includes Electron main & preload scripts, as they get
     * shipped to the client side as well.
     *
     * Such variables exposed to the client app code should not contain sensitive
     * information such as API keys.
     *
     * Avoid setting it to 'QUASAR_' so it won't conflict with
     * Quasar's own environment variables.
     *
     * Setting it to an empty string will default to
     * the default value (QCLI_).
     *
     * @default 'QCLI_'
     */
    clientPrefix?: string | string[];
    /**
     * Setting this prefix will filter out env files variables and Node.js process.env
     * variables that are exposed to the backend code (like the SSR/SSG server-side).
     *
     * Avoid setting it to 'QUASAR_' so it won't conflict with
     * Quasar's own environment variables.
     *
     * @default ''
     */
    backendPrefix?: string | string[];
    /**
     * Folder where Quasar CLI should look for .env* files.
     * Can be an absolute path or a relative path to project root directory.
     *
     * @default appPaths.appDir
     */
    folder?: string | string[];
    /**
     * Additional .env* files to be loaded.
     * Each entry can be an absolute path or a relative path to
     * quasar.config > build > folder.
     *
     * @example ['.env.somefile', '../.env.someotherfile']
     */
    file?: string | string[];
    /**
     * Filter the env files variables & Node.js process.env variables
     * that are exposed to the app code. This does not affects props
     * assigned directly to the quasar.config > build > define prop.
     */
    filter?: (
      env: Record<string, string>,
      type: "client" | "backend"
    ) => Record<string, string>;

    /**
     * Ignore auto-infering and declaring type for these variables;
     * Variables can come from process.env (terminal variables) or
     * dotenv files or quasar.config > build > define/defineEnv.
     *
     * Use the full variable name as transformed in the code.
     * @example 'all' to ignore all variables
     * @example ['import.meta.env.OTHER_VAR', '__SOME_VAR__'] to ignore specific variables.
     */
    ignoreType?: "all" | string[];
  }
}
```

Remember that you can further filter out unwanted keys, or even change values for keys by using `build > env > filter` function:

```js /quasar.config file
build: {
  env: {
    filter (
      originalEnv,
      type // "client" | "backend"
    ) {
      const newEnv = {}
      for (const key in originalEnv) {
        if (/* ...decide if it goes in or not... */) {
          newEnv[ key ] = originalEnv[ key ]
        }
      }

      // remember to return your processed env
      return newEnv
    }
  }
}
```

### Dotenv Files for /quasar.config file itself

Quasar CLI detects dotenv files and uses them for the /quasar.config file itself. However, should you want to configure the behaviour, you will need to edit your /package.json:

```json /package.json file
"quasarCli": {
  "quasarConfEnv": {
    /**
     * Setting this prefix will filter out env files variables and Node.js process.env
     * variables that are exposed.
     *
     * Avoid setting it to 'QUASAR_' so it won't conflict with
     * Quasar's own environment variables.
     *
     * @default ''
     */
    "prefix": "",
    /**
     * Folder where Quasar CLI should look for .env* files.
     * Can be an absolute path or a relative path to project root directory.
     *
     * @default root project file dir
     */
    "folder": "."
    /**
     * Additional .env* files to be loaded.
     * Each entry can be an absolute path or a relative path to
     * quasar.config > build > folder.
     *
     * @example ['.env.somefile', '../.env.someotherfile']
     */
    "file": []
  }
}
```

Usage in the `/quasar.config` file, given that you defined `MY_BOOL=true` in `/.env`:

```js /quasar.config file example
import { defineConfig } from '#q-app'

export default defineConfig(ctx => {
  return {
    build: {
      filenameBasedRouting: import.meta.env.MY_BOOL // inferred as boolean already
    }
  }
})
```

## HMR (Hot Module Reload)

Adding/removing/changing dotenv files (both the default and the configured ones) or /quasar.config build.define/defineEnv will immediately take effect, so you won't have to restart the Quasar CLI devserver.
