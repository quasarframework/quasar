<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor
      v-model="editor"
      ref="editor"
      toolbar-text-color="white"
      toolbar-toggle-color="yellow-8"
      toolbar-flat
      toolbar-bg="primary"
      :toolbar="[
        ['token'],
        ['bold', 'italic', 'underline'],
        [{
          label: $q.lang.editor.formatting,
          icon: $q.icon.editor.formatting,
          list: 'no-icons',
          options: ['p', 'h3', 'h4', 'h5', 'h6', 'code']
        }]
      ]"
    >
      <q-btn-dropdown
        dense no-caps
        ref="token"
        no-wrap
        slot="token"
        color="white"
        text-color="primary"
        label="Token"
        size="sm"
      >
        <q-list>
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
    </q-editor>
  </div>
</template>
<script>
export default {
  data () {
    return {
      editor: 'Customize it.'
    }
  },
  methods: {
    add (name) {
      const edit = this.$refs.editor
      this.$refs.token.hide()
      edit.caret.restore()
      edit.runCmd('insertHTML', `&nbsp;<div class="editor_token row inline items-center" contenteditable="false">&nbsp;<span>${name}</span>&nbsp;<i class="q-icon material-icons cursor-pointer" onclick="this.parentNode.parentNode.removeChild(this.parentNode)">close</i></div>&nbsp;`)
      edit.focus()
    }
  }
}
</script>
<style lang="stylus">
  .editor_token
    background rgba(0, 0, 0, .6)
    color white
    padding 3px
    &, .q-icon
      border-radius 3px
    .q-icon
      background rgba(0, 0, 0, .2)
</style>
