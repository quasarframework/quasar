---
title: Icon Genie CLI Installation
desc: How to install the Icon Genie CLI on your development machine.
---

Make sure that you have Node >=12.22.1 and NPM >=6.14.12 installed on your machine.

::: warning
**Do not use uneven versions of Node i.e. 13, 15 etc.** These versions aren't tested with Quasar and often cause issues due to their experimental nature. We highly recommend always using the LTS version of Node.
:::

You will be installing the Icon Genie CLI globally. You don't need to install it in your project folder.

```bash
# Node.js >=12.22.1 is required.

$ yarn global add @quasar/icongenie
# or
$ npm install -g @quasar/icongenie
```

This will install the `icongenie` command line tool.

::: tip Attention developers on Windows
If you get an error like "pngquant failed to build" then you need to also globally install windows-build-tools ("yarn global add windows-build-tools" or "npm install --global windows-build-tools"). Then go to C:\Users\\<windows_username>\\.windows-build-tools and run vs_BuildTools.exe. From there select npm/yarn and python to install. After this step it might require you to reboot your machine, otherwise you can now install @quasar/icongenie.
:::

## Installation tips

If you are using Yarn, make sure that the Yarn [global install location](https://yarnpkg.com/lang/en/docs/cli/global/) is in your PATH:

```bash
# in ~/.bashrc or equivalent
export PATH="$(yarn global bin):$PATH"
```

Under Windows, modify user's PATH environment variable. If you are using yarn then add `%LOCALAPPDATA%\yarn\bin`, otherwise if you're using npm then add `%APPDATA%\npm`.

## Upgrading to Icon Genie v2

This section applies to those that have been using Icon Genie v1 and are now upgrading to Icon Genie v2.

### NPM package name change

Version 1 was a Quasar [App Extension](/app-extensions/introduction) and so you installed it into your project folder. The new version (v2) does NOT need to be installed locally as it is installed globally. Your CI/CD will not need it as it is a one-time process and the output files (images) will be added directly to your project folder.

As a consequence, please uninstall Icon Genie v1 from your project folder:

```bash
# from your Quasar CLI project folder:
$ quasar ext remove @quasar/icon-genie
```

### Input files

With version 1 you required to have an app-icon.png and an app-splashscreen.png (at a fixed width and height). This is no longer the case with version 2. You will now just need a png file (its name can be anything) with transparency and with minimum of 64x64 px (but the higher, the better! -- recommended min size: 1024x1024) for the icon, and then another optional png (any name) for the background of the splash screens (min 128x128 px, but recommended minimum is 1024x1024 px).

The splash screens work in a completely different manner too. They will get generated with the icon on top of the optional background. The size ratio of the icon to width or height (whichever is lower) can be adjusted with the CLI params (`--splashscreen-icon-ratio`). You can even tell Icon Genie that the ratio is 0 so it won't add the icon on top of the background.

### Output files

We have refined the list of icons and splash screens that are generated to match the latest standards and to also avoid duplication. So you will notice that some of the older files don't get generated anymore and some are completely new. Icon Genie will now tell you what tags you need to add (if any) to your /src/index.template.html (**you can copy paste the tags and replace your old ones**) -- so be mindful about the list of tags.

It might be a good idea to delete all your current icon/splashscreen files and let Icon Genie do its job again. This way you will be sure that what you're left with is actually used in your Quasar App.

## What's new in Icon Genie v2

Icon Genie v2 is a complete rewrite from top to bottom.

* Icon Genie is now a CLI on its own, not a Quasar App Extension any more.
* The input files (for the icon and the background) can have any name, be placed anywhere, and they don't need to have a fixed width + height. Starting with v2.1, the icon input file does not needs to have same width and height. Also, the icon input file is now automatically trimmed.
* You can now configure a padding for the icon input file. (v2.1+)
* We have refined the list of icons and splash screens that get generated to match the latest standards and to also avoid duplication.
* Splash screens are created in a better manner, with the icon on top of the background (with the icon having any size ratio that you want, including 0 which means: "I only want the background image with no icon on top")
* New commands: [generate](/icongenie/command-list#generate), [verify](/icongenie/command-list#verify), and [profile](/icongenie/command-list#profile), each with its own purpose.
* The `generate` command now also shows you what tags you need in your `/src/index.template.html` file.
* The `verify` command can even check if every file is in the right place and it has the right width by height.
* A lot of new parameters: quality, svg-color, png-color, splashscreen-color, splashscreen-icon-ratio, etc etc. Check the [command list](/icongenie/command-list) page.
* You can now control each type of asset (ico, png, splashscreen, ...) for each Quasar mode individually, each with its own settings/parameters. Check the `--filter`, `--quality` and all the color parameters. One good use case is with the `.ico` files.
* Automation is now possible through Icon Genie [profile files](/icongenie/profile-files).
* You can now **generate your own custom image files** using the Icon Genie API through the [profile files](/icongenie/profile-files).

Finally, we need to emphasize again on the `quality` parameter, which will dictate how good-looking and how big (KB) your images will be.
