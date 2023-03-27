---
title: Quick Start
desc: Get up and developing a Quasar app in less than 3 minutes.
---

It takes two easy steps and in a couple of minutes, you are off and running with a full-fledged Vue app, built with state-of-the-art best practices via Quasar's CLI and also ready with Quasar's own powerful UI library.

::: tip
If you are a more advanced Vue developer, we invite you to start off by [deciding between all Quasar flavours](/start/pick-quasar-flavour).
:::

## Prerequisites
Make sure that you have Node >=14 (or any newer **LTS Node.js version**) and NPM >=6.14.12 or Yarn >= 1.21.1 installed on your machine. Please do not use any odd versions of Node, as these are [considered experimental](https://nodejs.org/en/about/releases/#releases).

## Step 1 - Create a Project

Enter the following command:

```bash
$ yarn create quasar
# or:
$ npm init quasar
```

As the `create` or `init` command runs, you'll be prompted with some options. Depending on your needs, you can select the CLI type (Vite or Webpack) and you can add things like TypeScript support or a different CSS preprocessor. If you are unsure about any of the options, just take the defaults (hit enter) and you'll be good to go. You can change the options, except for the CLI type, later if you wish.

### Optional - Install the Global CLI
For doing more with Quasar, you should also install the global CLI. With it you can directly run Quasar commands in the terminal, run a local http server for testing or do upgrades on your project.

```bash
$ yarn global add @quasar/cli
# or
$ npm install -g @quasar/cli
```

## Step 2 - Start developing

For the second and last step, navigate into the newly created project folder and run the Quasar CLI command to start the dev server.

```bash
$ cd <project_folder_name>
# then run:

# if you have the global CLI:
$ quasar dev
# otherwise:
$ yarn quasar dev # or: npx quasar dev
```

You'll see the dev server compiling your new application and once it is finished, your new app should open up in your browser. That's it! You can now develop your app with your favorite IDE/ Code Editor.

## Now What?

If you are new to Quasar and a...

**(Beginner Vue) JavaScript Dev** - We highly recommend [learning Vue](/start/how-to-use-vue).

**Intermediate Vue Dev** - We recommend getting accustomed to [Quasar's Directory Structure](/quasar-cli/directory-structure) and it's different build modes, [starting with SSR](/quasar-cli/developing-ssr/introduction) (the project you built is an SPA).

**Advanced Vue Dev** - You might want to use Quasar in different scenarios outside of Quasar's own CLI, then check out the different [Quasar Flavours](/start/pick-quasar-flavour). Or, if you wish to stick with the Quasar CLI, check out the different build modes, [starting with SSR](/quasar-cli/developing-ssr/introduction) and please be sure not to miss out on [App Extensions](/app-extensions/introduction).
