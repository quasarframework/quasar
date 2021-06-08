---
title: App Extensions
desc: What Quasar App Extensions are and how they can help both you and the community.
---

App Extensions are a way to painlessly inject complicated (or simple) libraries with a variety of dependencies, boot files, templates and custom logic. They can extend webpack, `quasar.conf.js`, tightly couple external UI components to core, and even register new commands with the Quasar CLI. They can be run with `quasar dev` and have complete access to the current live `ctx` (context).

The patterns for development literally open the floodgates to making Quasar one of the most extensible and powerful frameworks out there - now limited only by your imagination and innovation. This page will introduce you to the usage of App Extensions.

::: warning
App Extensions are designed specifically **for Quasar CLI only**. This means that you will not be able to install them or run them in Vue CLI or UMD environments.
:::

## What can an App Extension do?

1. Enhance CLI behavior with new commands
2. Make a Quasar UI plug-in
3. Install an accompanying application
4. Create and share a custom component
5. Create and share added features to the framework or other applications
6. Build, launch and control an API server
7. Hook, combine and extend Quasar core components
8. Modify code based on dynamically changing values that sit outside of the Quasar environment
9. Create and manage abstractions of platform specific interfaces
10. ... and a whole lot more

App Extensions **replace the need to create custom starter kits**. Anything you add on top of the official starter kit can come in the form of an App Extension. This also eliminates maintenance overhead of keeping unofficial starter kits up to date with the official one and so we can ensure that every developer will always get the latest and greatest Quasar specs out of the box.

## App Extension ext-id
All App Extensions must prefix their name with `quasar-app-extension-`. Everything that follows after this prefix is considered to be the short alias of it. We call this the `ext-id` throughout the documentation.

Example:
* ext-id for `quasar-app-extension-awesomeness` is `awesomeness`
* ext-id for `@some-npm-org/quasar-app-extension-awesomeness` is `@some-npm-org/awesomeness`

One of the benefits of this naming scheme is that it makes Quasar App Extensions discoverability easy while searching for their npm packages: [App Extension - Discover](/app-extensions/discover).

## Anatomy of App Extensions
App Extensions can be installed, executed and also uninstalled. The following guide discusses this in an abstract way. For details about individual extensions and how to work with them, please consult their respective repositories.

### Installing an App Extension

```bash
$ quasar ext add <ext-id>
```

This command will find and install the extension's module. After installation is complete, there may be one or more prompts asking you to make choices or add information needed by the extension. When the installation is concluded, you will be returned to the command line.

### List Installed App Extensions

There are several ways to "discover" what App Extensions have been installed:

```bash
$ quasar ext
$ quasar info
$ cat quasar.extensions.json
```

### "Running" App Extensions
There is no one way to run app extensions, because some of them might not even have any code to run (i.e. are merely template files copied to specific folders within your project), whereas others may merely be installation helpers and others might choose to add a new command to the Quasar CLI.

Nevertheless, each and every App Extension will be initialized during `quasar dev` and `quasar build`.

### Updating an App Extension
You may need to update your extension, and this is done with the same command as used for installation:

```bash
$ quasar ext add <ext-id>
```

::: warning
Reinstalling the extension MIGHT overwrite files that you have changed. You will be presented with the option to overwrite the files detected.
:::

### Removing an App Extension
You can remove an App Extension from being hooked from the Quasar CLI by running this command. Depending upon the author and the extension itself, you may have to manually clean up files though.

```bash
$ quasar ext remove <ext-id>
```

## List of official app-extensions
Check out [Discover App Extensions](/app-extensions/discover) page.
