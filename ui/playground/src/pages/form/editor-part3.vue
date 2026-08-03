<template>
  <div class="q-layout-padding">
    Enter some text then for desktops, press Ctrl-Enter and for mobile click
    "Test" - if caret doesn't disappear it's good
    <q-editor
      ref="editor"
      v-model="editorValue"
      @keyup.enter="handleEditorEnter"
      @focus="logFocus('editor')"
      @blur="logBlur('editor')"
      @update:model-value="logInput('editor')"
      :definitions="{
        test: {
          tip: 'Enter some text, then click this button',
          icon: 'radio_button_checked',
          label: 'Test',
          handler: testCaret
        }
      }"
      :toolbar="[['bold', 'italic', 'strike', 'underline'], ['test']]"
    ></q-editor>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const editorValue = ref('')

function handleEditorEnter(e) {
  if (e.ctrlKey) {
    console.log('OnEnter Editor value:', editorValue.value)
    editorValue.value = ''
  }
}
function logFocus(c) {
  console.log(c, 'focus')
}
function logBlur(c) {
  console.log(c, 'blur')
}
function logInput(c) {
  console.log(c, 'input')
}
function testCaret(e) {
  console.log('testCaret Editor value:', editorValue.value)
  editorValue.value = ''
}
</script>
