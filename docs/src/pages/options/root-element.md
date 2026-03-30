---
title: Config Root Element
desc: Configuring the root element for Quasar Teleported components.
related:
  - /quasar-cli-vite/quasar-config-file
  - /quasar-cli-webpack/quasar-config-file
---

Quasar defaults to appending teleported components (such as `QDialog`, `QMenu`, `QSelect`, and `QTooltip`) to `document.body`. This behavior can be changed using the `config.root` property.

## Changing the Root Element

You can customize the root element by modifying your `/quasar.config` file. The `root` property accepts either a DOM Element or a function that returns a DOM Element.

```js [highlight=4-6] /quasar.config.js
module.exports = function (ctx) {
  return {
    framework: {
      config: {
        root: () => document.getElementById('my-app')
      }
    }
  }
}
```

## Micro Front-ends (Web Components)

A special use case for `config.root` is when building Micro Front-ends using Web Components with Shadow DOM. When a Quasar app is encapsulated inside a Shadow Root, appending globally to `document.body` breaks CSS encapsulation. Teleported elements end up rendered outside the Shadow DOM and therefore miss the applied Quasar styles and CSS variables.

The simplest approach is to pass the `shadowRoot` of your Web Component using a basic DOM selector.

### Example

If you are bootstrapping Quasar inside a Web Component (using `defineCustomElement` in Vue 3), you can configure the App instance to point to your custom element's `shadowRoot`:

```ts [highlight=9] /src/main.ts
import { defineCustomElement } from 'vue'
import { Quasar } from 'quasar'
import RootComponent from './App.ce.vue'

const MyCE = defineCustomElement(RootComponent, {
  configureApp(app) {
    app.use(Quasar, {
      config: {
        root: () =>
          document.querySelector('my-web-component')?.shadowRoot ||
          document.body
      }
    })
  }
})

customElements.define('my-web-component', MyCE)
```

::: warning Side Effect with Multiple Instances
Because the `root` function is evaluated in user-land using `document.querySelector`, it will naturally return the **first** `<my-web-component>` instance found on the page if multiple are present. Consequently, Quasar will append all teleported components (like `QDialog`, `QMenu`, `QSelect`, etc.) to that first instance's Shadow DOM.

However, if your Micro Front-ends share the same CSS (Quasar styling is present on all instances), this behavior works smoothly and the overlays will still render correctly inside the first Web Component.
:::
