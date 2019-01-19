---
title: Editor (WYSIWYG)
---
    
**QEditor** is a WYSIWYG (“what you see is what you get”) editor component that enables the user to write and even paste HTML.

## Installation
<doc-installation components="QEditor" />

## Internationalization
The tooltips content of QEditor are part of [Quasar i18n](/options-and-helpers/app-internationalization). If your desired language pack is missing - or you find an error, please consider providing the update as PR.

## Basic Examples
<doc-example title="Default Editor" file="QEditor/Basic" />

::: warning
In this first example, there are two cards below the editor. The first shows the unparsed html using the double-moustache, whereas the second shows the rendered version using `v-html="editor"`. Using v-html this way renders your users vulnerable to Cross Site Scripting attacks. If the content is user generated, be sure to sanitize it either on render or server side (or both).

::: 

By default, QEditor offers most if not all the commands you’d need in a WYSIWYG editor: bold, italic, strike, underline, unordered (list), ordered (list), subscript, superscript, link, fullscreen, quote, left (align), center (align), right (align), justify (align), print, outdent, indent, removeFormat, hr, undo, redo, h1 to h6, p (paragraph), code (code paragraph), size-1 to size-7.

Each of these commands is pre-configured with icons and their own internationalized tooltips. However, if you want to override some of their settings you can do so with the help of definitions Object property.

```html
:definitions="{
  bold: {label: 'Bold', icon: null, tip: 'My bold tooltip'}
}"
```
<doc-example title="Redefine Bold Command" file="QEditor/NewBold" />


The following is an example that adds your own definitions. In this case make sure you don’t overlap the default commands:

```html
<!-- we can later use "save" and "upload" in "toolbar" prop -->
:definitions="{
  save: {
    tip: 'Save your work',
    icon: 'save',
    label: 'Save',
    handler: saveWork
  },
  upload: {
    tip: 'Upload to cloud',
    icon: 'cloud_upload',
    label: 'Upload',
    handler: uploadIt
  }
}"
:toolbar="[
  ['bold', 'italic', 'strike', 'underline'],
  ['token', 'hr', 'link'],
  ['upload', 'save'],
]"
<!--
  Notice the handlers. It references methods in your Vue scope
  for when toolbar commands using these definitions are clicked/tapped.
-->
```
<doc-example title="Add new commands" file="QEditor/NewCommands" />

## Complex Example
<doc-example title="Kitchen Sink" file="QEditor/Complex" />

## API
<doc-api file="QEditor" />
