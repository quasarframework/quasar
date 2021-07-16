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
        [{
          label: $q.lang.editor.formatting,
          icon: $q.iconSet.editor.formatting,
          list: 'no-icons',
          options: ['p', 'h3', 'h4', 'h5', 'h6', 'code']
        }]
      ]"
    >
      <template v-slot:token>
        <q-btn-dropdown
          dense no-caps
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

<script>
import { ref } from 'vue'

export default {
  setup () {
    const editorRef = ref(null)
    const tokenRef = ref(null)

    return {
      editorRef,
      tokenRef,
      editor: ref('Customize it.'),

      add (name) {
        const edit = editorRef.value
        tokenRef.value.hide()
        edit.caret.restore()
        edit.runCmd('insertHTML', `&nbsp;<div class="editor_token row inline items-center" contenteditable="false">&nbsp;<span>${name}</span>&nbsp;<i class="q-icon material-icons cursor-pointer" onclick="this.parentNode.parentNode.removeChild(this.parentNode)">close</i></div>&nbsp;`)
        edit.focus()
      }
    }
  }
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
