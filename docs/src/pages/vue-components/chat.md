---
title: Chat Message
desc: The QChatMessage Vue component displays a chat entry containing one or more user messages.
keys: QChatMessage
---

Quasar supplies a chat component called QChatMessage which is really a chat entry that renders the data given by the props.

::: tip
To mix messages with avatar and without avatar in the same thread, use a placeholder avatar image.
:::

## QChatMessage API

<doc-api file="QChatMessage" />

## Usage

### The basics

::: tip
Using the property `sent` is intended for the sender of the chat message. The other side is for received messages.
:::

<doc-example title="Basic" file="QChatMessage/Basic" />

<doc-example title="Name" file="QChatMessage/Name" />

<doc-example title="Avatar" file="QChatMessage/Avatar" />

<doc-example title="Stamp" file="QChatMessage/Stamp" />

<doc-example title="Label" file="QChatMessage/Label" />

### Customization

<doc-example title="Text and background color" file="QChatMessage/Color" />

<doc-example title="Size" file="QChatMessage/Size" />

### Slots

<doc-example title="Default slot" file="QChatMessage/SlotDefault" />

<doc-example title="Avatar/Stamp/Name slots" file="QChatMessage/SlotAvatarStampName" />

### Sanitization

::: warning
Always sanitize values if you do not trust the origin (if the value comes from user input).
:::

<doc-example title="Sanitized content" file="QChatMessage/Sanitize" />
