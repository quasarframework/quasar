---
title: Video
desc: The QVideo Vue components makes embedding a video like Youtube easy. It also resizes to fit the container by default.
keys: QVideo
examples: QVideo
---

Using the QVideo component makes embedding a video like YouTube easy. It also resizes to fit the container by default.

::: tip
You may also want to check our own HTML 5 video player component: [QMediaPlayer](https://github.com/quasarframework/quasar-ui-qmediaplayer), which is far more advanced than QVideo (which essentially is an iframe pointing to embedded YouTube videos).
:::

<DocApi file="QVideo" />

## Usage

### Basic

<DocExample title="Basic" file="Basic" />

### With aspect ratio

<DocExample title="With aspect ratio" file="Ratio" />

### Markup equivalent

<DocExample title="HTML markup" file="HtmlMarkup" />

## Accessibility <q-badge label="v2.25+" />

The iframe's accessible name comes from the `title` prop — always provide it, otherwise screen readers announce an anonymous frame with no way to tell what it embeds. Captions and player keyboard support are the embedded player's responsibility, not QVideo's.
