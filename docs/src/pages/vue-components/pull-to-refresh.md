---
title: QPullToRefresh
---

When you want to allow the user to refresh the content or retrieve the newest content.

## Installation
<doc-installation components="QPullToRefresh" />

::: tip
In your `@refresh` function, don't forget to call the passed in `done()` function when you have finsihed loading more data.
:::

::: warning
Do not wrap `<q-pull-to-refresh>` by a `<div class="layout-padding">`. If you must, place that `<div>` as direct child of `<q-pull-to-refresh>`.
:::

## Usage
::: tip
To refresh, pull down on the content below.
:::

<doc-example title="Basic" file="QPullToRefresh/Basic" />

<doc-example title="Color" file="QPullToRefresh/Color" />

<doc-example title="Icon" file="QPullToRefresh/Icon" />

## API
<doc-api file="QPullToRefresh" />
