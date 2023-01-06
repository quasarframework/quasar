---
title: List and List Items
desc: How to use the QList, QItem, QItemSection and QItemLabel Vue components.
keys: QList,QItem,QItemSection,QItemLabel
examples: QItem
related:
  - /vue-components/expansion-item
  - /vue-components/slide-item
  - /vue-components/separator
---

The QList and QItem are a group of components which can work together to present multiple line items vertically as a single continuous element. They are best suited for displaying similar data types as rows of information, such as a contact list, a playlist or menu. Each row is called an Item. QItem can also be used outside of a QList too.

Lists can encapsulate Items or Item-like components, for example [QExpansionItem](/vue-components/expansion-item) or [QSlideItem](/vue-components/slide-item). Also [QSeparator](/vue-components/separator) can be used to split up sections, where needed.

List Items have the following pre-built child components:

* **QItemSection** - An item section can have several uses for particular content. They are controlled via the `avatar`, `thumbnail` and `side` props. With no props, it will render the main section of your QItem (which spans to the fullest of available space).
* **QItemLabel** - An item label is useful for predefined text content type within a QItemSection, or for header-like content of the QList itself.

<doc-api file="QList" />

<doc-api file="QItem" />

<doc-api file="QItemSection" />

<doc-api file="QItemLabel" />

## Usage

### Basic

<doc-example title="Basic" file="Basic" />

<doc-example title="Force dark mode" file="Dark" />

<doc-example title="Dense" file="Dense" />

### QItemSection

<doc-example title="Left avatar/thumbnail QItemSection" file="AvatarLeft" />

<doc-example title="Right avatar/thumbnail QItemSection" file="AvatarRight" />

::: tip
When you have multi-line items, you could use `top` property on QItemSection side/avatar to align the sections to top, overriding default middle alignment.
:::

<doc-example title="Side QItemSection" file="SideSection" />

### Active state

<doc-example title="Active prop" file="ActiveState" />

### QItemLabel

::: warning
Notice you can handle label overflow with `lines` prop, telling it how many lines it can span. However, this feature uses Webkit specific CSS so won't work in IE/Edge.
:::

<doc-example title="ItemLabel" file="ItemLabel" />

### More involved examples

<doc-example title="Contact list" file="ExampleContacts" />

<doc-example title="Settings" file="ExampleSettings" />

<doc-example title="Emails" file="ExampleEmails" />

<doc-example title="Folder listing" file="ExampleFolders" />

For demoing purposes in the example below, we're using the `active` prop instead of QItem's router props (`to`, `exact`). UMD doesn't have Vue Router so you wouldn't be able to play with it in Codepen/jsFiddle.

<doc-example title="Menu" file="ExampleMenu" />

::: tip
For more complex menus, consider also using [QExpansionItem](/vue-components/expansion-item).
:::

### Connecting to Vue Router

You can use QItems together with Vue Router through `<router-link>` properties bound to it. These allow for listening to the current app route and also triggering a route when clicked/tapped.

```html
<q-item to="/inbox" exact>
  <q-item-section avatar>
    <q-icon name="inbox" />
  </q-item-section>

  <q-item-section>
    Inbox
  </q-item-section>
</q-item>
```

You can also delay, cancel or redirect navigation, as seen below. For a more in-depth description of the `@click` event being used below, please refer to QItem API card at the top of the page.

<doc-example title="Links with delayed, cancelled or redirected navigation (v2.9+)" file="LinksWithGo" no-edit />
