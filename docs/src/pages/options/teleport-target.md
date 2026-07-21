---
title: Teleport Target
desc: Configuring where Quasar places dialogs, menus and other teleported content.
badge: v2.22+
related:
  - /quasar-cli-vite/quasar-config-file
---

Quasar normally appends dialogs, menus, tooltips and other globally managed content to `document.body`. You can configure another target when the application is hosted in a Shadow DOM or another isolated document subtree.

## Quasar CLI

Set `framework.config.teleportTarget` to a selector. The element must exist before Quasar creates its first teleported component.

```js /quasar.config.js
export default defineConfig(() => ({
  framework: {
    config: {
      teleportTarget: '#my-app-overlays'
    }
  }
}))
```

Quasar CLI serializes `framework.config` while generating the application entry. Consequently, use a selector here rather than a DOM element or function.

## Runtime configuration and Shadow DOM

When installing the Quasar Vue plugin directly, the target may be an `Element`, a `ShadowRoot`, or a function returning either one:

```js
app.use(Quasar, {
  config: {
    teleportTarget: () => customElement.shadowRoot
  }
})
```

Load the Quasar stylesheet inside the same Shadow Root so that teleported components receive the framework styles. Quasar applies its root CSS custom properties to `:host` as well as `:root` for this use case.

::: warning One target per Quasar runtime
The Quasar configuration and global portal registry are shared by a Quasar runtime. Multiple independently configured teleport targets are not supported. If several custom-element instances share one runtime, provide one common target.
:::
