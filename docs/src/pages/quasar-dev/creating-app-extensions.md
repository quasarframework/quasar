---
title: Creating App Extensions
---

You can think of an app extension as a way to quickly inject complicated libraries with a variety of dependencies, boot files, custom logic, extended webpack (or babel) and even extend the `quasar` command itself.

There are five basic files that your extension needs:
- index.js
- install.js
- prompts.js
- uninstall.js
- package.json

And at least one that it creates in your project folder:
- quasar.extensions.json

## Naming

```
$ quasar ext --add @quasar/testing-unit-jest --skip-pkg


`dependency`
```json
'@quasar/quasar-app-extension-testing-unit-jest': 'link:../packages/unit-jest',
```

## Features of an installed extension
