import { getEventKey } from '../../utils/event'
import { getToolbar } from './editor-utils'
import { buttons } from './editor-definitions'
import { Caret } from './editor-caret'

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
      const getBtn = name => {
        const
          btn = this.definitions[name] || buttons[name],
          state = this.attrib[btn.test || btn.cmd]

        if (state === void 0 && (btn.type === 'toggle' || btn.disable)) {
          this.attrib[btn.test || btn.cmd] = false
        }
        return btn
      }

      return this.toolbar.map(
        group => group.map(name => {
          if (Array.isArray(name)) {
            return name.map(item => getBtn(item))
          }
          return getBtn(name)
        })
      )
    },
    keys () {
      const k = {}
      this.buttons.forEach(group => {
        group.forEach(btn => {
          if (Array.isArray(btn)) {
            btn.forEach(item => {
              if (item.key) {
                k[item.key] = {
                  cmd: btn.cmd,
                  param: btn.param
                }
              }
            })
          }
          else if (btn.key) {
            k[btn.key] = {
              cmd: btn.cmd,
              param: btn.param
            }
          }
        })
      })
      return k
    }
  },
  data () {
    return {
      editWatcher: true,
      attrib: {}
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
      this.updateAttributes()

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
      this.caret.apply(cmd, param)
      this.$refs.content.focus()

      if (update) {
        this.updateAttributes()
      }
    },
    updateAttributes () {
      setTimeout(() => {
        let change = false
        Object.keys(this.attrib).forEach(cmd => {
          const state = this.caret.is(cmd)
          if (this.attrib[cmd] !== state) {
            this.attrib[cmd] = state
            change = true
          }
        })
        if (change) {
          console.log('forceUpdate')
          this.$forceUpdate()
        }
      }, 1)
    }
  },
  mounted () {
    this.$refs.content.innerHTML = this.value
    this.caret = new Caret(this.$refs.content)
    document.execCommand('defaultParagraphSeparator', false, 'div')
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
              click: this.updateAttributes,
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
