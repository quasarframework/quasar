---
title: Testing & Auditing
---

Quasar now comes with the ability to add unit and integration (aka e2e) testing to your application. This introduction will not go into details about how to write and use tests, for that please consult the specially prepared and maintained documentation at the dedicated [Quasar Testing](https://testing.quasar-framework.org) docs site.

## High level overview
You can install multiple pre-rigged testing harnesses to your existent 1.0+ Quasar application by running a simple command. 

## Installation Instructions

You can install testing harnesses by entering your project directory and running:
```shell


```


## Unit Testing

::: warning
If you are not using git or mercurial to manage your code, jest --watch will not work because jest uses version-control to track which files can be looked at. This leaves you with two options:

1. run `git init` in your project directory (or permit the installer to do it for you)
2. use the alternative `--watchAll` flag for Jest - which will probably have a performance hit - make sure you are ignoring all the folders possible in your Jest configuration.
:::

## Integration Testing

## Quality Auditing
