---
title: Quasar-Firebase Introduction
desc: Introduction of firebase and the integration and approach of working with firebase within a Quasar project
---
Firebase is Google's mobile platform that helps you quickly develop high-quality apps and grow your business. It initially was created as a startup in 2011, and was publicly available in 2012. In October of 2014 Google acquired Firebase, and has evolved into a platform that has 18 products and is currently being used by 1.5 million apps as of October 2018. [Wiki](https://en.wikipedia.org/wiki/Firebase)

#### **If you're here, you have done two things:**

- Chosen the Quasar Framework to be your Vuejs front-end component framework
- Chosen Firebase at the minimum to handle your Quasar application's authentication... maybe more

The docs contained within are a set of guidelines to implement firebase's services within the context of the Quasar Framework. These docs will try to focus on implementations from a production standpoint. Initial code examples will have a small section of an simple approach with implementation or topics for you to see a basic implementation, but will quickly move over to approaches that are move common in production level environments. There will also be an effort to build off of code from one section to another where appropriate to focus on illustrating how code in specific files should ideally be handled and how they should grow as needs arise.

::: warning
Please note that over times these docs will probably change as technologies and/or application considerations will change.
:::

Through out these firebase docs the intention is to have sample apps to highlight specific firebase features. These sample apps will share a consistent application structure providing a firebase service architecture for initialization and authentication. Other services will be separated for ease of maintenance and context.

Specific pieces of the sample application will be called out from a procedural explanation point of view. Not all code will be highlighted in the docs. A link to the appropriate section will be provided. At times some code snippets will be shown for the purpose of explanation.

Firebase & Vuejs doc references will be highlighted and linked for additional context and explanation when needed, as well as referencing articles around the web that might offer even further insight or opinions on how to work with firebase.

If you have any questions or comments please submit a Docs PR, or find us in the #firebase channel on the Quasar Discord server.
