---
title: List and List Items
desc: How to use the QList, QItem, QItemSection and QItemLabel Vue components.
keys: QList,QItem,QItemSection,QItemLabel
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

## QList API
<doc-api file="QList" />

## QItem API
<doc-api file="QItem" />

## QItemSection API
<doc-api file="QItemSection" />

## QItemLabel API
<doc-api file="QItemLabel" />

## Usage

### Basic

<doc-example title="Basic" file="QItem/Basic" />

<doc-example title="On a dark background" file="QItem/Dark" dark />

<doc-example title="Dense" file="QItem/Dense" />

### QItemSection

<doc-example title="Left avatar/thumbnail QItemSection" file="QItem/AvatarLeft" />

<doc-example title="Right avatar/thumbnail QItemSection" file="QItem/AvatarRight" />

::: tip
When you have multi-line items, you could use `top` property on QItemSection side/avatar to align the sections to top, overriding default middle alignment.
:::

<doc-example title="Side QItemSection" file="QItem/SideSection" />

### Active state

<doc-example title="Active prop" file="QItem/ActiveState" />

### QItemLabel

::: warning
Notice you can handle label overflow with `lines` prop, telling it how many lines it can span. However, this feature uses Webkit specific CSS so won't work in IE/Edge.
:::

<doc-example title="ItemLabel" file="QItem/ItemLabel" />

### More involved examples

<doc-example title="Contact list" file="QItem/ExampleContacts" />

<doc-example title="Settings" file="QItem/ExampleSettings" />

<doc-example title="Emails" file="QItem/ExampleEmails" />

<doc-example title="Folder listing" file="QItem/ExampleFolders" />

For demoing purposes in the example below, we're using the `active` prop instead of QItem's router props (`to`, `exact`). UMD doesn't have Vue Router so you wouldn't be able to play with it in Codepen/jsFiddle.

<doc-example title="Menu" file="QItem/ExampleMenu" />

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
