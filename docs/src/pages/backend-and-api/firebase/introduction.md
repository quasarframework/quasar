---
title: Quasar-Firebase Introduction
desc: Introduction of firebase and the integration and approach of working with firebase within a Quasar project
---
Firebase is Google's mobile platform that helps you quickly develop high-quality apps and grow your business. It was initially created as a startup in 2011 and was publicly available in 2012. In October 2014 Google acquired Firebase which evolved into a platform that has 18+ products and is currently being used by 1.5 million apps as of October 2018. [Wiki](https://en.wikipedia.org/wiki/Firebase)

This documentation contains a set of guidelines and highlights the specifics with regard to the implementation of Firebase services into a Quasar application. Documentation starts with a simplified approach to the implementation and end up with the production-ready approaches.

::: tip Friendly Reminder
We recommend you to read the [Firebase Docs](https://firebase.google.com/docs/web/setup) first and foremost. A lot of your questions can be answered by researching its documentation.
:::

#### **If you're here, you have done two things:**

- Chosen the Quasar Framework to be your Vuejs front-end component framework
- Chosen Firebase at the minimum to handle your Quasar application's authentication... maybe more

All code examples are shown on a [demo applications](link) to highlight specific Firebase features. All apps share a consistent application structure mapping the Firebase service architecture for initialization and authentication. Other services are separated to ease further maintenance. Only relevant code snippets are shown in the docs which demonstrates relevant features. A link to the appropriate GitHub file is provided.

Firebase & Vuejs doc references are highlighted and linked for additional context, as well as referencing articles that might offer even further insight on how to work with the Firebase.
