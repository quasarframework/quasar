---
title: Sass/SCSS Variables
desc: How to use the Sass/SCSS variables defined by Quasar.
components:
  - style/SassVariables
related:
  - /quasar-cli/css-preprocessors
---

There are Sass/SCSS variables built into Quasar that you can change and/or use within devland should you wish to.

::: warning
This applies to Quasar CLI managed apps only.
:::

## Usage
In your app's `*.vue` files or in the .sass/.scss files you can use any Quasar Sass/SCSS variables (examples: `$primary`, `$red-1`), and any other Sass/SCSS variables that you declared in your `/src/css/quasar.variables.sass` or the perfectly equivalent `/src/css/quasar.variables.scss` (depending on your favorite Sass flavour) when using Quasar CLI.

```html
<!-- Notice lang="sass" -->
<style lang="sass">
div
  color: $red-1
  background-color: $grey-5
</style>

<!-- Notice lang="scss" -->
<style lang="scss">
div {
  color: $red-1;
  background-color: $grey-5;
}
</style>
```

::: tip
You don't need to necessarily have the `src/css/quasar.variables.sass` or `src/css/quasar.variables.scss` files if you want to access the Quasar Sass/SCSS variables. Create one of them only if you want to customize the variables.
:::

::: danger
When creating or deleting any of the `src/css/quasar.variables.*` files, you will need to restart your dev server in order for it to take effect. However, when you change the content of these files it won't be necessary to also restart.
:::

## Caveat

Quasar CLI detects if the file contains at least one '$' character, and if so, it automatically imports the Quasar Sass/SCSS variables.

If, however, you have a nested importing statement and the file from which you are importing does not contain any '$' characters, this won't work. In this case, you need to add a simple comment (`// $`) so Quasar can detect at least one '$' character:

```html
<style lang="sass">
// $

@import 'some-file.sass'
// now some-file.sass can benefit
// from Quasar Sass variables too
// due to comment above
</style>
```

Same is required for .sass/.scss files that are included from quasar.conf.js > css.

## Customizing
If you want to customize the variables (or add your own) and your project does not yet have a `src/css/quasar.variables.sass` (or `src/css/quasar.variables.scss`) file, create one of them yourself. It doesn't matter if you pick .sass or .scss as the extension for this file. **Having one of them will provide the variables to ALL your .sass AND .scss project files (including inside of .vue files).**

You can freely override any of Quasar's variables (see next section) in those files. For convenience, if you picked Sass or SCSS when you created your Quasar project folder, these files initially contain only the brand color-related variables.

::: tip
Quasar is very easy to customize without the need of tampering with the Sass/SCSS variables, so make sure that you really need to do that. Not having one of the two files will actually speed up your build while the default variables will still be supplied to .sass/.scss/.vue files.
:::

## Quasar's CSS
Quasar's own CSS is compiled using the variables file (if it exists), but there are multiple forms (sass, scss). So there has to be a priority list for Quasar CLI:

* Does `src/css/quasar.variables.scss` exists? Use that.
* If not, then does `src/css/quasar.variables.sass` exists? Use that.
* If not, then use pre-compiled Quasar CSS.

## Variables list

<sass-variables />
