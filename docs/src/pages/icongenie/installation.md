---
title: Icon Genie CLI Installation
desc: How to install the Icon Genie CLI on your development machine.
---

Make sure that you have Node >=10 and NPM >=5 installed on your machine.

You will be installing Icon Genie CLI globally. It is not needed into your project folder.

```bash
# Node.js >=10 is required.

$ yarn global add @quasar/icongenie
# or
$ npm install -g @quasar/icongenie
```

This will install the `icongenie` command line tool.

## Installing tips

If you are using Yarn, make sure that the Yarn [global install location](https://yarnpkg.com/lang/en/docs/cli/global/) is in your PATH:

```bash
# in ~/.bashrc or equivalent
export PATH="$(yarn global bin):$PATH"
```

Under Windows, modify user's PATH environment variable. If you are using yarn then add `%LOCALAPPDATA%\yarn\bin`, otherwise if you're using npm then add `%APPDATA%\npm`.

## Upgrading to v2

This section applies to those that have been using Icon Genie v1 and are now upgrading to Icon Genie v2.

You were used to it being a Quasar App Extension and so you were installing it into your project folder. The new version (v2) does NOT need that as it is installed globally. Your CI/CD will not need it as it is a one time process and the output files (images) will be added directly to your project folder.

As a consequence, please uninstall the v1 of Icon Genie from your project folder:

```bash
# from your Quasar CLI project folder:
$ quasar ext remove @quasar/icon-genie
```
