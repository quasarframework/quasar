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

You can also inject template files anywhere in the repository.

## Features of an installed extension
...todo

## How to develop
This section will show you how to create your extension, install it and go into the details of what it can do. 
::: warning
You really need to use `yarn` for developing your extensions, because of the way that it enables you to link packages on your local machine.
:::

### Scaffolding
Quasar will help you to create a new app extension.
```shell
App Extension Examples
$ quasar create my-extension-project --kit app-extension
   # installs an App Extension project with the latest Quasar App Extension starter kit
$ quasar create my-extension-project --kit user/github-extenstion-starter-kit
   # installs an App Extension project with a custom starter kit from Github
$ quasar create my-extension-project --kit user/github-extenstion-starter-kit --branch dev
   # installs an App Extension project with a custom starter kit from Github using the dev branch
```

In order to test this extension during its creation, simply create a new app and add the following line to the dependencies in its package.json` file:

```json
'my-extension-project': 'link:../my-extension-project'
```

After you have installed the new module by running the `yarn` command, run the following command:
```shell
$ quasar ext --add my-extension-project --skip-pkg
``` 
::: tip
The '--skip-pkg' command will skip running yarn and just use module as you have just linked it. This is really important, because while you are developing, pushing your extension to NPM can be a bit of a pain.
:::

If you want to test the "remove process", run:
```bash
$ quasar ext --remove my-extension-project --skip-pkg
```

### Node Module Dependencies

### Installation Flow

### Prompts

### Template files and folders

### Quasar Commands

### Extending Webpack

### Uninstalling

### Publishing your extension to NPM
