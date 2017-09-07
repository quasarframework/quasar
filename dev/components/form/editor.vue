<template>
  <div class="layout-padding">
    <q-editor
      ref="editor"
      v-model="model"
      push glossy
      :toolbar="[
        ['bold', 'italic', 'h1', 'p', 'link', 'gigi'],
        ['gogu', 'print', 'custom_btn'],
        ['token'],
        ['bullet'],
        [{
          label: 'Font Size',
          options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
        }],
        [{
          label: 'Formatting',
          options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
        }],
        [{
          label: 'Dropdown Test',
          options: ['gogu', 'outdent', 'indent', 'gigi']
        }],
        ['undo', 'redo']
      ]"
      :definitions="{
        gigi: {cmd: 'bold', icon: 'map', tip: 'Gigi bold'},
        bold: {icon: 'content_paste'},
        gogu: {tip: 'Custom', icon: 'account_balance', handler: vm => vm.runCmd('print')}
      }"
    >
      <q-btn push glossy color="yellow" slot="custom_btn">Wow</q-btn>
      <q-btn-dropdown push glossy ref="token" no-wrap slot="token" color="green" label="Inject token">
        <q-list link>
          <q-item tag="label" @click="add('email')">
            <q-item-main label="Email" />
          </q-item>
          <q-item tag="label" @click="add('title')">
            <q-item-main label="Title" />
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-editor>

    <p class="caption bg-yellow">Model</p>
    <span>{{ model }}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: ''
    }
  },
  methods: {
    add (name) {
      const edit = this.$refs.editor
      this.$refs.token.close()
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
