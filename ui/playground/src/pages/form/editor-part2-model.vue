<template>
  <div class="q-layout-padding">
    <pre>{{ localStatusTextEditor }}</pre>
    <pre>{{ editor }}</pre>
    <div class="q-mb-md q-gutter-md">
      <q-btn color="primary" label="Reset" @click="reset" />
      <q-btn color="primary" label="Set model" @click="setModel" />
    </div>
    <q-editor v-model="localStatusTextEditor" @blur="onBlur" @focus="onFocus" />

    <q-editor
      class="q-mt-lg"
      v-model="editor"
      :toolbar="toolbar"
      min-height="3em"
      max-height="5em"
    />
    <q-editor
      class="q-mt-lg"
      v-model="editor"
      :toolbar="toolbar"
      min-height="3em"
      max-height="5em"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const editorDefault = 'The <b>bold</b> bacon!<br/>1<br/>2<br/>3<br/>4<br/>5'

const editor = ref(editorDefault)
const toolbar = ref([
  ['bold', 'italic', 'underline', 'link'],
  ['left', 'center', 'right'],
  ['p', 'h6', 'code']
])

const localStatusTextEditor = computed({
  get() {
    return removeTags(editor.value)
  },
  set(val) {
    editor.value = addTags(val)
  }
})

function reset() {
  editor.value = editorDefault
}

function setModel() {
  localStatusTextEditor.value =
    'Some <i>model</i>. Lorem ipsum <a href="https://google.com">dolor</a> lorem ipsum dolor.'
}

function removeTags(text) {
  return text.length > 25
    ? text.replaceAll('<b>', '').replaceAll('</b>', '')
    : text
}

function addTags(text) {
  return text
    .replaceAll('<b>', '')
    .replaceAll('</b>', '')
    .replaceAll('bacon', '<i>bacon</i>')
}

function onBlur() {
  console.log('onBlur')
}

function onFocus() {
  console.log('onFocus')
}
</script>
