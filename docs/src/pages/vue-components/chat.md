---
title: Chat Message
desc: The QChatMessage Vue component displays a chat entry containing one or more user messages.
keys: QChatMessage
examples: QChatMessage
---

Quasar supplies a chat component called QChatMessage which is really a chat entry that renders the data given by the props.

::: tip
To mix messages with avatar and without avatar in the same thread, use a placeholder avatar image.
:::

<DocApi file="QChatMessage" />

## Usage

### The basics

::: tip
Using the property `sent` is intended for the sender of the chat message. The other side is for received messages.
:::

<DocExample title="Basic" file="Basic" />

<DocExample title="Name" file="Name" />

<DocExample title="Avatar" file="Avatar" />

<DocExample title="Stamp" file="Stamp" />

<DocExample title="Label" file="Label" />

### Customization

<DocExample title="Text and background color" file="Color" />

<DocExample title="Size" file="Size" />

### Slots

<DocExample title="Default slot" file="SlotDefault" />

<DocExample title="Avatar/Stamp/Name slots" file="SlotAvatarStampName" />

### Sanitization

::: warning
Always sanitize values if you do not trust the origin (if the value comes from user input).
:::

<DocExample title="Sanitized content" file="Sanitize" />
