---
title: Bottom Sheet Plugin
desc: A Quasar plugin for displaying a list of user actions that slides up from the bottom edge of the app window.
keys: BottomSheet
examples: BottomSheet
related:
  - /quasar-plugins/dialog
  - /vue-components/dialog
---

Bottom Sheets slide up from the bottom edge of the device screen, and display a set of options with the ability to confirm or cancel an action. Bottom Sheets can sometimes be used as an alternative to menus, however, they should not be used for navigation.

The Bottom Sheet always appears above any other components on the page, and must be dismissed in order to interact with the underlying content. When it is triggered, the rest of the page darkens to give more focus to the Bottom Sheet options.

Bottom Sheets can be displayed as a list or as a grid, with icons or with avatars. They can be used either as a component in your Vue file templates, or as a globally available method.

<doc-api file="BottomSheet" />

<doc-installation plugins="BottomSheet" />

## Usage

```js
// outside of a Vue file
import { BottomSheet } from 'quasar'
BottomSheet.create({ ... }) // returns Object

// inside of a Vue file
import { useQuasar } from 'quasar'
setup () {
  const $q = useQuasar()
  $q.bottomSheet({ ... }) // returns Object
}
```

::: tip
When user hits the phone/tablet back button (only for Cordova apps), the Action Sheet will get closed automatically.

Also, when on a desktop browser, hitting the `ESCAPE` key also closes the Action Sheet.
:::

<doc-example title="List and Grid" file="Basic" />

<doc-example title="Force dark mode" file="Dark" />

::: tip
For an exhaustive list of options, please check API section.
:::
