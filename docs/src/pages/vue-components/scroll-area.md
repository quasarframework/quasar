---
title: Scroll Area
related:
  - /vue-components/list-and-list-items
  - /vue-components/expansion-item
---

The QScrollArea component offers a neat way of customizing the scrollbars by encapsulating your content. Think of it as a DOM element which has `overflow: auto`, but with your own custom styled scrollbar instead of browser's default one and a few nice features on top.

This is especially useful for desktop as scrollbars are hidden on a mobile device. When on a mobile device, QScrollArea simply wraps the content in a `<div>` configured for default browser scrolling.

## Installation

<doc-installation components="QScrollArea" />

## Usage

<doc-example title="Basic" file="QScrollArea/Basic" />

<doc-example title="Styled" file="QScrollArea/Styled" />

<doc-example title="Delay" file="QScrollArea/Delay" />

<doc-example title="Scroll Position" file="QScrollArea/ScrollPosition" />

## QScrollArea API

<doc-api file="QScrollArea" />
