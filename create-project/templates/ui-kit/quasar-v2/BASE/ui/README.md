# {{#features.component}}Component <%= componentName %>{{#features.directive}} and {{/features.directive}}{{/features.component}}{{#features.directive}}Directive v-<%= directiveName %>{{/features.directive}}

[![npm](https://img.shields.io/npm/v/quasar-ui-<%= name %>.svg?label=quasar-ui-<%= name %>)](https://www.npmjs.com/package/quasar-ui-<%= name %>)
[![npm](https://img.shields.io/npm/dt/quasar-ui-<%= name %>.svg)](https://www.npmjs.com/package/quasar-ui-<%= name %>)

**Compatible with Quasar UI v2 and Vue 3**.

{{#features.component}}
# Component <%= componentName %>
> Short description of the component
{{/features.component}}

{{#features.directive}}
# Directive v-<%= directiveName %>
> Short description of the directive
{{/features.directive}}

# Usage

## Quasar CLI project
{{#features.ae}}

Install the [App Extension](../app-extension).

**OR**:

{{/features.ae}}
Create and register a boot file:

```js
import Vue from 'vue'
import Plugin from 'quasar-ui-<%= name %>'{{#or componentCss directiveCss}}
import 'quasar-ui-<%= name %>/dist/index.css'{{/or}}

Vue.use(Plugin)
```

**OR**:

```html
{{#or componentCss directiveCss}}<style src="quasar-ui-<%= name %>/dist/index.css"></style>

{{/or}}
<script>
import { {{#features.component}}Component as <%= componentName %>{{/features.component}}{{#features.directive}}, {{/features.directive}}{{#features.directive}}Directive{{/features.directive}} } from 'quasar-ui-<%= name %>'

export default {
  {{#features.component}}
  components: {
    <%= componentName %>
  }{{#features.directive}},{{/features.directive}}
  {{/features.component}}
  {{#features.directive}}
  directives: {
    Directive
  }
  {{/features.directive}}
}
</script>
```

## Vue CLI project

```js
import Vue from 'vue'
import Plugin from 'quasar-ui-<%= name %>'{{#or componentCss directiveCss}}
import 'quasar-ui-<%= name %>/dist/index.css'{{/or}}

Vue.use(Plugin)
```

**OR**:

```html
{{#or componentCss directiveCss}}<style src="quasar-ui-<%= name %>/dist/index.css"></style>

{{/or}}
<script>
import { {{#features.component}}Component as <%= componentName %>{{/features.component}}{{#features.directive}}, {{/features.directive}}{{#features.directive}}Directive{{/features.directive}} } from 'quasar-ui-<%= name %>'

export default {
  {{#features.component}}
  components: {
    <%= componentName %>
  }{{#features.directive}},{{/features.directive}}
  {{/features.component}}
  {{#features.directive}}
  directives: {
    Directive
  }
  {{/features.directive}}
}
</script>
```

## UMD variant

Exports `window.<%= umdExportName %>`.

Add the following tag(s) after the Quasar ones:

```html
{{#or componentCss directiveCss}}
<head>
  <!-- AFTER the Quasar stylesheet tags: -->
  <link href="https://cdn.jsdelivr.net/npm/quasar-ui-<%= name %>/dist/index.min.css" rel="stylesheet" type="text/css">
</head>
{{/or}}
<body>
  <!-- at end of body, AFTER Quasar script(s): -->
  <script src="https://cdn.jsdelivr.net/npm/quasar-ui-<%= name %>/dist/index.umd.min.js"></script>
</body>
```
{{#or componentCss directiveCss}}
If you need the RTL variant of the CSS, then go for the following (instead of the above stylesheet link):
```html
<link href="https://cdn.jsdelivr.net/npm/quasar-ui-<%= name %>/dist/index.rtl.min.css" rel="stylesheet" type="text/css">
```
{{/or}}

# Setup
```bash
$ yarn
```

# Developing
```bash
# start dev in SPA mode
$ yarn dev

# start dev in UMD mode
$ yarn dev:umd

# start dev in SSR mode
$ yarn dev:ssr

# start dev in Cordova iOS mode
$ yarn dev:ios

# start dev in Cordova Android mode
$ yarn dev:android

# start dev in Electron mode
$ yarn dev:electron
```

# Building package
```bash
$ yarn build
```

# Adding Testing Components
in the `ui/dev/src/pages` you can add Vue files to test your component/directive. When using `yarn dev` to build the UI, any pages in that location will automatically be picked up by dynamic routing and added to the test page.

# Adding Assets
If you have a component that has assets, like language or icon-sets, you will need to provide these for UMD. In the `ui/build/script.javascript.js` file, you will find a couple of commented out commands that call `addAssets`. Uncomment what you need and add your assets to have them be built and put into the `ui/dist` folder.

# Donate
If you appreciate the work that went into this, please consider [donating to Quasar](https://donate.quasar.dev).

# License
<%= license %> (c) <%= author %>
