---
title: Card
desc: The QCard Vue component is a great way to display important pieces of grouped content. It assists the viewer by containing and organizing information, while also setting up predictable expectations.
keys: QCard
related:
  - /vue-components/separator
---

The QCard component is a great way to display important pieces of grouped content. This pattern is quickly emerging as a core design pattern for Apps, website previews and email content. It assists the viewer by containing and organizing information, while also setting up predictable expectations.

With so much content to display at once, and often so little screen real-estate, Cards have fast become the design pattern of choice for many companies, including the likes of Google and Twitter.

The QCard component is intentionally lightweight and essentially a containing element that is capable of "hosting" any other component that is appropriate.

## QCard API
<doc-api file="QCard" />

## QCardSection API
<doc-api file="QCardSection" />

## QCardActions API
<doc-api file="QCardActions" />

## Usage

::: tip
You can play with the typography within your cards to create beautiful cards.
:::

### Basic
<doc-example title="Basic cards" file="QCard/Basic" />

### With actions
<doc-example title="Cards with actions" file="QCard/Actions" />

Below are some of the custom alignments that you can use for the actions through the `align` property:

<doc-example title="Aligning actions" file="QCard/ActionsAlignment" />

### Media content
<doc-example title="Cards with media content" file="QCard/Media" />

<doc-example title="Card with video" file="QCard/Video" />

<doc-example title="Card with parallax" file="QCard/Parallax" />

### Horizontal

On the examples below, notice the QCardSection with `horizontal` prop on it that wraps other QCardSections. Also note that you can directly use `col-*` classes on children of horizontal QCardSection in order to control the size.

It's recommended that you use QImg component instead of native `<img>` when dealing with horizontal QCardSections.

<doc-example title="Basic horizontal" file="QCard/HorizontalBasic" />

<doc-example title="More involved examples" file="QCard/HorizontalMoreInvolved" />

### Various content
<doc-example title="Various content" file="QCard/VariousContent" />

<doc-example title="Table" file="QCard/Table" />

<doc-example title="Tabs" file="QCard/Tabs" />

### Expandable

On the example below, click on the round button on the bottom right to see the expansion in action.

<doc-example title="Expandable" file="QCard/Expandable" />
