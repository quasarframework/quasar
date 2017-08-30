<template>
  <div class="q-editor">
    <div class="q-editor-toolbar overflow-auto row no-wrap">
      <div
        v-for="group in buttons"
        class="q-editor-toolbar-group row no-wrap"
      >
        <q-btn
          v-for="btn in group"
          :key="btn.action"
          @click="applyAction(btn.action, btn.param)"
          class="no-shadow"
          :icon="btn.icon"
        >
          <q-tooltip v-if="btn.tip" :delay="1000">
            {{ btn.tip }}
            <div v-if="btn.key">
              <small>(CTRL + {{ String.fromCharCode(btn.key) }})</small>
            </div>
          </q-tooltip>
        </q-btn>
      </div>
    </div>

    <div
      ref="content"
      class="q-editor-content"
      :contenteditable="editable"
      @input="onInput"
      @keydown="onKeydown"
    ></div>
  </div>
</template>

<script>
import { QBtn } from '../btn'
import { QTooltip } from '../tooltip'
import { getEventKey } from '../../utils/event'

const buttons = {
  bold: {action: 'bold', icon: 'format_bold', tip: 'Bold', key: 66},
  italic: {action: 'italic', icon: 'format_italic', tip: 'Italic', key: 73},
  strike: {action: 'strikeThrough', icon: 'strikethrough_s', tip: 'Strikethrough', key: 83},
  underline: {action: 'underline', icon: 'format_underlined', tip: 'Underline', key: 85},
  link: {action: 'link', icon: 'link', tip: 'Link', key: 76},

  left: {action: 'justifyLeft', icon: 'format_align_left', tip: 'Align to left'},
  center: {action: 'justifyCenter', icon: 'format_align_center', tip: 'Align to center'},
  right: {action: 'justifyRight', icon: 'format_align_right', tip: 'Align to right'},
  justify: {action: 'justifyFull', icon: 'format_align_justify', tip: 'Justify'},

  highlight: {action: 'hiliteColor', param: '#D4FF00', icon: 'format_color_text', tip: 'Highlight'}, // no IE
  font_arial: {action: 'fontname', param: 'Arial', icon: 'font_download', tip: 'Arial'},
  font_arial_black: {action: 'fontname', param: 'Arial Black', icon: 'font_download', tip: 'Arial Black'},
  font_courier_new: {action: 'fontname', param: 'Courier New', icon: 'font_download', tip: 'Courier New'},
  font_times_new_roman: {action: 'fontname', param: 'Times New Roman', icon: 'font_download', tip: 'Times New Roman'},

  hr: {action: 'insertHTML', param: '<hr />', icon: 'remove', tip: 'Horizontal line'},
  removeFormat: {action: 'removeFormat', icon: 'format_clear', tip: 'Remove formatting'},
  h1: {action: 'formatBlock', param: 'H1', icon: 'format_size', tip: 'Heading H1'},
  div: {action: 'formatBlock', param: 'DIV', icon: 'format_size', tip: 'DIV'},

  // heading: {action: 'heading', icon: 'format_size', tip: 'Heading', key: 72},
  // quote: {action: 'quote', icon: 'format_quote', tip: 'Quote', key: 81},
  // bullet: {action: 'bullet', icon: 'format_list_bulleted', tip: 'Bullet style list'},
  // number: {action: 'number', icon: 'format_list_numbered', tip: 'Numbered style list'},
  // outdent: {action: 'outdent', icon: 'format_indent_decrease', tip: 'Decrease indentation', key: 37}, // arrow left
  // indent: {action: 'indent', icon: 'format_indent_increase', tip: 'Increase indentation', key: 39},
  undo: {action: 'undo', icon: 'undo', tip: 'Undo', key: 90},
  redo: {action: 'redo', icon: 'redo', tip: 'Redo', key: 89}
}

export default {
  name: 'q-editor',
  components: {
    QBtn,
    QTooltip
  },
  props: {
    value: {
      type: String,
      required: true
    },
    readonly: Boolean,
    disable: Boolean,
    toolbar: {
      type: Array,
      validator: v => {
        const names = Object.keys(buttons)
        return v.length > 0 && v.every(group => {
          return group.length > 0 && group.every(btn => names.includes(btn))
        })
      },
      default () {
        return [
          ['h1', 'div', 'hr', 'removeFormat', 'highlight'],
          ['font_arial', 'font_arial_black', 'font_courier_new', 'font_times_new_roman'],
          ['left', 'center', 'right', 'justify'],
          ['bold', 'italic', 'underline', 'strike', 'link'],
          ['undo', 'redo']
        ]
      }
    }
  },
  computed: {
    editable () {
      return !this.readonly && !this.disable
    },
    buttons () {
      return this.toolbar.map(group => {
        return group.map(name => buttons[name])
      })
    },
    keys () {
      const k = {}
      this.buttons.forEach(group => {
        group.forEach(btn => {
          k[btn.key] = {
            action: btn.action,
            param: btn.param
          }
        })
      })
      return k
    }
  },
  data () {
    return {
      editWatcher: true
    }
  },
  watch: {
    value (v) {
      if (this.editWatcher) {
        this.$refs.content.innerHTML = v
      }
      else {
        this.editWatcher = true
      }
    }
  },
  methods: {
    onInput (e) {
      if (this.editWatcher) {
        this.editWatcher = false
        this.$emit('input', this.$refs.content.innerHTML)
      }
    },
    onKeydown (e) {
      const key = getEventKey(e)

      if (e.ctrlKey) {
        if (key === 65) { // CTRL + a
          return
        }

        e.preventDefault()
        e.stopPropagation()

        const { action, param } = this.keys[key]
        if (action !== void 0) {
          this.applyAction(action, param)
        }
      }
    },
    applyAction (action, param) {
      console.log('applying', action, param)
      document.execCommand(action, false, param)
      this.$refs.content.focus()
    }
  },
  mounted () {
    this.$refs.content.innerHTML = this.value
  }
}
</script>
