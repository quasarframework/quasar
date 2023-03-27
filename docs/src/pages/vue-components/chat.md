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

<doc-api file="QChatMessage" />

## Usage

### The basics

::: tip
Using the property `sent` is intended for the sender of the chat message. The other side is for received messages.
:::

<doc-example title="Basic" file="Basic" />

<doc-example title="Name" file="Name" />

<doc-example title="Avatar" file="Avatar" />

<doc-example title="Stamp" file="Stamp" />

<doc-example title="Label" file="Label" />

### Customization

<doc-example title="Text and background color" file="Color" />

<doc-example title="Size" file="Size" />

### Slots

<doc-example title="Default slot" file="SlotDefault" />

<doc-example title="Avatar/Stamp/Name slots" file="SlotAvatarStampName" />

### Sanitization

::: warning
Always sanitize values if you do not trust the origin (if the value comes from user input).
:::

<doc-example title="Sanitized content" file="Sanitize" />
