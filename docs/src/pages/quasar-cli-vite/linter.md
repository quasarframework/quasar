---
title: Linter
desc: (@quasar/app-vite) How to configure a code linter in a Quasar app.
---

Having a code linter (like [ESLint](https://eslint.org/)) in place is highly recommended and ensures your code looks legible. It also helps you capture some errors before even running the code.

When you scaffold a Quasar project folder it will ask you if you want a linter and which setup you want for ESLint:

* [Prettier](https://github.com/prettier/prettier)
* [Standard](https://github.com/standard/standard)
* [Airbnb](https://github.com/airbnb/javascript)
* .. or you can configure one yourself

Two dot files will be created:

* .eslintrc.cjs -- ESLint configuration, including rules
* .eslintignore -- what ESLint should ignore when linting

Further extension of one of the ESLint setups above can be made. Your project will by default use `eslint-plugin-vue` to handle your Vue files. Take a quick look at `/.eslintrc.cjs` and notice it:

```js /.eslintrc.cjs
extends: [
  // https://eslint.vuejs.org/rules/#priority-a-essential-error-prevention-for-vue-js-3-x
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  'plugin:vue/strongly-recommended'
]
```

Also note that you need the following file:

```bash /.eslintignore
/dist
/src-capacitor
/src-cordova
/.quasar
/node_modules
.eslintrc.cjs
/quasar.config.*.temporary.compiled*
```

## Lint Rules
The linting rules can be removed, changed, or added. Notice some things:

* Some rules are for the Standard, Airbnb or Prettier standards (whichever you chose when project was created). Example: 'brace-style'.
* Some rules are for eslint-plugin-vue. Example: 'vue/max-attributes-per-line'.

You can add/remove/change rules by first visiting [https://eslint.org/docs/rules/](https://eslint.org/docs/rules/) or [https://eslint.vuejs.org/rules](https://eslint.vuejs.org/rules).

Example of ESLint rules below:

```js /.eslintrc.cjs
'rules': {
  'brace-style': [2, 'stroustrup', { 'allowSingleLine': true }],

  'vue/max-attributes-per-line': 0,
  'vue/valid-v-for': 0,

  // allow async-await
  'generator-star-spacing': 'off',

  // allow paren-less arrow functions
  'arrow-parens': 0,
  'one-var': 0,

  'import/first': 0,
  'import/named': 2,
  'import/namespace': 2,
  'import/default': 2,
  'import/export': 2,
  'import/extensions': 0,
  'import/no-unresolved': 0,
  'import/no-extraneous-dependencies': 0,

  // allow debugger during development
  'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
}
```

## Typescript projects linting

The linting for a TS project is based on vite-plugin-checker + ESLint + vue-tsc:

```tabs
<<| bash Yarn |>>
$ yarn add --dev vite-plugin-checker vue-tsc@^1.0.0 typescript@~5.3.0
<<| bash NPM |>>
$ npm install --save-dev vite-plugin-checker vue-tsc@^1.0.0 typescript@~5.3.0
<<| bash PNPM |>>
$ pnpm add -D vite-plugin-checker vue-tsc@^1.0.0 typescript@~5.3.0
<<| bash Bun |>>
$ bun add --dev vite-plugin-checker vue-tsc@^1.0.0 typescript@~5.3.0
```

::: warning
Notice the `typescript` dependency is <= 5.3. There is currently an issue with ESLint and newer TS (5.4+). This is only a temporary thing until upstream fixes it.
:::

Create a file called `tsconfig.vue-tsc.json` in the root of your project folder:

```json /tsconfig.vue-tsc.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

```js /quasar.config file
build: {
  vitePlugins: [
    ['vite-plugin-checker', {
      vueTsc: {
        tsconfigPath: 'tsconfig.vue-tsc.json'
      },
      eslint: {
        lintCommand: 'eslint "./**/*.{js,ts,mjs,cjs,vue}"'
      }
    }, { server: false }]
  ]
}
```

## Javascript projects linting

The linting for a JS project is based on vite-plugin-checker + ESLint:

```tabs
<<| bash Yarn |>>
$ yarn add --dev vite-plugin-checker
<<| bash NPM |>>
$ npm install --save-dev vite-plugin-checker
<<| bash PNPM |>>
$ pnpm add -D vite-plugin-checker
<<| bash Bun |>>
$ bun add --dev vite-plugin-checker
```

```js /quasar.config file
build: {
  vitePlugins: [
    ['vite-plugin-checker', {
      eslint: {
        lintCommand: 'eslint "./**/*.{js,mjs,cjs,vue}"'
      }
    }, { server: false }]
  ]
}
```

## quasar.config file > eslint <q-badge label="deprecated" />

::: warning
The property described below has been deprecated in favour of using vite-plugin-checker.
:::

If you chose ESLint when creating your project folder, you'll also notice that the `eslint` key is added to the `/quasar.config` file:

```js /quasar.config file
eslint: {
  // fix: true,
  // include: [],
  // exclude: [],
  // rawOptions: {},
  warnings: true,
  errors: true
},
```

```js /quasar.config file > eslint
/** Options with which Quasar CLI will use ESLint */
eslint?: QuasarEslintConfiguration;

interface QuasarEslintConfiguration {
  /**
   * Should it report warnings?
   * @default true
   */
  warnings?: boolean;

  /**
   * Should it report errors?
   * @default true
   */
  errors?: boolean;

  /**
   * Fix on save
   */
  fix?: boolean;

  /**
   * Raw options to send to ESLint
   */
  rawOptions?: object;

  /**
   * Files to include (can be in glob format)
   */
  include?: string[];

  /**
   * Files to exclude (can be in glob format).
   * Recommending to use .eslintignore file instead.
   */
  exclude?: string[];
}
```

In order for you to disable ESLint later, all you need to do is to:

1. Comment out (or remove) the key below:

  ```js /quasar.config file
  eslint: { /* ... */ }
  ```

2. Or, set `warnings` and `errors` to `false`:

  ```js /quasar.config file
  eslint: {
    warnings: false,
    errors: false
  }
  ```
