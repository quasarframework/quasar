<template>
  <div class="q-pa-md q-gutter-sm">
    <div class="q-gutter-md q-mb-md">
      <q-toggle v-model="readonly" label="Readonly" />
      <q-toggle v-model="disable" label="Disable" />
    </div>

    <q-editor
      v-model="qeditor"
      :dense="$q.screen.lt.md"
      :readonly="readonly"
      :disable="disable"
      @dropdown-before-show="dropdownBeforeShow"
      @dropdown-before-hide="dropdownBeforeHide"
      @dropdown-hide="dropdownHide"
      @dropdown-show="dropdownShow"
      @link-show="linkShow"
      @link-hide="linkHide"
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

const readonly = ref(false)
const disable = ref(false)

const qeditor = ref(
  '<pre>Check out the two different types of dropdowns' +
    ' in each of the "Align" buttons.</pre> '
)

function dropdownBeforeShow(evt) {
  console.log('dropdownBeforeShow', evt)
}

function dropdownBeforeHide(evt) {
  console.log('dropdownBeforeHide', evt)
}

function dropdownShow(evt) {
  console.log('dropdownShow', evt)
}

function dropdownHide(evt) {
  console.log('dropdownHide', evt)
}

function linkShow() {
  console.log('linkShow')
}

function linkHide() {
  console.log('linkHide')
}
</script>
