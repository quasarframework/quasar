---
title: Dialog
---

Quasar Dialogs are a great way to offer the user the ability to choose a specific action or list of actions. They also can provide the user with important information, or require them to make a decision (or multiple decisions).

From a UI perspective, you can think of Dialogs as a type of floating modal, which covers only a portion of the screen. This means Dialogs should only be used for quick user actions, like verifying a password, getting a short App notification or selecting an option or options quickly. For more in depth user interactions, you should use QModal (add link to QModal).

::: tip NOTE
Dialogs can be used either as a component in your Vue file templates (for complex use-cases, like specific form components with validation, selectable options, etc.), or they can be used as a globally available method for more basic use cases, like the native JS alert(), prompt(), etc.
:::

::: tip IMPORTANT!
When the user hits the phone/tablet back button (only for Cordova apps), the Dialog will be closed automatically. Also, when on a desktop browser, hitting the `ESCAPE` key will also close the Dialog, as does clicking or touching outside of the Dialog.
:::

## Installation as a Plugin
<doc-installation plugins="QDialog" />

## Usage as a Plugin
<doc-example title="Examples" file="QDialog/Plugin" />


## Installation as a Component
<doc-installation component="QDialog" /> 

## Usage as a Component - Part 1
<doc-example title="Examples" file="QDialog/Component1" />

## Usage as a Component - Part 2
<doc-example title="Examples" file="QDialog/Component2" />

## Usage as a Component - Part 3
<doc-example title="Examples" file="QDialog/Component3" />

### API
<doc-api file="QDialog" />
