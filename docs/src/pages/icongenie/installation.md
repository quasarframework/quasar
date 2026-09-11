---
title: Icon Genie CLI Installation
desc: How to install the Icon Genie CLI on your development machine.
---

::: warning
**Do not use uneven versions of Node.js i.e. 19, 21, 23 etc.** These versions aren't tested with Quasar and often cause issues due to their experimental nature. We highly recommend always using the LTS version of Node.
:::

You will be installing the Icon Genie CLI globally. You don't need to install it in your project folder.

```tabs
<<| bash PNPM |>>
# Node.js >=22 is required.
pnpm add -g @quasar/icongenie
<<| bash Yarn |>>
# Node.js >=22 is required.
yarn global add @quasar/icongenie
<<| bash NPM |>>
# Node.js >=22 is required.
npm i -g @quasar/icongenie
<<| bash Bun |>>
# Node.js >=22 is required.
bun install -g @quasar/icongenie
```

This will install the `icongenie` command line tool.

::: tip Attention developers on Windows
If you get an error like "pngquant failed to build" then you need to also globally install windows-build-tools ("yarn global add windows-build-tools" or "npm install --global windows-build-tools"). Then go to C:\Users\\<windows_username>\\.windows-build-tools and run vs_BuildTools.exe. From there select npm/yarn and python to install. After this step it might require you to reboot your machine, otherwise you can now install @quasar/icongenie.
:::
