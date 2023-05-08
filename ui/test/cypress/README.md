# Component testing Quasar components

This folder contains a testing harness for [Cypress component testing](https://docs.cypress.io/guides/component-testing/introduction).

## Running the tests
```bash
# run tests in watch mode with visual feedback one component at a time
# use when developing
yarn test:component
# run the build script, then run the tests
# run it locally before pushing the branch and creating a PR
yarn test:component:ci

# ---
# manual steps, you may need them when building the package once and running multiple tests suite on it

# build the package, to be able to run the tests
yarn test:build
# execute all tests without visual feedback, using the previously generated bundle
yarn test:component:run
```

## Component test setup
Each component of Quasar has it's own API, which we will use to also write component tests. When the whole API is covered we can ensure the components work as documented and vice-versa. 

There is some overlap in the API of components which Quasar abstracts to composables. These composables are tested once against one of the components using it. This means that the `.spec.js` file of a specific component will not always have all the properties/methods/slots/events listed that are in the API documentation.

## Components list todo
Here's a list of what to pickup first based on which components popup the most into the repo issues.

Shortlist :memo:
- [ ] QInput (400+)
- [ ] QDialog (400+)
- [ ] QTable (300+)
- [ ] QDate (150+)
- [ ] QEditor (100+)
- [ ] QTabs (100+)
- [ ] QUploader (100+)

In progress :clap:
- [x] QSelect (600+)

Done :white_check_mark:
- [x] QAvatar
- [x] QBadge
- [x] QBanner
- [x] QBar
- [x] QBreadcrumbs
- [x] QBreadcrumbsEl 
- [x] QButton (230+)
- [x] QChip (100+)
- [x] QMenu (140+)

## Known issues
Any help to resolve these issues is welcome.

### Transitions
Tests on components which show/hide themselves with a transition (eg. QMenu) will fail unless we add a custom delay.
Right now the workaround is to add a delay of 300ms to the test to wait for the transition to finish, but this is not ideal as it greatly slows down tests and force us to disable `cypress/no-unnecessary-waiting` ESLint rule all over the place.

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
- The `.spec.js` files are part of the `src/ui` and are handled by the `.eslintrc.js` file `overrides` there
- Had to add to `ui/tsconfig.json` include array to include the `commands.d.ts` which is necessary for autocomplete of custom commands when writing tests
- Visual snapshot testing package isn't currently working with Cypress. Cypress core team suggests using [Percy](https://percy.io/) instead, which has a free tier for open source communities
- In `ui/test/cypress/support/component.js` I have to import global quasar css, as well as the icons css. This file is run before every test suite as a global configuration of your tests.
- To make `app-vite`/`app-webpack` detection work, we had to add `app-vite` as a devDependency of `ui/dev`, even if that's its only use
- Cypress AE needs a `quasar` dependency to use its `installQuasarPlugin`, but when `test:component` is executed within `ui` folder, Vite plugin adds an alias (`quasar` > `quasar/dist/quasar.esm.js`) expecting to be executed into a Quasar project. This results into a broken `ui/dev/quasar/dist/quasar.esm.js` import. To fix this, we added a file at that path which re-exports what Vite needs to run.
- Vite AE needs transforms and api generated JSONs to run component tests, so we defined a `test:build` step which is called before each `test:component` execution.
