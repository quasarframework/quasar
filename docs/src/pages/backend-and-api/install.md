---
title: Installation & Initialization
desc: A set of Firebase installtion instructions for the Quasar framework.
---

Be sure to install read the firebase web setup here: https://firebase.google.com/docs/web/setup

Install firebase to your quasar app preferably via yarn:

```bash
yarn add firebase
```

\- or - 

```bash
npm install firebase
```

Next is the configuration of the firebase sdk for calling our first method `initializeApp`. This is where a firebase application in the console will contain your sdk’s `firebaseConfig` object. This can be done a few ways, either keeping your config object in your source or using quasar’s app extension qenv.

Qenv will allow us to keep the config in the source directory, but will also give us the option for git to ignore the file and will be bundled on the desired build type. Either for dev or production. Please refer to qenv installation and setup [here](https://github.com/quasarframework/app-extension-qenv).

One side note here is to also set up two separate app’s in the firebase console. One for production, and one for dev, and even a public testing endpoint if you’d like. The point here is to keep production data safe from development. This will be highlighted at a later point.

Once you’ve install qenv and have set up your `.quasar.env.json` file and updated your scripts block in your `package.json` we now are ready to start moving into our application structure
