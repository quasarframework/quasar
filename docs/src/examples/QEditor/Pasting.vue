<template>
  <div class="q-pa-md q-gutter-sm">
    <form
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false"
    >
      <q-editor
        ref="editorRef"
        @paste="evt => pasteCapture(evt)"
        v-model="editor"
      />
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const editorRef = ref(null)

    return {
      editorRef,
      editor: ref(
        'Try pasting some rich text here,' +
        ' such as from Discord or Webstorm.' +
        '<br/>You can\'t paste images either!!!'
      ),

      /**
       * Capture the <CTL-V> paste event, only allow plain-text, no images.
       *
       * see: https://stackoverflow.com/a/28213320
       *
       * @param {object} evt - array of files
       * @author Daniel Thompson-Yvetot
       * @license MIT
       */
      pasteCapture (evt) {
        // Let inputs do their thing, so we don't break pasting of links.
        if (evt.target.nodeName === 'INPUT') return
        let text, onPasteStripFormattingIEPaste
        evt.preventDefault()
        if (evt.originalEvent && evt.originalEvent.clipboardData.getData) {
          text = evt.originalEvent.clipboardData.getData('text/plain')
          editorRef.value.runCmd('insertText', text)
        }
        else if (evt.clipboardData && evt.clipboardData.getData) {
          text = evt.clipboardData.getData('text/plain')
          editorRef.value.runCmd('insertText', text)
        }
        else if (window.clipboardData && window.clipboardData.getData) {
          if (!onPasteStripFormattingIEPaste) {
            onPasteStripFormattingIEPaste = true
            editorRef.value.runCmd('ms-pasteTextOnly', text)
          }
          onPasteStripFormattingIEPaste = false
        }
      }
    }
  }
}
</script>
