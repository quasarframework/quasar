---
title: Quick Start
desc: Get up and developing a Quasar app in less than 3 minutes.
---

It takes three steps and in a couple of minute, you are off a running with a full-fledged Vue app, built with state-of-the-art best practices via Quasar's CLI. 

::: tip
If you are a more advanced Vue developer, we invite you to start off with the [CLI Installation instructions](/quasar-cli/installation) or [decide between other means of using Quasar](/start/pick-quasar-flavour). 
:::

## Prerequisites
Make sure that you have Node >=12.22.1 and NPM >=6.14.12 installed on your machine. Please do not use any odd versions of Node, as these are considered experimental.

## Step 1 - Install the Quasar CLI 

Enter the following command:
```bash
$ yarn global add @quasar/cli
# or
$ npm install -g @quasar/cli
```
The installation of the CLI is pretty straightforward. Once it is installed with no errors, you are ready for Step 2.

## Step 2 - Create a Project

Enter the following Quasar CLI command, with `<folder_name>` being the name of your new project's folder.
```bash
$ quasar create <folder_name>
```

As the CLI command runs, you'll be prompted with some options. Depending on your needs, you can add things like TypeScript support or a different CSS preprocessor. If you are unsure about any of the options, just take the defaults (hit enter) and you'll be good to go. You can change the options later if you wish.


## Step 3 - Start developing

Now the last step. Drop down into the newly created project folder and run the Quasar CLI command to start the dev server. 
```bash
$ cd <folder_name>
# then run 
$ quasar dev
```

You'll see the dev server compiling your new application and once it is finished, your new app should open up in your browser. That's it! You can now develop your app with your favorite IDE/ Code Editor.

## Now What?

If you are new to Quasar and a...

**(Beginner Vue) JavaScript Dev** - we highly recommend [learning Vue](/start/how-to-use-vue). 

**Intermediate Vue Dev** - we recommend getting accustomed to [Quasar's Directory Structure](/quasar-cli/directory-structure) and it's different build modes, [starting with SSR](/quasar-cli/developing-ssr/introduction) (the project you built is an SPA). 

**Advanced Vue Dev** - You might want to use Quasar in different scenarios outside of Quasar's own CLI, then check out the different [Quasar Flavours](/start/pick-quasar-flavour). Or, if you wish to stick with the Quasar CLI, check out the different build modes, [starting with SSR](/quasar-cli/developing-ssr/introduction) and please be sure not to miss out on [App Extensions](/app-extensions/introduction).  

