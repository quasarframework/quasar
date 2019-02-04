---
title: Testing & Auditing
---

Your Quasar projects have the ability to add unit and integration (aka e2e) testing harnesses, as well as an ever-growing suite of product quality auditing tools. This introduction will not go into details about how to write and use tests, for that please consult the specially prepared and maintained documentation at the dedicated [Quasar Testing](https://testing.quasar-framework.org) docs site. For issues, please report to the [Testing repo at GitHub](https://github.com/quasarframework/quasar-testing). If you are a beginner, consider reading one of the books in the "Further Reading" section.

## High level overview

You can install multiple pre-rigged testing harnesses to your existent 1.0+ Quasar application by running a simple command. This command will pull and install a node module (with dependencies) into your project's `package.json`, place necessary configuration files as appropriate and if you so choose, it will also add script commands that expose some of the functionality of the respective harness. You can add multiple harnesses and even use them for your continuous integration pipelines - as appropriate.

Testing is not in and of itself hard. The most complicated part is setting up the testing harness. The trick lies in knowing what to test. If you are new to testing, it is absolutely imperative that you familiarize yourself with some of the concepts and patterns. There are some links for further reading at the end of this document page.

<div class="q-my-lg text-center">
  <div class="text-h3">REMEMBER</div>
  <div class="text-h5">Test the functionality, not the function</div>
</div>

## Installing

```shell
$ cd your-quasar-project
$ quasar ext --add @quasar/testing
```

The lightweight extension installer will ask you which testing harnesses you want to install. Then it will install the respective extensions for these harnesses, which you can configure as you like. It is how multiple testing harnesses are ideally managed within a Quasar project.

It will provide you with a new `quasar run` command that you can use to execute test-runners - and even your HMR dev environment at the same time. This approach can, for example, be quite helpful if you need to pass quasar.ctx to the test runner...

```
# Example to run jest --watch && dev server
$ quasar run @quasar/testing test --unit=jest.watch.coverage --dev=pwa
```

If you ever need to review your choices you can take a look at `quasar.extensions.json`.

If you don't want to install the base package, you don't have to do so. You can install each test harness app extension individually. They are completely standalone.

## Updating / Resetting

If you mess up your configuration and need to reset - or just want the latest Quasar-approved packages, this would be the way to do it:
```shell
$ quasar ext --add @quasar/testing-unit-jest
```
Be careful though, reinstalling will overwrite ALL existing files (including configurations) if you tell it to. Also, it will install the new packages (if there are any). To prevent installing new or updated node modules, you may do this:

```shell
$ quasar ext --add @quasar/testing-e2e-cypress --skip-pkg
```

## Removing

If you want to remove the testing harness, you can run:
```shell
$ quasar ext --remove @quasar/testing-unit-jest
```
This will remove the associated node module and its dependencies, but it will not delete or modify any files.

## Usage

### Unit Testing

We recommend using Jest 24. There are many, many reasons for this. Just take our word for it.

```shell
$ quasar ext --add @quasar/testing-unit-jest
```

We have included:
- a configuration file`jest.config.js`
- `/test/jest/jest.setup.js
- `.babelrc` file
- a `quasar` scaffolding helper
- a 'validity' test that makes sure quasar is initiatable


::: warning
If you are not using git or mercurial to manage your code, jest --watch will not work because jest uses version-control to track which files can be looked at. This leaves you with two options:

1. run `git init` in your project directory (or permit the installer to do it for you)
2. use the alternative `--watchAll` flag for Jest - which will probably have a performance hit - make sure you are ignoring all the folders possible in your Jest configuration.
:::

We have included the optional ability to place your test code inside your vue files, should you choose to do so. It will be rendered by webpack HMR, and there is a script we have included that will run both the `quasar dev` command and `jest --watch`

```
<test lang="jest">
  /* your complete test file here */
</test>
```

::: tip
You may notice that your IDE doesn't know how to parse the test block, so go into the `<test/>` block, press `<alt> + <enter>`, select 'inject language or reference' and select `javascript`. This will grant `<test/>` blocks autocomplete.
:::

### Integration Testing
We recommend testing webapps with Cypress. The test development experience is a real pleasure.

```shell
$ quasar ext --add @quasar/testing-e2e-cypress
```

::: warning
You must have a running dev server in order to run integration tests. Be sure to either set the `"baseUrl"` in the `/cypress.json` file or use the `test` command provided by the base `@quasar/testing` extension.
:::

We actually recommend installing Cypress globally, because otherwise it is a pretty large package to weigh down the already [heaviest thing in the universe](https://i.redd.it/tfugj4n3l6ez.png)


### Quality Auditing
```shell
$ quasar ext --add @quasar/testing-quality
```

Auditing the quality of your app is something you want to do before you go in production. Depending on your perspective, quality can mean many things. So we have put together a few tools that we think can help you have a qualitatively better project.

The `Lighthouse` tool can help you identify issues with your PWA app, but only if you serve the built version of your project. If you use it a lot, consider installing it globally.

`Snyk` is a tool for identifying node modules that have security implications. Running this regularly will keep you alerted to issues that may be stemming from repositories you use.

`Node License Finder (nlf)` is a free tool you can use to catalog all the licenses of the hundreds of open-source projects you are using in your project.



### Where is `%_my_darling_%` harness?
There will be more and more test-harnesses coming as time permits. If you would like to help us add official harnesses, please get in touch on Discord. Do not merely make a PR, as there are several people working in private forks and it is likely that the harness you are interested in may already be in some stage of development.

## Further Reading

### Books
- [Testing Vue.js Applications](https://www.manning.com/books/testing-vue-js-applications) by Edd Yerburgh, the author of the `@vue/test-utils` repo
- [Free Vue Testing Handbook](https://lmiller1990.github.io/vue-testing-handbook/)

### Tutorials
- [Unit Testing Vue Router with Jest](https://medium.com/js-dojo/unit-testing-vue-router-1d091241312)
- ... add your suggestions here

### Documentation
- [@vue/test-utils](https://vue-test-utils.vuejs.org)
- [jest 24](https://facebook.github.io/jest/)
- [cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Is-Simple)
- [lighthouse](https://developers.google.com/web/tools/lighthouse/#cli)
- [snyk](https://snyk.io/test)
- [nlf](https://www.npmjs.com/package/nlf)
- [chai](http://www.chaijs.com/)
- [istanbul](https://istanbul.js.org/)
