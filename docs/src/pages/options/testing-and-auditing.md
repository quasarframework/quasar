---
title: Testing & Auditing
---

Your Quasar projects have the ability to add unit and integration (aka e2e) testing, as well as quality auditing. This introduction will not go into details about how to write and use tests, for that please consult the specially prepared and maintained documentation at the dedicated [Quasar Testing](https://testing.quasar-framework.org) docs site. For issues, please report to the [Testing repo at GitHub](https://github.com/quasarframework/quasar-testing).

## High level overview

You can install multiple pre-rigged testing harnesses to your existent 1.0+ Quasar application by running a simple command. This command will pull and install a node module (with dependencies) into your project's `package.json`, place necessary configuration files as appropriate and if you so choose, it will also add script commands that expose some of the functionality of the respective harness. You can add multiple harnesses and even use them for your continuous integration pipelines - as appropriate.

Testing is not in and of itself hard. The most complicated part is setting up the testing harness. The trick lies in knowing what to test. If you are new to testing, it is absolutely imperative that you familiarize yourself with some of the concepts and patterns. There are some links for further reading at the end of this document page.

::: tip
**<center>REMEMBER</center>**
<center>Test the functionality, not the function.</center>
::: 

The test-driven-design approach will also help you to write better (and fewer) tests. Even though it may seem like it slows you down to some degree, this habit of great programmers pays its dividends when other developers accidentally change the interface. Think of tests like insurance for your code that always pays out.


## Installing

This example will show you how to install the Jest unit-testing harness. The others work in the same fashion. Your terminal path must be within the app folder.

```shell
$ quasar ext --add @quasar/testing-unit-jest
$ quasar ext --add @quasar/testing-quality
```

Answer the questions that the installer asks, and you're done.

::: tip
We recommend beginners choose all the options available. Manual configuration is a very complicated proposition.
:::

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

We recommend using Jest. There are many, many reasons for this. Just take our word for it. (There are other )

```shell
$ quasar ext --add @quasar/testing-unit-jest
```

::: warning
If you are not using git or mercurial to manage your code, jest --watch will not work because jest uses version-control to track which files can be looked at. This leaves you with two options:

1. run `git init` in your project directory (or permit the installer to do it for you)
2. use the alternative `--watchAll` flag for Jest - which will probably have a performance hit - make sure you are ignoring all the folders possible in your Jest configuration.
:::

We have included the optional ability to place your test code inside your vue files, should you choose to do so. 
```html
<test lang="jest">
/* all your test code here */
</test>
```

::: tip
You may notice that your IDE doesn't know how to parse the test block, so go into the <test> block, press `<alt> + <enter>`, select 'inject language or reference' and select `javascript`. This will grant <test> blocks autocomplete.
:::

### Integration Testing
```shell
$ quasar ext --add @quasar/testing-e2e-cypress
```

### Quality Auditing
```shell
$ quasar ext --add @quasar/testing-quality
```

### Where is `%_my_darling_%` harness?
There will be more and more test-harnesses coming as time permits. If you would like to help us add official harnesses, please get in touch on Discord. Do not merely make a PR, as there are several people working in private forks and it is likely that the harness you are interested in may already be in some stage of development.

## Further Reading

Books
- [Testing Vue.js Applications](https://www.manning.com/books/testing-vue-js-applications) by Edd Yerburgh, the author of the `@vue/test-utils` repo
- [Free Vue Testing Handbook](https://lmiller1990.github.io/vue-testing-handbook/)

Documentation
- [@vue/test-utils](https://vue-test-utils.vuejs.org)
- [jest 24](https://facebook.github.io/jest/)
- [cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Is-Simple)
- [lighthouse](https://developers.google.com/web/tools/lighthouse/#cli)
- [snyk](https://snyk.io/test)
- [chai](http://www.chaijs.com/)
- [istanbul](https://istanbul.js.org/)
