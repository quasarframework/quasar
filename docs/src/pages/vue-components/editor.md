---
title: Editor (WYSIWYG)
desc: The QEditor Vue component is a WYSIWYG editor that enables writing and pasting HTML.
keys: QEditor
examples: QEditor
---

The QEditor component is a WYSIWYG (“what you see is what you get”) editor component that enables the user to write and even paste HTML. It uses the so-called Design Mode and the cross-browser `contentEditable` interface. Here are some go-to reference pages from the MDN webdocs with more detailed information about the underlying technology:

- [Making content editable](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Editable_content)
- [Design Mode](https://developer.mozilla.org/en-US/docs/Web/API/Document/designMode)
- [execCommand() reference](https://developer.mozilla.org/en-US/docs/Web/API/document/execCommand)
- [contentEditable spec](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable)

<DocApi file="QEditor" />

## Examples

<DocExample title="Default editor" file="Basic" />

::: warning
In this first example, there are two cards below the editor. The first shows the unparsed html using the double-moustache, whereas the second shows the rendered version using `v-html="editor"`. Using v-html this way renders your users vulnerable to Cross Site Scripting attacks. If the content is user generated, be sure to sanitize it either on render or server side (or both).
:::

By default, QEditor offers most if not all the commands you’d need in a WYSIWYG editor: bold, italic, strike, underline, unordered (list), ordered (list), subscript, superscript, link, fullscreen, quote, left (align), center (align), right (align), justify (align), print, outdent, indent, removeFormat, hr, undo, redo, h1 to h6, p (paragraph), code (code paragraph), size-1 to size-7.

Each of these commands is pre-configured with icons and their own internationalized tooltips. However, if you want to override some of their settings you can do so with the help of definitions Object property.

```html
:definitions="{ bold: {label: 'Bold', icon: null, tip: 'My bold tooltip'} }"
```

<DocExample title="Redefine bold command" file="NewBold" />

The following is an example that adds custom definitions. In such cases, make sure you don’t overlap the default commands:

<DocExample title="Add new commands" file="NewCommands" />

<DocExample title="Kitchen sink" file="KitchenSink" />

<DocExample title="Custom style" file="Custom" />

<DocExample title="Using toolbar slots" file="ToolbarSlot" />

## Adding links

The `link` command swaps the toolbar for a URL field pointing at the current selection (or, when nothing is selected, at the word under the caret). The field starts out holding the selected text if that text already reads as an URL, and `https://` otherwise.

Your content is only touched once you commit an URL — by pressing <kbd>Enter</kbd>, by hitting the "Update" button, or simply by clicking away from the field. Leaving `https://` untouched commits nothing, so abandoning the field never leaves a broken link behind. <kbd>Escape</kbd> cancels outright, while the "Remove" button strips the link from the selection.

The command behaves the same wherever you put it, including inside one of the [dropdowns](#dropdowns) described below.

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

- First has icon and label changing based on current selection
- Second has fixed label but dynamic icon
- Third has fixed icon but dynamic label

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

## Accessibility <q-badge label="v2.25+" />

### Keyboard navigation

Following the [WAI-ARIA toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/), the toolbar is a single Tab stop: pressing <kbd>Tab</kbd> moves focus into the toolbar (onto the last used button, or the first enabled one) and a second press moves it on to the editing area, rather than walking through every button. Within the toolbar, <kbd>Arrow Left</kbd> and <kbd>Arrow Right</kbd> move focus between the buttons (wrapping at either end and following the text direction in RTL), while <kbd>Home</kbd> and <kbd>End</kbd> jump to the first or last one. Content rendered through custom toolbar slots keeps its own Tab stops.

The commands wired to the current toolbar also respond to their <kbd>CTRL</kbd> key combinations (shown in the button tooltips) while editing — <kbd>CTRL + B</kbd> for bold, for example.

You can prevent QEditor from running one of these commands by preventing its `keydown` event; for example, `@keydown.ctrl.b.prevent` leaves <kbd>CTRL + B</kbd> to your own handler instead of toggling bold.

### Labeling

The editing area is exposed as a multiline `textbox` and the toolbar carries a localized `aria-label` from the [Quasar Language Pack](/options/quasar-language-packs). It also mirrors its own props onto that role: a `placeholder` becomes `aria-placeholder`, while `readonly` and `disable` surface as `aria-readonly` and `aria-disabled`. Toggle commands (bold, italic, the alignment buttons and friends) report their state through `aria-pressed` rather than through their color alone, and the hyperlink editor's URL field is labeled from the same language pack. Attributes passed to QEditor itself (such as `aria-label`, `aria-labelledby` or `aria-describedby`) are applied to the editing area, so you can — and should — give it an accessible name:

```html
<q-editor v-model="model" aria-label="Post body" />
```

### Help dialog

Some WYSIWYG editors offer a dialog listing the available keyboard commands. QEditor does not ship one built in, but a custom toolbar slot gets you there:

<DocExample title="Help dialog" file="HelpDialog" />

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
  <q-editor v-model="editor" />
</form>
```

### Images

Pasting from the buffer and drag & dropping images into the editor is unfortunately different across browsers - and also highly dependent upon how the image got into the buffer in the first place. In fact, up until very recently, you could even resize images within the ContentEditable when using Firefox. If you want to allow image pasting / dropping, we highly recommend writing your own methods.

```html
<q-editor
  v-model="editor"
  @paste="evt => pasteCapture(evt)"
  @drop="evt => dropCapture(evt)"
/>
```

### Plaintext pasting

If the paste event content type is text and depending on the source of text, there may already be a great deal of markup that the contentEditable automatically parses. If you want to paste only "clean, markup-free" text, then you can use the approach in this example (which also turns off spelling correction as mentioned above):

<DocExample title="Paste Event Override" file="Pasting" />

### Printing

If you don't set a font (or the user doesn't choose one), the print dialogue will default to the system font, which can vary depending on browser and underlying operating system. Make sure to take this into consideration.

### Internationalization

The tooltips content of QEditor are translated by the [Quasar Language Pack](/options/quasar-language-packs), so merely changing the language will also change the interface. If your desired language pack is missing - or you find an error, please consider providing the update as PR.
