# eslint-config-quasar

ESLint configuration for Quasar monorepo. It's a private package only meant to be used in core source code.

## Usage

Add the dependency to `package.json`:

```json
{
  "devDependencies": {
    "eslint-config-quasar": "workspace:*",
  }
}
```

We need `@rushstack/eslint-patch` to be able to resolve packages provided by this package. Add the following to `.eslintrc.cjs`:

```js
require('@rushstack/eslint-patch/modern-module-resolution'); // 👈 Add this line

module.exports = {
  // ...
}
```

Then extend the configuration in `.eslintrc.cjs`:

```js
// ...

module.exports = {
  extends: [
    'quasar/base',
    'quasar/vue',
    'quasar/node',
  ],

  // ...
}
```
