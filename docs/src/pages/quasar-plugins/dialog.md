---
title: Dialog Plugin
related:
  - /vue-components/dialog
  - /quasar-plugins/bottom-sheet
---

Quasar Dialogs are a great way to offer the user the ability to choose a specific action or list of actions. They also can provide the user with important information, or require them to make a decision (or multiple decisions).

From a UI perspective, you can think of Dialogs as a type of floating modal, which covers only a portion of the screen. This means Dialogs should only be used for quick user actions only.

::: tip
Dialogs can also be used as a component in your Vue file templates (for complex use-cases, like specific form components with validation, selectable options, etc.). For this, go to [QDialog](/vue-components/dialog) page.
:::

The advantage of using Dialogs as Quasar Plugins as opposed to Components is that the plugin can also be called from outside of Vue space and doesn't requires you to manage their templates. But as a result, their customization cannot be compared to their component counterpart.

With the QDialog plugin, you can programmatically build three types of dialogs with the following form content:
 1. A prompt dialog - asking the user to fill in some sort of data in an input field.
 2. A set of options for the user to select from using either radio buttons or toggles (singular selection only) or check boxes (for multiple selections).
 3. A simple confirmation dialog, where the user can cancel or give her "ok" for a particular action or input.

In order to create #1, the prompting input form, you have the `prompt` property within the `opts` object.

In order to create #2, the options selection form, you have the `options` property within the `opts` object.

I'ts also possible to make the ENTER key a confirmation button setting the prop `enterConfirm` to true.

## Installation
<doc-installation plugins="Dialog" />

## Usage
::: tip
For all the examples below, also see the browser console while you check them out.
:::

::: warning
This is not an exhaustive list of what you can do with Dialogs as Quasar Plugins. For further exploration check out the API section.
:::

<doc-example title="Basic" file="Dialog/Basic" />

<doc-example title="Radios, Checkboxes, Toggles" file="Dialog/Pickers" />

<doc-example title="Other options" file="Dialog/OtherOptions" />

## Dialog API
<doc-api file="Dialog" />
