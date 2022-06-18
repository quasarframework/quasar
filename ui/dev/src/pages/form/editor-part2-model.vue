<template>
  <div class="q-layout-padding">
    <pre>{{ localStatusTextEditor }}</pre>
    <pre>{{ editor }}</pre>
    <div class="q-mb-md q-gutter-md">
      <q-btn color="primary" label="Reset" @click="reset" />
      <q-btn color="primary" label="Set model" @click="setModel" />
    </div>
    <q-editor
      v-model="localStatusTextEditor"
      @blur="onBlur"
      @focus="onFocus"
    />

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

<script>
/* eslint-disable */
const editorDefault = 'The <b>bold</b> bacon!<br/>1<br/>2<br/>3<br/>4<br/>5'

export default {
  data () {
    return {
      editor: editorDefault,
      toolbar: [
        ['bold', 'italic', 'underline', 'link'],
        ['left', 'center', 'right'],
        ['p', 'h6', 'code']
      ]
    }
  },

  computed: {
    localStatusTextEditor: {
      get () {
        return this.removeTags(this.editor)
      },
      set (val) {
        this.editor = this.addTags(val)
      }
    }
  },

  methods: {
    reset () {
      this.editor = editorDefault
    },

    setModel () {
      this.localStatusTextEditor = 'Some <i>model</i>. Lorem ipsum <a href="https://google.com">dolor</a> lorem ipsum dolor.'
    },

    removeTags (text) {
      return text.length > 25
        ? text.replace(new RegExp('<b>', 'g'), '').replace(new RegExp('</b>', 'g'), '')
        : text
    },

    addTags (text) {
      return text
        .replace(new RegExp('<b>', 'g'), '')
        .replace(new RegExp('</b>', 'g'), '')
        .replace(new RegExp('bacon', 'g'), '<i>bacon</i>')
    },

    onBlur () {
      console.log('onBlur')
    },

    onFocus () {
      console.log('onFocus')
    }
  }
}
</script>
