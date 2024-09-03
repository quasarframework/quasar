---
title: Dropdown Button
desc: The QBtnDropdown Vue component is used to display dropdown content on a button.
keys: QBtnDropdown
examples: QBtnDropdown
related:
  - /vue-components/button
  - /vue-components/button-group
---
QBtnDropdown is a very convenient dropdown button. Goes very well with [QList](/vue-components/list-and-list-items) as dropdown content, but it's by no means limited to it.

In case you are looking for a dropdown "input" instead of "button" use [Select](/vue-components/select) instead.

<DocApi file="QBtnDropdown" />

## Usage

<DocExample title="Basic" file="Basic" />

<DocExample title="Various content" file="VariousContent" />

<DocExample title="Split" file="Split" />

<DocExample title="Custom button" file="CustomButton" />

<DocExample title="Custom dropdown icon" file="CustomDropdownIcon" />

<DocExample title="Label slot" file="LabelSlot" />

<DocExample title="Using v-model" file="Model" />

<DocExample title="Disable" file="Disable" />

The following example won't work with UMD version (so in Codepen/jsFiddle too) because it relies on the existence of Vue Router.

<DocExample title="Split and router link on main" file="Link" no-edit />
