---
title: Editor (WYSIWYG)
desc: The QEditor Vue component is a WYSIWYG editor that enables writing and pasting HTML.
---

The QEditor component is a WYSIWYG (“what you see is what you get”) editor component that enables the user to write and even paste HTML. It uses the so-called Design Mode and the cross-browser `contentEditable` interface. Here are some go-to reference pages from the MDN webdocs with more detailed information about the underlying technology:

- [Making content editable](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Editable_content)
- [Design Mode](https://developer.mozilla.org/en-US/docs/Web/API/Document/designMode)
- [execCommand() reference](https://developer.mozilla.org/en-US/docs/Web/API/document/execCommand)
- [contentEditable spec](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable)

## QEditor API
<doc-api file="QEditor" />

## Examples
<doc-example title="Default editor" file="QEditor/Basic" />

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

<doc-example title="Redefine bold command" file="QEditor/NewBold" />

The following is an example that adds custom definitions. In such cases, make sure you don’t overlap the default commands:

<doc-example title="Add new commands" file="QEditor/NewCommands" />

<doc-example title="Kitchen sink" file="QEditor/KitchenSink" />

<doc-example title="Custom style" file="QEditor/Custom" />

<doc-example title="Using toolbar slots" file="QEditor/ToolbarSlot" />

## Dropdowns

### Types of dropdowns

```html
<q-editor
  v-model="model"
  :toolbar="[
    [
      {
        label: 'Icons & Label',
        icon: 'filter_1',
        fixedLabel: true,
        fixedIcon: true,
        options: ['bold', 'italic', 'strike', 'underline']
      }
    ],
    [
      {
        label: 'Only label',
        icon: 'filter_2',
        fixedLabel: true,
        fixedIcon: true,
        list: 'no-icons',
        options: ['bold', 'italic', 'strike', 'underline']
      }
    ],
    [
      {
        label: 'Only icons',
        icon: 'filter_3',
        fixedLabel: true,
        fixedIcon: true,
        list: 'only-icons',
        options: ['bold', 'italic', 'strike', 'underline']
      }
    ]
  ]"
/>
```
### Dropdowns with exclusive options
User can pick only one option from each dropdown.

* First has icon and label changing based on current selection
* Second has fixed label but dynamic icon
* Third has fixed icon but dynamic label

```html
<q-editor
  v-model="model"
  :toolbar="[
    [
      {
        label: 'Dynamic label',
        icon: 'help_outline',
        options: ['left', 'center', 'right', 'justify']
      }
    ],
    [
      {
        label: 'Static label',
        fixedLabel: true,
        options: ['left', 'center', 'right', 'justify']
      }
    ],
    [
      {
        label: 'Some label',
        icon: 'account_balance',
        fixedIcon: true,
        options: ['left', 'center', 'right', 'justify']
      }
    ]
  ]"
/>
```

## Caveats

### Autocorrect & spellcheck
There may be occasions where you want to turn off the integrated autocorrect, autocomplete, autocapitalization and spelling correction "features" that many modern browsers offer. To do this, simply wrap the `<q-editor>` component in a `<form>` element, like this:

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

### Images
Pasting from the buffer and drag & dropping images into the editor is unfortunately different across browsers - and also highly dependent upon how the image got into the buffer in the first place. In fact, up until very recently, you could even resize images within the ContentEditable when using Firefox. If you want to allow image pasting / dropping, we highly recommend writing your own methods.

```html
<q-editor
  model="editor"
  @paste.native="evt => pasteCapture(evt)"
  @drop.native="evt => dropCapture(evt)"
 />
```

### Plaintext pasting
If the paste event content type is text and depending on the source of text, there may already be a great deal of markup that the contentEditable automatically parses. If you want to paste only "clean, markup-free" text, then you can use the approach in this example (which also turns off spelling correction as mentioned above):

<doc-example title="Paste Event Override" file="QEditor/Pasting" />

### Printing
If you don't set a font (or the user doesn't choose one), the print dialogue will default to the system font, which can vary depending on browser and underlying operating system. Make sure to take this into consideration.

### Internationalization
The tooltips content of QEditor are translated by the [Quasar Language Pack](/options/quasar-language-packs), so merely changing the language will also change the interface. If your desired language pack is missing - or you find an error, please consider providing the update as PR.
