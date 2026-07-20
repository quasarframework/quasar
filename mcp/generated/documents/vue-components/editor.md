---
title: Editor (WYSIWYG)
description: The QEditor Vue component is a WYSIWYG editor that enables writing and pasting HTML.
canonical: https://quasar.dev/vue-components/editor
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QEditor](../../api/QEditor.md)

The QEditor component is a WYSIWYG (“what you see is what you get”) editor component that enables the user to write and even paste HTML. It uses the so-called Design Mode and the cross-browser `contentEditable` interface. Here are some go-to reference pages from the MDN webdocs with more detailed information about the underlying technology:

- [Making content editable](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Editable_content)
- [Design Mode](https://developer.mozilla.org/en-US/docs/Web/API/Document/designMode)
- [execCommand() reference](https://developer.mozilla.org/en-US/docs/Web/API/document/execCommand)
- [contentEditable spec](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable)

**API reference:** [QEditor](../../api/QEditor.md)

## Examples

**Example: Default editor**

Source: [Basic.vue](../../examples/QEditor/Basic.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor v-model="editor" min-height="5rem" />

    <q-card flat bordered>
      <q-card-section>
        <pre style="white-space: pre-line">{{ editor }}</pre>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section v-html="editor" />
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const editor = ref('What you see is <b>what</b> you get.')
</script>
````

::: warning
In this first example, there are two cards below the editor. The first shows the unparsed html using the double-moustache, whereas the second shows the rendered version using `v-html="editor"`. Using v-html this way renders your users vulnerable to Cross Site Scripting attacks. If the content is user generated, be sure to sanitize it either on render or server side (or both).
:::

By default, QEditor offers most if not all the commands you’d need in a WYSIWYG editor: bold, italic, strike, underline, unordered (list), ordered (list), subscript, superscript, link, fullscreen, quote, left (align), center (align), right (align), justify (align), print, outdent, indent, removeFormat, hr, undo, redo, h1 to h6, p (paragraph), code (code paragraph), size-1 to size-7.

Each of these commands is pre-configured with icons and their own internationalized tooltips. However, if you want to override some of their settings you can do so with the help of definitions Object property.

```html
:definitions="{ bold: {label: 'Bold', icon: null, tip: 'My bold tooltip'} }"
```

**Example: Redefine bold command**

Source: [NewBold.vue](../../examples/QEditor/NewBold.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor
      v-model="editor"
      :definitions="{
        bold: { label: 'Bold', icon: null, tip: 'My bold tooltip' }
      }"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const editor = ref(
  'Here we are overriding the <b>bold</b> command to include a label instead of an icon and also changing its tooltip.'
)
</script>
````

The following is an example that adds custom definitions. In such cases, make sure you don’t overlap the default commands:

**Example: Add new commands**

Source: [NewCommands.vue](../../examples/QEditor/NewCommands.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor
      v-model="editor"
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
        ['upload', 'save']
      ]"
    />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const $q = useQuasar()
const editor = ref(
  'After you define a new button,' +
    ' you have to make sure to put it in the toolbar too!'
)

function saveWork() {
  $q.notify({
    message: 'Saved your text to local storage',
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done'
  })
}

function uploadIt() {
  $q.notify({
    message: 'Server unavailable. Check connectivity.',
    color: 'red-5',
    textColor: 'white',
    icon: 'warning'
  })
}
</script>
````

**Example: Kitchen sink**

Source: [KitchenSink.vue](../../examples/QEditor/KitchenSink.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor
      v-model="qeditor"
      :dense="$q.screen.lt.md"
      :toolbar="[
        [
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          },
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            options: ['left', 'center', 'right', 'justify']
          }
        ],
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['token', 'hr', 'link', 'custom_btn'],
        ['print', 'fullscreen'],
        [
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
          },
          {
            label: $q.lang.editor.fontSize,
            icon: $q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'size-1',
              'size-2',
              'size-3',
              'size-4',
              'size-5',
              'size-6',
              'size-7'
            ]
          },
          {
            label: $q.lang.editor.defaultFont,
            icon: $q.iconSet.editor.font,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'default_font',
              'arial',
              'arial_black',
              'comic_sans',
              'courier_new',
              'impact',
              'lucida_grande',
              'times_new_roman',
              'verdana'
            ]
          },
          'removeFormat'
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

        ['undo', 'redo'],
        ['viewsource']
      ]"
      :fonts="{
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana'
      }"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const qeditor = ref(
  '<pre>Check out the two different types of dropdowns' +
    ' in each of the "Align" buttons.</pre> '
)
</script>
````

**Example: Custom style**

Source: [Custom.vue](../../examples/QEditor/Custom.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor
      v-model="editor"
      flat
      content-class="bg-amber-3"
      toolbar-text-color="white"
      toolbar-toggle-color="yellow-8"
      toolbar-bg="primary"
      :toolbar="[
        ['bold', 'italic', 'underline'],
        [
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: ['p', 'h3', 'h4', 'h5', 'h6', 'code']
          }
        ]
      ]"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const editor = ref('Customize it.')
</script>
````

**Example: Using toolbar slots**

Source: [ToolbarSlot.vue](../../examples/QEditor/ToolbarSlot.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor
      v-model="editor"
      ref="editorRef"
      toolbar-text-color="white"
      toolbar-toggle-color="yellow-8"
      toolbar-bg="primary"
      :toolbar="[
        ['token'],
        ['bold', 'italic', 'underline'],
        [
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: ['p', 'h3', 'h4', 'h5', 'h6', 'code']
          }
        ]
      ]"
    >
      <template v-slot:token>
        <q-btn-dropdown
          dense
          no-caps
          ref="tokenRef"
          no-wrap
          unelevated
          color="white"
          text-color="primary"
          label="Token"
          size="sm"
        >
          <q-list dense>
            <q-item tag="label" clickable @click="add('email')">
              <q-item-section side>
                <q-icon name="mail" />
              </q-item-section>
              <q-item-section>Email</q-item-section>
            </q-item>
            <q-item tag="label" clickable @click="add('title')">
              <q-item-section side>
                <q-icon name="title" />
              </q-item-section>
              <q-item-section>Title</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </template>
    </q-editor>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'

const editorRef = useTemplateRef('editorRef')
const tokenRef = useTemplateRef('tokenRef')
const editor = ref('Customize it.')

function add(name) {
  const edit = editorRef.value
  tokenRef.value.hide()
  edit.caret.restore()
  edit.runCmd(
    'insertHTML',
    `&nbsp;<div class="editor_token row inline items-center" contenteditable="false">&nbsp;<span>${name}</span>&nbsp;<i class="q-icon material-icons cursor-pointer" onclick="this.parentNode.parentNode.removeChild(this.parentNode)">close</i></div>&nbsp;`
  )
  edit.focus()
}
</script>

<style lang="sass">
.editor_token
  background: rgba(0, 0, 0, .6)
  color: white
  padding: 3px
  &, .q-icon
    border-radius: 3px
  .q-icon
    background: rgba(0, 0, 0, .2)
</style>
````

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

**Example: Paste Event Override**

Source: [Pasting.vue](../../examples/QEditor/Pasting.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <form
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false"
    >
      <q-editor ref="editorRef" @paste="onPaste" v-model="editor" />
    </form>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'

const editorRef = useTemplateRef('editorRef')
const editor = ref(
  'Try pasting some rich text here,' +
    ' such as from Discord or Webstorm.' +
    "<br>You can't paste images either!!!"
)

/**
 * Capture the <CTL-V> paste event, only allow plain-text, no images.
 * See: https://stackoverflow.com/a/28213320
 */
function onPaste(evt) {
  // Let inputs do their thing, so we don't break pasting of links.
  if (evt.target.nodeName === 'INPUT') return
  let text, onPasteStripFormattingIEPaste
  evt.preventDefault()
  evt.stopPropagation()
  if (evt.originalEvent && evt.originalEvent.clipboardData.getData) {
    text = evt.originalEvent.clipboardData.getData('text/plain')
    editorRef.value.runCmd('insertText', text)
  } else if (evt.clipboardData && evt.clipboardData.getData) {
    text = evt.clipboardData.getData('text/plain')
    editorRef.value.runCmd('insertText', text)
  } else if (window.clipboardData && window.clipboardData.getData) {
    if (!onPasteStripFormattingIEPaste) {
      onPasteStripFormattingIEPaste = true
      editorRef.value.runCmd('ms-pasteTextOnly', text)
    }
    onPasteStripFormattingIEPaste = false
  }
}
</script>
````

### Printing

If you don't set a font (or the user doesn't choose one), the print dialogue will default to the system font, which can vary depending on browser and underlying operating system. Make sure to take this into consideration.

### Internationalization

The tooltips content of QEditor are translated by the [Quasar Language Pack](/options/quasar-language-packs), so merely changing the language will also change the interface. If your desired language pack is missing - or you find an error, please consider providing the update as PR.
