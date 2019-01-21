---
title: List and List Items
---

Quasar Lists and List Items are a group of components which can work together to present multiple line items vertically as a single continuous element. They are best suited for displaying similar data types as rows of information, such as a contact list, a playlist or menu. Each row is called an Item. Items can also be used outside of a List.

Lists can encapsulate Items or Item-like components, for example [QExpansionItem](/vue-components/expansion-item) or [QSlideItem](/vue-components/slide-item). Also [QSeparator](/vue-components/separator) can be used to split up sections, where needed.

List Items have the following pre-built child components:
* **QItemSection** An item section can have several uses for particular content. They are controlled via the `avatar`, `thumbnail`, `side` and `top` props. With no props, it is just a container for any content you'd like to add.

* **QItemLabel** An item label is useful for predefined text content within a QItemSection. It has two props for the type of label you'd like to achieve. `overline` for a kind heading label and `caption` for a bit lighter colored text for differentiation purposes. You can see the `caption` prop demonstrated in the first examples below.

## Installation
<doc-installation :components="['QList', 'QListItem']" />

## Usage

Below is an example of Qlist below a QToolbar showing a contact list. It also demonstrates QLabel and QLabel with the `caption` prop (the email addresses). This small example also demonstrates QSection with the `avatar` prop.

<doc-example title="Simple Contact List Example" file="QListItem/Contacts" />

The example below is the contacts example again, but with the `dark` prop set to true. Notice the `dark` prop also only needs to be set within QList. With `dark` set in QList, all the QItem components within the list and their respective elements, are automatically switched to dark too.

<doc-example dark title="Simple Contact List Example Dark" file="QListItem/ContactsDark" />

#### List Items in a Simple Menu
Lists can also be used to build a simple menu with links to different pages. In the below example, QList is being used to build a simple navigational menu in the QDrawer of QLayout. The QItems are demonstrating how to also easily use VueRouter navigation with the `to` prop.

Also notice:

 - The first menu item in the list is the "active" menu item and it is using a special active indication. You could also leave the `to` prop empty, to get the standard active link.
 - The "Spam" menu item is deactivated by leaving out the `to` prop. This could be useful if, for instance, no Spam were to be available to look at.

<doc-example title="Simple Menu Example" file="QListItem/SimpleMenu" />

## API
<doc-api file="QList" />

<doc-api file="QItem" />

<doc-api file="QItemLabel" />

<doc-api file="QItemSection" />

#### Related Components
 - [QLayout](/vue-components/layout)
 - [QDrawer](/vue-components/drawer)
 - [QExpansionItem](/vue-components/expansion-item)
 - [QSlideItem](/vue-components/slide-item)
