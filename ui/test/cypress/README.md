# Component testing Quasar components

This folder contains a testing harness for [Cypress component testing](https://docs.cypress.io/guides/component-testing/introduction).

## Component test setup
Each component of Quasar has it's own API, which we will use to also write component tests. When the whole API is covered we can ensure the components work as documented and vice-versa. 

There is some overlap in the API of components which Quasar abstracts to composables. These composables are tested once against one of the components using it. This means that the `.spec.js` file of a specific component will not always have all the properties/methods/slots/events listed that are in the API documentation.

## Components list todo
I did a quick search in the issues to see which components popup the most, to make a shortlist of what to pickup first.

Shortlist :memo:
- [ ] QInput (400+)
- [ ] QDialog (400+)
- [ ] QTable (300+)
- [ ] QButton (230+)
- [ ] QDate (150+)
- [ ] QEditor (100+)
- [ ] QChip (100+)
- [ ] QTabs (100+)
- [ ] QUploader (100+)

In progress :clap:
- [X] QSelect (600+)

Done :white_check_mark:
- [X] QMenu (140+)
- [X] QAvatar

## Adding boilerplate code for other components
What to test for a specific component is based on the API documentation for that component. Along with each component (or composable) that Quasar had is a `.json` file which documents the properties, slots, methods and events.

There is a helper tool that will create the `describe` boilerplate based on this file for a specific component or composable, and output that to the console so you can copy paste it into a new file.

It can be used by calling a script from within the `ui` directory. It is used like:

```bash
yarn run test:create %COMPONENT_FOLDER_NAME%
yarn run test:create %COMPOSABLE_NAME%
```

Here are some examples:
```bash
yarn run test:create scroll-area
yarn run test:create use-field
```

For the `COMPONENT_FOLDER_NAME` you should look inside `ui/src/components` and use the name of the folder used there.

For the `COMPOSABLE_NAME` you should look inside `ui/src/composables/private` and use the name of the composable used there.

### Edge cases
There are some composables that are located inside the component folder along with the component. You can generate boilerplate for that component using the command like this:

```bash
yarn run test:create btn/use-btn
```

There are also some component folders which contain multiple components (like `page` and `table`). If you, for example, want to generate boilerplate for `QPageContainer` you can use the command like this:

```bash
yarn run test:create page/page-container
yarn run test:create page/PageContainer
```

The script will convert kebab case into pascal case so you could use either one. 

## Additions/quirks needed for this to work
Here is a list of things I needed to do to make this work:

- Because cypress looks for a `cypress.json` in that project folder I had to add that file in `ui/dev/cypress.json`
- The `.spec.js` files are part of the `src/ui` and are handled by the `.eslintrc.js` file there. I had to add the `mocha` env to use `describe` etc. Also `expect` is added in globals to make use of that command inside `.spec.js` files.
- In general I added `.vscode/settings.json` to make it so that ESLint will autofix stuff on save so I don't go nuts.
- Had to add to `ui/tsconfig.json` include array to include the `commands.d.ts` which is necessary for autocomplete of custom commands when writing tests
- I added a visual snapshot testing package and configured that to include the snapshots made inside the folder of the component that is tested. However the screenshots are always place inside a `All Specs` folder in there. There is no option to change the name of that folder :(
- In `ui/test/cypress/support/component.js` I have to import global quasar css, as well as the icons css. This file is run before every test suite as a global configuration of your tests.
