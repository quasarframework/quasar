import { getEventKey } from '../../utils/event'
import { getToolbar } from './editor-utils'
import { buttons } from './editor-definitions'
import { Caret } from './editor-caret'

document.execCommand('defaultParagraphSeparator', false, 'div')

export default {
  name: 'q-editor',
  provide () {
    return {
      __editor: this
    }
  },
  props: {
    value: {
      type: String,
      required: true
    },
    readonly: Boolean,
    disable: Boolean,
    toggleColor: String,
    definitions: {
      type: Object,
      default: () => ({})
    },
    toolbar: {
      type: Array,
      validator: v => {
        const names = Object.keys(buttons)
        return v.length > 0 && v.every(group => {
          return group.length > 0 && group.every(btn => {
            if (Array.isArray(btn)) {
              return btn.every(item => names.includes(item))
            }
            return names.includes(btn)
          })
        })
      },
      default () {
        return [
          ['left', 'center', 'right', 'justify'],
          ['bold', 'italic', 'underline', 'strike'],
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
      const getBtn = name => this.definitions[name] || buttons[name]
      return this.toolbar.map(
        group => group.map(name => Array.isArray(name) ? name.map(item => getBtn(item)) : getBtn(name))
      )
    },
    keys () {
      const
        k = {},
        add = btn => {
          if (btn.key) {
            k[btn.key] = {
              cmd: btn.cmd,
              param: btn.param
            }
          }
        }

      this.buttons.forEach(group => {
        group.forEach(btn => {
          if (Array.isArray(btn)) {
            btn.forEach(add)
          }
          else {
            add(btn)
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
      this.refreshToolbar()

      if (!e.ctrlKey || [17, 65, 67, 86].includes(key)) {
        return
      }

      e.preventDefault()
      e.stopPropagation()

      const { cmd, param } = this.keys[key]
      if (this.keys[key] !== void 0) {
        this.runCmd(cmd, param, false)
      }
    },
    runCmd (cmd, param, update = true) {
      console.log('applying', cmd, param)
      this.caret.apply(cmd, param, () => {
        this.$refs.content.focus()

        if (update) {
          this.refreshToolbar()
        }
      })
    },
    refreshToolbar () {
      setTimeout(() => {
        this.$forceUpdate()
      }, 1)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.caret = new Caret(this.$refs.content)
      this.$refs.content.innerHTML = this.value
      this.$nextTick(this.refreshToolbar)
    })
  },
  render (h) {
    const attr = this.attrib
    return h(
      'div',
      { staticClass: 'q-editor' },
      [
        h(
          'div',
          { staticClass: 'q-editor-toolbar overflow-auto row no-wrap' },
          getToolbar(h, this)
        ),
        h(
          'div',
          {
            ref: 'content',
            staticClass: 'q-editor-content',
            attrs: { contenteditable: this.editable },
            on: {
              input: this.onInput,
              keydown: this.onKeydown,
              click: this.refreshToolbar,
              blur: () => {
                this.caret.save()
              }
            }
          }
        ),
        h('div', {style: {
          wordWrap: 'break-word'
        }}, [JSON.stringify(attr)])
      ]
    )
  }
}
