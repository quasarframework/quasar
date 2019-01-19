---
title: Editor (WYSIWYG)
---
    
**QEditor** is a WYSIWYG (“what you see is what you get”) editor component that enables the user to write and even paste HTML. It uses the so-called Design Mode and the cross-browser `contentEditable` interface. Here are some go-to reference pages from the MDN webdocs with more detailed information about this underlying technology:

- [Making content editable](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Editable_content)
- [Design Mode](https://developer.mozilla.org/en-US/docs/Web/API/Document/designMode)
- [execCommand() reference](https://developer.mozilla.org/en-US/docs/Web/API/document/execCommand)
- [contentEditable spec](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable)

## Installation
<doc-installation components="QEditor" />

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
  ['upload', 'save'],
]"
<!--
  Notice the handlers. It references methods in your Vue scope
  for when toolbar commands using these definitions are clicked/tapped.
-->
```
<doc-example title="Add new commands" file="QEditor/NewCommands" />

## Complex Example
<doc-example title="Kitchen Sink" file="QEditor/KitchenSink" />

## Caveats

#### Images
Pasting from the buffer and drag & dropping images into the editor is unfortunately different across browsers - and also highly dependent upon how the image got into the buffer in the first place. In fact, up until very recently, you could even resize images within the ContentEditable when using Firefox. If you want to allow image pasting / dropping, we highly recommend writing your own methods.

```html
<q-editor
  model="editor"
  @paste.native="evt => pasteCapture(evt)"
  @drop.native="evt => dropCapture(evt)"
 />
```

#### Plaintext pasting
If the paste event content type is text and depending on the source of text, there may already be a great deal of markup that the contentEditable automatically parses. If you want to paste only "clean, markup-free" text, then you can use the approach in this example:

#### Autocorrect & Spellcheck
There may be occassions where you want to turn off the integrated autocorrect, autocomplete and autocapitalization "features" that many modern browsers offer. To do this, simply wrap the `<q-editor>` component in a `<form>` element, like this:

```html
<form 
  autocorrect="off"
  autocapitalize="off"
  autocomplete="off"
  spellcheck="false"   
>
  <q-editor model="editor" />
</form>
```

<doc-example title="Paste Event Override" file="QEditor/Pasting" />


#### Printing
If you don't set a font (or the user doesn't choose one), the print dialogue will default to the system font, which can vary depending on browser and os. 

#### Internationalization
The tooltips content of QEditor are part of [Quasar i18n](/options/quasar-language-packs). If your desired language pack is missing - or you find an error, please consider providing the update as PR.

## API
<doc-api file="QEditor" />
