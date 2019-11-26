---
title: Installation
desc: A set of Firebase installation instructions for the Quasar framework.
---

If your new to firebase you must create a firebase account with a google identity and create a project in the console. 

> Perform **steps 1 & 2** with the firebase setup up [instructions](https://firebase.google.com/docs/web/setup).

Once you've gotten your account and project setup in firebase it's time to install dependancies in your Quasar app, and start the configuration process.

::: tip Pro Tip
If you are developing an app that will live in a production environment firebase recommends creating separate projects in the firebase console.
One for production, and one for dev, and even a public testing endpoint if you’d like. The point here is to keep production data safe from development. This will be highlighted later [here](/backend-and-api/firebase/custom).
:::

Install firebase to your quasar app preferably via yarn:

```bash
yarn add firebase
```

\- or -

```bash
npm install firebase
```

Next is the configuration of the firebase sdk for initializing your project via firebase's [`initializeApp`](https://firebase.google.com/docs/reference/js/firebase.html#initialize-app) method. This is where a firebase application in the console will contain your sdk’s `firebaseConfig` object.

::: tip You can get access to your firebase config object at any time by:

- Sign in to Firebase, then open your project.
- Click the <q-icon name="settings" /> Settings icon, then select Project settings.
- In the Your apps card, select the nickname of the app for which you need a config object.
- Select Config from the Firebase SDK snippet pane.
- Copy the config object snippet, then add it to your app's HTML.
:::
