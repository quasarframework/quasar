# Unit testing Quasar components

This folder contains a testing harness for [Cypress component testing](https://docs.cypress.io/guides/component-testing/introduction).

## Additions/quirks needed for this to work
Here is a list of things I needed to do to make this work:

- Get a webpack config from quasar project. This is necessary for cypress to fire up it's server to serve up components. I used the `ui/dev` project for this.
- Because cypress looks for a `cypress.json` in that project folder I had to add that file in `ui/dev/cypress.json`
- The `.spec.js` files are part of the `scr/ui` and are handled by the `.eslintrc.js` file there. I had to add the `mocha` env to use `describe` etc. Also `expect` is added in globals to make use of that command inside .spec.js files.
- In general I added `.vscode/settings.json` to make it so that ESLint will autofix stuff on save so I don't go nuts.
- Had to add to `ui/tsconfig.json` include array to include the `commands.d.ts` which is necessary for autocomplete of custom commands when writing tests
- I added a visual snapshot testing package and configured that to include the snapshots made inside the folder of the component that is tested. However the screenshots are always place inside a `All Specs` folder in there. There is no option to change the name of that folder :(
- In `ui/test/cypress/support/unit.js` I have to import global quasar css, as well as the icons css. This file is run before every test suite as a global configuration of your tests.