---
title: Dropdown Button
desc: The QBtnDropdown Vue component is used to display dropdown content on a button.
keys: QBtnDropdown
related:
  - /vue-components/button
  - /vue-components/button-group
---
QBtnDropdown is a very convenient dropdown button. Goes very well with [QList](/vue-components/list-and-list-items) as dropdown content, but it's by no means limited to it.

In case you are looking for a dropdown "input" instead of "button" use [Select](/vue-components/select) instead.

## QBtnDropdown API

<doc-api file="QBtnDropdown" />

## Usage

<doc-example title="Basic" file="QBtnDropdown/Basic" />

<doc-example title="Various content" file="QBtnDropdown/VariousContent" />

<doc-example title="Split" file="QBtnDropdown/Split" />

<doc-example title="Custom button" file="QBtnDropdown/CustomButton" />

<doc-example title="Custom dropdown icon" file="QBtnDropdown/CustomDropdownIcon" />

<doc-example title="Label slot" file="QBtnDropdown/LabelSlot" />

<doc-example title="Using v-model" file="QBtnDropdown/Model" />

<doc-example title="Disable" file="QBtnDropdown/Disable" />

The following example won't work with UMD version (so in Codepen/jsFiddle too) because it relies on the existence of Vue Router.

<doc-example title="Split and router link on main" file="QBtnDropdown/Link" no-edit />
