<template>
  <div class="layout-padding">
    <q-editor
      ref="editor"
      v-model="model"
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['token', 'hr', 'link', 'custom_btn'],
        [
          {
            label: 'Formatting',
            icon: 'text_format',
            list: 'no-icons',
            options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
          },
          {
            label: 'Font Size',
            icon: 'format_size',
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
          },
          {
            label: 'Font',
            icon: 'font_download',
            fixedIcon: true,
            list: 'no-icons',
            options: ['font_arial', 'font_arial_black', 'font_courier_new', 'font_times_new_roman']
          },
          'removeFormat'
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
        [
          {
            label: 'Align',
            icon: 'format_align_left',
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          },
          {
            label: 'Align',
            icon: 'format_align_left',
            fixedLabel: true,
            options: ['left', 'center', 'right', 'justify']
          }
        ],
        ['print'],
        ['undo', 'redo'],
        [{
          label: 'Dropdown Test',
          highlight: true,
          options: ['gogu', 'outdent', 'indent', 'gigi']
        }]
      ]"
      :definitions="{
        gigi: {cmd: 'bold', icon: 'map', tip: 'Gigi bold'},
        bold: {icon: 'content_paste'},
        gogu: {tip: 'Custom', icon: 'account_balance', handler: vm => vm.runCmd('print')},
        font_arial: {cmd: 'fontName', param: 'Arial', icon: 'font_download', tip: 'Arial', htmlTip: '<font face=\'Arial\'>Arial</font>'},
        font_arial_black: {cmd: 'fontName', param: 'Arial Black', icon: 'font_download', tip: 'Arial Black', htmlTip: '<font face=\'Arial Black\'>Arial Black</font>'},
        font_courier_new: {cmd: 'fontName', param: 'Courier New', icon: 'font_download', tip: 'Courier New', htmlTip: '<font face=\'Courier New\'>Courier New</font>'},
        font_times_new_roman: {cmd: 'fontName', param: 'Times New Roman', icon: 'font_download', tip: 'Times New Roman', htmlTip: '<font face=\'Times New Roman\'>Times New Roman</font>'}
      }"
    >
      <q-btn compact small color="yellow" slot="custom_btn">Wow</q-btn>
      <q-btn-dropdown small compact no-caps ref="token" no-wrap slot="token" color="green" label="Token">
        <q-list link separator>
          <q-item tag="label" @click="add('email')">
            <q-item-side icon="mail" />
            <q-item-main label="Email" />
          </q-item>
          <q-item tag="label" @click="add('title')">
            <q-item-side icon="title" />
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
