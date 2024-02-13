---
title: Dialog
desc: The QDialog component provides a UI for modals with functionalities like positioning, styling, maximizing and more.
keys: QDialog
examples: QDialog
related:
  - /quasar-plugins/dialog
  - /vue-directives/close-popup
  - /vue-components/card
  - /vue-components/popup-proxy
---

The QDialog component is a great way to offer the user the ability to choose a specific action or list of actions. They also can provide the user with important information, or require them to make a decision (or multiple decisions).

From a UI perspective, you can think of Dialogs as a type of floating modal, which covers only a portion of the screen. This means Dialogs should only be used for quick user actions, like verifying a password, getting a short App notification or selecting an option or options quickly.

::: tip
Dialogs can also be used as a globally available method for more basic use cases, like the native JS alert(), prompt(), etc. For the latter behaviour, go to [Dialog Plugin](/quasar-plugins/dialog) page.
:::

::: warning Masterclass TIP
Rather than cluttering your .vue templates with QDialogs, it's best if you write a component for your dialog and use the [Dialog Plugin](/quasar-plugins/dialog#invoking-custom-component) to invoke it from anywhere in your app.
:::

<DocApi file="QDialog" />

## Usage

::: warning Note
It's best that your QDialog main content is a QCard. However, if you are planning on using any other component (like QForm) or tag, make sure that the direct child of QDialog is rendered with a `<div>` tag (or wrap it with one yourself).
:::

### Basic

<DocExample title="Basic" file="Basic" />

### Styling

<DocExample title="Styling" file="Style" />

### Positioning
<DocExample title="Positions" file="Positioning" />

::: tip
Do not mistake "position" prop with the show/hide animation. If you want a custom animation, you should use `transition-show` and `transition-hide` which can be applied regardless of "position" or "maximized".
:::

<DocExample title="Maximized" file="Maximized" />

### Various content
Dialogs can contain any content. Some examples:

<DocExample title="Various content" file="VariousContent" />

<DocExample title="With containerized QLayout" file="Layout" />

::: tip
If you are going to use the containerized QLayout, you'll need to put a width on your QDialog, if using left/right position, or a height, if using top/bottom position. You can use vw and vh units.
:::

### Handling scroll
<DocExample title="Scrollable dialogs" file="Scrollable" />

### Different modes
User cannot dismiss the Dialog by pressing ESCAPE key or by clicking/tapping on its backdrop.

<DocExample title="Persistent" file="Persistent" />

Dialogs can also be a part of the page, without requiring immediate focus. It's where "seamless" mode comes into play:

<DocExample title="Seamless" file="Seamless" />

### Dialog in dialog
You are able to open dialogs on top of other dialogs, with infinite number of depth levels.

<DocExample title="Inception" file="Inception" />

### Sizing
You are able to customize the size of the Dialogs. Notice we either tamper with the content's style or we use `full-width` or `full-height` props:

<DocExample title="Sizing examples" file="Sizing" />

## Cordova/Capacitor back button
Quasar handles the back button for you by default so it can hide any opened Dialogs instead of the default behavior which is to return to the previous page (which is not a nice user experience).

However, should you wish to disable this behavior, edit your `/quasar.config` file:

```tabs
<<| js For Capacitor |>>
// quasar.config file
return {
  framework: {
    config: {
      capacitor: {
        // Quasar handles app exit on mobile phone back button.
        backButtonExit: true/false/'*'/['/login', '/home', '/my-page'],

        // On the other hand, the following completely
        // disables Quasar's back button management.
        backButton: true/false
      }
    }
  }
}
<<| js For Cordova |>>
// quasar.config file
return {
  framework: {
    config: {
      cordova: {
        // Quasar handles app exit on mobile phone back button.
        backButtonExit: true/false/'*'/['/login', '/home', '/my-page'],

        // On the other hand, the following completely
        // disables Quasar's back button management.
        backButton: true/false
      }
    }
  }
}
```
