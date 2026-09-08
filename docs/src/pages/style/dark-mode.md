---
title: Dark Mode
desc: Handle dark mode with Quasar.
related:
  - /quasar-plugins/dark
  - /style/theme-builder
---

Dark Mode is a supplemental mode that can be used to display mostly dark surfaces on the UI. The design reduces the light emitted by device screens while maintaining the minimum color contrast ratios required for readability.

The advantages of Dark Mode are that:

- It enhances visual ergonomics by reducing eye strain.
- It is important for eye protection also.
- Provides comfort of use at night or in dark environments.
- It conserves battery power mainly if the device screen is OLED or AMOLED, thereby enabling device usage for longer periods without charging.

## What it does

1. It sets a default dark background for the pages (that you can easily override through CSS with the `body.body--dark` selector)
2. All Quasar components with a `dark` property will have it automatically set to `true`. No need to do it manually.

The auto-detection works by looking at `prefers-color-scheme: dark` media query and is dynamic. If the client browser/platform switches to/from Dark mode while your app is running, it will also update Quasar's Dark mode (if Dark mode is set to `auto`).

## How to use it

You can easily switch between Dark mode and light mode (which is default) through the [Dark Plugin](/quasar-plugins/dark).

## How to style your app

Since your app can be in Dark mode or not, you can easily style it by taking advantage of the `body` tag attached CSS class: `body--light` or `body--dark`. **That is if you want to support both modes.**

```css
.body--light {
  /* ... */
}

.body--dark {
  /* ... */
}
```

Should you wish to override the default Dark mode page background color:

```css
body.body--dark {
  background: #000;
}
```

## Shadows in Dark Mode <q-badge label="v2.31+" />

While in Dark Mode, Quasar draws elevation with a light shadow color (the `shadow-N` helper classes as well as the shadows of components such as QCard, QMenu, QTable or the QLayout header, footer and drawers) instead of the black used in light mode. Both colors are CSS custom properties declared on `:root`, so you can change them without touching the Sass variables, which also makes them available to the UMD, Vite plugin and any other flavour consuming the prebuilt CSS:

| Custom property         | Default | Description                      |
| ----------------------- | ------- | -------------------------------- |
| `--q-shadow-color`      | `#000`  | Shadow color while in light mode |
| `--q-dark-shadow-color` | `#fff`  | Shadow color while in Dark Mode  |

```css
/* Dark shadows in Dark Mode too (the look Quasar had before v2.11) */
body.body--dark {
  --q-dark-shadow-color: #000;
}

/* Or no elevation shadows at all while in Dark Mode */
body.body--dark {
  --q-dark-shadow-color: transparent;
}
```

Set them on `:root` or on `body` (a `body.body--dark` rule as above, or the [setCssVar](/style/color-palette#util-setcssvar) helper, which writes on `body`). The shadow tints are derived from them at the `body` level, so an override placed deeper in the DOM has no effect. Components with a dark surface (the `dark` prop) use `--q-dark-shadow-color` regardless of the Dark Mode status.

::: tip
Quasar CLI users can alternatively set the `$shadow-color` and `$dark-shadow-color` [Sass variables](/style/sass-scss-variables), which are the defaults of the custom properties above.
:::
