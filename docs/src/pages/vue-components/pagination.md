---
title: Pagination
desc: The QPagination Vue component allows you to easily display a pagination control on a page.
keys: QPagination
examples: QPagination
---

The QPagination component is available for whenever a pagination system is required. It offers the user a simple UI for moving between items or pages.

There are two modes in which QPagination operates: with buttons only or with an inputbox. The latter allows the user to go to a specific page by clicking/tapping on the inputbox, typing the page number then hitting Enter key. If the new page number is within valid limits, the model will be changed accordingly.

<doc-api file="QPagination" />

## Usage

### Design

<doc-example title="Standard" file="Standard" />

The following are a few examples, but not an exhaustive list:

<doc-example title="Button design (v2.10+)" file="BtnDesign" />

<doc-example title="Gutter (v2.10+)" file="BtnGutter" />

### Custom icons

<doc-example title="With icon replacement" file="Icons" />

### With input

<doc-example title="With input" file="Input" />

<doc-example title="With input color" file="InputColor" />

### Max pages shown

<doc-example title="Maximum pages shown" file="MaxPages" />

<doc-example title="Removing ellipses" file="Ellipses" />

### Handling boundary

<doc-example title="With boundary numbers" file="BoundaryNumbers" />

<doc-example title="With boundary links" file="BoundaryLinks" />

<doc-example title="With direction links" file="DirectionLinks" />
