---
title: ESLint
desc: How to configure a code linter in a Quasar app.
---
Having a code linter (like [ESLint](https://eslint.org/) in place is highly recommended and ensures your code looks legible. It also helps you capture some errors before even running the code.

When you create a Quasar project folder with Quasar CLI it will ask you if you want a linter and which setup you want for ESLint:

* [Standard](https://github.com/standard/standard)
* [Airbnb](https://github.com/airbnb/javascript)
* [Prettier](https://github.com/prettier/prettier)
* .. or you can configure one yourself

Two dot files will be created:

* .eslintrc.js -- ESLint configuration, including rules
* .eslintignore -- what ESLint should ignore when linting

Further extension of one of the Eslint setups above can be made. Your project will by default use `eslint-plugin-vue` to handle your Vue files. Take a quick look at `.eslintrc.js` and notice it:

```js
extends: [
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  'plugin:vue/strongly-recommended'
]
```

If you chose ESLint when creating your project folder, you'll also notice that `/quasar.conf.js` adds the eslint-loader to Webpack configuration for you:

```js
build: {
  chainWebpack (chain) {
    chain.plugin('eslint-webpack-plugin')
      .use(ESLintPlugin, [{ extensions: [ 'js', 'vue' ] }])
  }
}
```

## Lint Rules
The linting rules can be removed, changed, or added. Notice some things:

* Some rules are for the Standard, Airbnb or Prettier standards (whichever you chose when project was created). Example: 'brace-style'.
* Some rules are for eslint-plugin-vue. Example: 'vue/max-attributes-per-line'.

You can add/remove/change rules by first visiting https://eslint.org/docs/rules/ or https://github.com/vuejs/eslint-plugin-vue.

Example of ESLint rules below:
```js
// .eslintrc.js

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

## Disabling Linter
In order for you to disable ESLint later, all you need to do is comment out (or remove) the following code from `/quasar.conf.js`:

```js
build: {
  chainWebpack (chain) {
    /*
     * we comment out this block
     *
    chain.plugin('eslint-webpack-plugin')
      .use(ESLintPlugin, [{ extensions: [ 'js', 'vue' ] }])
    */
  }
}
```
