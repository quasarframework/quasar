---
title: Other Firebase Tools & Services
desc: Other Firebase tools and services the developer needs to know.
---

## Firebase Cli
The [Firebase CLI](https://firebase.google.com/docs/cli) is an essential tool when developing Quasar apps with Firebase. It provides a variety of tools for managing, viewing, and deploying to Firebase projects. Be sure to understand how to use it, and what can be done with it. 

Google recomends that you install it globally via: 

```bash
$ npm install -g firebase-tools
```

When ever there is an update and you execute a firebase-tool command you will recieve a prompt notifying you that there is an update. [Again, Google recomends keep in step with the latest and greates firebase-tools version](https://firebase.google.com/docs/cli#update-cli).

## Firebase Hosting
[Firebase Hosting](https://firebase.google.com/docs/hosting) is a great way to push your application in an instant with the Firebase CLI. It can be used in conjuction with a host of different configuration options to meet your development needs.

## Remote Config
[Remote Config](https://firebase.google.com/docs/remote-config/use-config-web) allows you to take your Quasar application to the next level by dynamically changing it's parameters in the cloud without distributing an app update

## Firebase Security Rules
[Firebase Security Rules](https://firebase.google.com/docs/rules) will keep your data safe and out of the hands of malicious users. They leverage extensible, flexible configuration languages to define what data your users can access.
