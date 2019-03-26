---
title: App Extensions
---

App Extensions are a way to painlessly inject complicated (or simple) libraries with a variety of dependencies, boot files, templates and custom logic. They can extend webpack, `quasar.conf.js`, tightly couple external UI components to core, and even register new commands with the CLI. They can be run with `quasar dev` and have complete access to the current live **`ctx`** (context).

The patterns for development literally open the floodgates to making Quasar one of the most extensible and powerful frameworks out there - now limited only by your imagination and innovation. This page will introduce you to the usage of App Extensions.

::: tip
Because of their deep integration with Quasar, app extensions will only run in the context of the Quasar CLI. This means that you will not be able to install them or run them in vue-cli or UMD environments.
:::


## What can an App Extension do?
 
1. Enhance CLI behavior with new commands
2. Make a Quasar UI plug-in
3. Install an accompanying application
4. Create and share a custom component
5. Create and share added features to the framework or other applications
6. Build, launch and control an API server
7. Hook, combine and extend quasar core components
8. Modify code based on dynamically changing values that sit outside of the Quasar environment
9. Create and manage abstractions of platform specific interfaces
10. ... and a whole lot more 

## Anatomy of App Extensions
App Extensions are installed, executed and can be uninstalled. The following guide discusses this in an abstract way. For details about individual extensions and how to work with them, please consult their respective repositories.

### Installing an App Extension
```
$ quasar ext add <ext-id>
```
This command will find and install the extension's module. After installation is complete, there may be one or more prompts asking you to make choices or add information needed by the extension. When the installation is concluded, you will be returned to the command line.

### List Installed App Extensions
There are several ways to "discover" what App Extensions have been installed:
```
$ quasar ext
$ quasar info
$ cat quasar.extensions.json
```

### "Running" App Extensions
There is no one way to run app extensions, because some of them might not even have any code to run (i.e. are merely template files copied to specific folders within your project), whereas others may merely be installation helpers and others might choose to add a new command to the Quasar CLI.

Nevertheless, each and every App Extension will be initialized during `quasar dev` and `quasar build`.

### Updating an App Extension
You may need to update your extension, and this is done with the same command as used for installation:
```
$ quasar ext add <ext-id>
```
::: warning
Reinstalling the extension MIGHT overwrite files that you have changed. You will be presented with the option to overwrite the files detected. 

:::


### Removing an App Extension
You can remove an App Extension from being hooked from the Quasar CLI by running this command. Depending upon the author and the extension itself, you may have to manually clean up files though.
```
$ quasar ext remove <ext-id>
```
 


## List of official app-extensions
Here is the current list of official app-extensions made by the Quasar team. 

### Tooling
 - [@quasar/testing](https://github.com/quasarframework/quasar-testing) includes 9 pre-configured sub-extensions for all of your testing needs
 - [@quasar/typescript](https://github.com/quasarframework/app-extension-typescript) transform your project into typescript awesomeness

### Project Rigging
 - [@quasar/dotenv](https://github.com/quasarframework/app-extension-dotenv) a slightly opinionated management tool to use dotenv in your application
 - [@quasar/qenv](https://github.com/quasarframework/app-extension-qenv) a less slightly opinionated management tool to propogate variables to the browser for a variety of unlimited environments (dev, prod, test, etc) for use in your application
- [@quasar/icon-factory](https://github.com/quasarframework/app-extension-icon-factory) cross-platform construction kit to generate all app-icons (favicons, .ico, .icns) for distributables

### Components
 - [@quasar/qmediaplayer](https://github.com/quasarframework/app-extension-qmediaplayer) HTML5 Video and Audio player
 - [@quasar/qflashcard](https://github.com/quasarframework/app-extension-qflashcard) Show some information and reveal more with CSS Transition Mashups
 - [@quasar/qoverlay](https://github.com/quasarframework/app-extension-qoverlay) Overlays simplified
 - [@quasar/qactivity](https://github.com/quasarframework/app-extension-qactivity) Create activity timelines

### In Development
 - [@quasar/graphql](https://github.com/quasarframework/app-extension-graphql) Create GraphQL server and Apollo frontend
 - [@quasar/feathersjs](https://github.com/quasarframework/app-extension-feathersjs) Create FeathersJS server and front-end integration
 - [@quasar/amplify](https://github.com/quasarframework/app-extension-amplify) Integrate and manage AWS Amplify 
 - [@quasar/firebase](https://github.com/quasarframework/app-extension-firebase) Integrate and manage Google Firebase / Firestore
  - [@quasar/qtranslate](https://github.com/quasarframework/app-extension-qtranslate) Deep localization including datetime, currency and string management
  - [@quasar/universal-fs](https://github.com/quasarframework/app-extension-universal-fs) Wrap the filesystem interface for web, cordova and electron with one abstraction
