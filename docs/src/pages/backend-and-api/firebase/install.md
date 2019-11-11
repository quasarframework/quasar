---
title: Installation
desc: A set of Firebase installtion instructions for the Quasar framework.
---

If you're new to Firebase you must create a Firebase account with a Google identity and create a project in the console.

> Perform **steps 1 & 2** with the Firebase setup up [instructions](https://firebase.google.com/docs/web/setup).

Once you've gotten your account and project setup in Firebase it's time to install dependencies in your Quasar app and start the configuration process.

::: tip Pro Tip
If you are developing an app that will live in a production environment, Firebase recommends creating separate projects in the Firebase console.
One for production, one for dev, and even a public testing endpoint if you’d like. The point here is to keep production data safe from development. This will be highlighted later.
:::

Install Firebase to your quasar application preferably via yarn:

```bash
yarn add firebase
```

\- or -

```bash
npm install firebase
```

Next, configurethe Firebase sdk for initiallizing your project via Firebase's [`initializeApp`](https://firebase.google.com/docs/reference/js/firebase.html#initialize-app) method. This is where a Firebase application in the console will contain your sdk’s `firebaseConfig` object.

::: tip You can get access to your Firebase config object at any time by:

- Sign in to Firebase, then open your project.
- Click the <q-icon name="settings" /> Settings icon, then select Project settings.
- In the Your apps card, select the nickname of the app for which you need a config object.
- Select Config from the Firebase SDK snippet pane.
- Copy the config object snippet, then add it to your app's HTML.

\- or -


- In your conosle run: `$ firebase apps:sdkconfig web`
:::
