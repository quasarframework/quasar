---
title: Testing & Auditing
desc: (@quasar/app-webpack) How to unit and end to end test a Quasar app.
---

Your Quasar projects have the ability to add unit and e2e testing harnesses. This introduction will not go into details about how to write and use tests, for that please consult the specially prepared and maintained documentation at the [testing repo at GitHub](https://github.com/quasarframework/quasar-testing/tree/dev). If you are a beginner, consider reading one of the books in the "Further Reading" section.

## High level overview

You can install multiple pre-rigged testing harnesses to your existing Quasar application by running a simple command. This command will pull and install a node module (with dependencies) into your project's `package.json`, place necessary configuration files as appropriate and if you so choose, it will also add script commands that expose some of the functionality of the respective harness. You can add multiple harnesses and even use them for your continuous integration pipelines - as appropriate.

Testing is not in and of itself hard. The most complicated part is setting up the testing harness. The trick lies in knowing what to test. If you are new to testing, it is absolutely imperative that you familiarize yourself with some of the concepts and patterns. There are some links for further reading at the end of this document page.

## Testing documentation

You can find the documentation of testing AEs at https://testing.quasar.dev or into [`dev` branch](https://github.com/quasarframework/quasar-testing/tree/dev) of quasar-testing repo.

You can find the documentation of testing AEs compatible with Quasar v1 into [`qv1` branch](https://github.com/quasarframework/quasar-testing/tree/qv1) of quasar-testing repo.

<q-btn label="Testing AEs documentation" icon-right="launch" href="https://testing.quasar.dev" target="_blank" />

## Installing

```bash
$ cd your-quasar-project
$ quasar ext add @quasar/testing
```

The lightweight extension installer will ask you which testing harnesses you want to install. Then it will install the respective extensions for these harnesses, which you can configure as you like. It is how multiple testing harnesses are ideally managed within a Quasar project.

It will provide you with a new `quasar run` command that you can use to execute test-runners - and even your HMR dev environment at the same time. This approach can, for example, be quite helpful if you need to pass quasar.ctx to the test runner...

```bash
# Example to run jest && dev server in pwa mode
$ quasar test --unit jest --dev="-m pwa"
```

If you ever need to review your choices you can take a look at `quasar.extensions.json`.

If you don't want to install the helper package, you don't have to do so. You can install each test harness app extension individually. They are completely standalone, but you won't have the `quasar test` command functionality.

## Further Reading

### Books
- [Testing Vue.js Applications](https://www.manning.com/books/testing-vue-js-applications) by Edd Yerburgh, the author of the `@vue/test-utils` repo
- [Free Vue Testing Handbook](https://lmiller1990.github.io/vue-testing-handbook/)

### Tutorials
- [Unit Testing Vue Router with Jest](https://medium.com/js-dojo/unit-testing-vue-router-1d091241312)
- ... add your suggestions here

### Documentation
- [@vue/test-utils](https://test-utils.vuejs.org)
- [jest 24](https://facebook.github.io/jest/)
- [cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Is-Simple)
- [lighthouse](https://developers.google.com/web/tools/lighthouse/#cli)
- [snyk](https://snyk.io/test)
- [nlf](https://www.npmjs.com/package/nlf)
- [chai](http://www.chaijs.com/)
- [istanbul](https://istanbul.js.org/)
