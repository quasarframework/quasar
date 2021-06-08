---
title: Pagination
desc: The QPagination Vue component allows you to easily display a pagination control on a page.
keys: QPagination
---
The QPagination component is available for whenever a pagination system is required. It offers the user a simple UI for moving between items or pages.

There are two modes in which QPagination operates: with buttons only or with an inputbox. The latter allows the user to go to a specific page by clicking/tapping on the inputbox, typing the page number then hitting Enter key. If the new page number is within valid limits, the model will be changed accordingly.

## QPagination API

<doc-api file="QPagination" />

## Usage

### Standard

<doc-example title="Standard" file="QPagination/Standard" />

### Custom icons

<doc-example title="With icon replacement" file="QPagination/Icons" />

### With input

<doc-example title="With input" file="QPagination/Input" />

<doc-example title="With input color" file="QPagination/InputColor" />

### Max pages shown

<doc-example title="Maximum pages shown" file="QPagination/MaxPages" />

<doc-example title="Removing ellipses" file="QPagination/Ellipses" />

### Handling boundary

<doc-example title="With boundary numbers" file="QPagination/BoundaryNumbers" />

<doc-example title="With boundary links" file="QPagination/BoundaryLinks" />

<doc-example title="With direction links" file="QPagination/DirectionLinks" />

### Styles

The following are a few examples, but not an exhaustive list:

<doc-example title="Styles" file="QPagination/Styles" />
