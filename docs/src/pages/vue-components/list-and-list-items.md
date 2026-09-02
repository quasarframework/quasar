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

- **QItemSection** - An item section can have several uses for particular content. They are controlled via the `avatar`, `thumbnail` and `side` props. With no props, it will render the main section of your QItem (which spans to the fullest of available space).
- **QItemLabel** - An item label is useful for predefined text content type within a QItemSection, or for header-like content of the QList itself.

<DocApi file="QList" />

<DocApi file="QItem" />

<DocApi file="QItemSection" />

<DocApi file="QItemLabel" />

## Usage

### Basic

<DocExample title="Basic" file="Basic" />

::: tip
A QItem with a `@click` listener is clickable by default (v2.29+): it gets the hover effects, keyboard activation and its `click` event without the `clickable` prop. Set `clickable` explicitly only when there is no listener (a `v-close-popup` entry, for example) or when you need to toggle the behavior through a boolean; an explicit `clickable="false"` wins over the listener.
:::

<DocExample title="Force dark mode" file="Dark" />

<DocExample title="Dense" file="Dense" />

### QItemSection

<DocExample title="Left avatar/thumbnail QItemSection" file="AvatarLeft" />

<DocExample title="Right avatar/thumbnail QItemSection" file="AvatarRight" />

::: tip
When you have multi-line items, you could use `top` property on QItemSection side/avatar to align the sections to top, overriding default middle alignment.
:::

<DocExample title="Side QItemSection" file="SideSection" />

### Active state

<DocExample title="Active prop" file="ActiveState" />

### QItemLabel

::: warning
Notice you can handle label overflow with `lines` prop, telling it how many lines it can span. However, this feature uses Webkit specific CSS so won't work in IE/Edge.
:::

<DocExample title="ItemLabel" file="ItemLabel" />

### More involved examples

<DocExample title="Contact list" file="ExampleContacts" />

<DocExample title="Settings" file="ExampleSettings" />

<DocExample title="Emails" file="ExampleEmails" />

<DocExample title="Folder listing" file="ExampleFolders" />

For demoing purposes in the example below, we're using the `active` prop instead of QItem's router props (`to`, `exact`). UMD doesn't have Vue Router so you wouldn't be able to play with it in Codepen/jsFiddle.

<DocExample title="Menu" file="ExampleMenu" />

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

  <q-item-section> Inbox </q-item-section>
</q-item>
```

You can also delay, cancel or redirect navigation, as seen below. For a more in-depth description of the `@click` event being used below, please refer to QItem API card at the top of the page.

<DocExample title="Links with delayed, cancelled or redirected navigation (v2.9+)" file="LinksWithGo" no-edit />

## Accessibility <q-badge label="v2.25+" />

QList exposes itself with the [WAI-ARIA `list` role](https://www.w3.org/TR/wai-aria-1.2/#list) by default (implicitly so when rendered as `ul`/`ol` through the `tag` prop) and the `role` prop overrides that. Each QItem derives its default role from the QList wrapping it:

| QItem                                           | inside default QList   | inside QList with `role="menu"`/`"menubar"` | outside QList / other QList `role` |
| ----------------------------------------------- | ---------------------- | ------------------------------------------- | ---------------------------------- |
| with `clickable`, a `@click` listener or a link | `button` / native link | `menuitem`                                  | `button` / native link             |
| non-interactive                                 | `listitem`             | none                                        | none                               |

This keeps the produced markup valid: ARIA's `list` may only own `listitem` children (which in turn require a list parent, so a standalone QItem claims no role), while `menu`/`menubar` may only own `menuitem`-type entries — declaring the role once on the QList is enough, as in the "Basic" example of [QMenu's Accessibility section](/vue-components/menu#accessibility). The `role` prop on QItem overrides the derived role for a single item (e.g. `menuitemcheckbox`/`menuitemradio` for toggle entries — managing `aria-checked` is then up to you).

::: warning
A list made up of only interactive items has no valid claim to the `list` role — such a container owns no `listitem` children. Declare what it actually is: `role="menu"` if it pops up as a list of commands, or `role="none"` to keep the items (announced as buttons/links) without list semantics.
:::
