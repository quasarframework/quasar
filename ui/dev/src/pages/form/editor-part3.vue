<template>
  <div class="q-layout-padding">
    Enter some text then for desktops, press Ctrl-Enter and for mobile click "Test" - if caret doesn't disappear it's good
    <q-editor
      ref="editor"
      v-model="editorValue"
      @keyup.enter="handleEditorEnter"
      @focus="logFocus('editor')"
      @blur="logBlur('editor')"
      @input="logInput('editor')"
      :definitions="{
        test: {
          tip: 'Enter some text, then click this button',
          icon: 'radio_button_checked',
          label: 'Test',
          handler: testCaret
        }
      }"
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['test']
      ]"
    ></q-editor>

  </div>
</template>

<script>
export default {
  data () {
    return {
      editorValue: ''
    }
  },
  methods: {
    handleEditorEnter (e) {
      if (e.ctrlKey) {
        console.log('OnEnter Editor value:', this.editorValue)
        this.editorValue = ''
      }
    },
    logFocus (c) {
      console.log(c, 'focus')
    },
    logBlur (c) {
      console.log(c, 'blur')
    },
    logInput (c) {
      console.log(c, 'input')
    },
    testCaret (e) {
      console.log('testCaret Editor value:', this.editorValue)
      this.editorValue = ''
    }
  }
}
</script>
