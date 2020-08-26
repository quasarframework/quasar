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
  </div>
</template>

<script>
/* eslint-disable */

export default {
  data () {
    return {
      editor: 'The <b>bold</b> bacon!'
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
      this.editor = 'The <b>bold</b> bacon!'
    },

    setModel () {
      this.localStatusTextEditor = 'Some <i>model</i>. Lorem ipsum dolor lorem ipsum dolor.'
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
