---
title: App Extension Prompts API
desc: Syntax of the questions that the user is going to be asked in order to configure the Quasar App Extension.
---

This page refers to `src/prompts.js` file which handles the prompts when installing the App Extension. Not all App Extensions will need prompts -- this is an optional step.

The user's answers are stored into `/quasar.extensions.json` (root of project folder), which should not be tampered with unless you really know what you are doing.

Example of basic structure of the file:

```js
module.exports = function () {
  return [
    // questions
  ]
}
```

You will have access to `api.prompts` (which holds your App Extension's answers) in [Install](/app-extensions/development-guide/install-api), [Index](/app-extensions/development-guide/index-api) and [Uninstall](/app-extensions/development-guide/uninstall-api).

Let's now focus on the structure of the returned Array which defines the questions. The sections below offer examples for the most used types of questions.

::: warning
The following is not an exhaustive list of possible types of questions and by no means it describes the full API available. Check out [Inquirer.js](https://github.com/SBoudrias/Inquirer.js#readme) for that (which is used by Quasar CLI under the covers).
:::

## String
```js
{
  // "description" will be the variable
  // storing the answer
  name: 'description'
  type: 'input',
  required: false, // optional
  message: 'Project description',
  default: 'A Quasar Framework app', // optional
}
```

```js
{
  name: 'source_build',
  type: 'input',
  required: true, // optional
  message:
    'If you want a separate file to be the source image during production, please specify it here: ',
  validate: (input) => {
    // ...do something ...
  },
  default: (answers) => {
    return answers.source_dev || defaultImg
  }
}
```

## Confirm
```js
{
  // "featureX" will be the variable
  // storing the answer
  name: 'featureX',
  type: 'confirm',
  message: 'Use Feature X?',
  default: true // optional
}
```

## List of choices
```js
{
  // "iconSet" will be the variable
  // storing the answer
  name: 'iconSet',
  type: 'list',
  message: 'Choose Icon Set',
  choices: [
    {
      name: 'Material Icons (recommended)',
      value: 'material-icons', // value of the answer variable
      short: 'Material Icons' // Short name displayed after user picks this
    },
    {
      name: 'Fontawesome',
      value: 'fontawesome', // value of the answer variable
      short: 'Fontawesome' // Short name displayed after user picks this
    }
    // ... all other choices
  ]
}
```
