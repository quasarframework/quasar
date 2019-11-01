---
title: Authentication
desc: Firebase authentication instructions for the Quasar framework.
---


We'll use a firebase service set up so we can focus on authentication. Like mentioned before we’ll start with a simple happy path via registering and logging in user’s via email. To do this first, set up your firebase app in the console to use the email type of  authentication. You can do this here: [ Show an image of the console, and the Sign-in method tab ]

“Enable” the email authentication type, and set the toggle to enable, and click save. Passwordless sign-in will be discussed at a later point.

Next is creating a simple form to create a new user, and subsequently one that can log that user in.

Form example: <-code->