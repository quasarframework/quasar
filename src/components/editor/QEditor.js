import { getEventKey } from '../../utils/event'
import { getToolbar } from './editor-utils'
import { buttons } from './editor-definitions'
import { Caret } from './editor-caret'
import extend from '../../utils/extend'

export default {
  name: 'q-editor',
  props: {
    value: {
      type: String,
      required: true
    },
    readonly: Boolean,
    disable: Boolean,
    minHeight: {
      type: String,
      default: '10rem'
    },
    color: String,
    toggleColor: {
      type: String,
      default: 'primary'
    },
    outline: Boolean,
    flat: Boolean,
    rounded: Boolean,
    push: Boolean,
    glossy: Boolean,
    small: Boolean,
    big: Boolean,
    definitions: Object,
    toolbar: {
      type: Array,
      validator: v => v.length > 0 && v.every(group => group.length),
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
    buttonProps () {
      return {
        outline: this.outline,
        flat: this.flat,
        rounded: this.rounded,
        push: this.push,
        glossy: this.glossy,
        small: this.small,
        big: this.big
      }
    },
    buttons () {
      let def = this.definitions
        ? extend(true, {}, buttons, this.definitions)
        : buttons

      return this.toolbar.map(
        group => group.map(token => {
          if (token.options) {
            return {
              type: 'dropdown',
              label: token.label,
              options: token.options.map(item => def[item])
            }
          }

          const obj = def[token]

          if (obj) {
            return token.handler
              ? extend(true, { type: 'no-state' }, obj)
              : obj
          }
          else {
            return {
              type: 'slot',
              slot: token
            }
          }
        })
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
        group.forEach(token => {
          if (token.options) {
            token.options.forEach(add)
          }
          else {
            add(token)
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

      const { cmd, param } = this.keys[key]
      if (this.keys[key] !== void 0) {
        e.preventDefault()
        e.stopPropagation()
        this.runCmd(cmd, param, false)
      }
    },
    runCmd (cmd, param, update = true) {
      this.caret.apply(cmd, param, () => {
        this.focus()
        if (update) {
          this.refreshToolbar()
        }
      })
    },
    refreshToolbar () {
      setTimeout(() => {
        this.$forceUpdate()
      }, 1)
    },
    focus () {
      this.$refs.content.focus()
    }
  },
  created () {
    document.execCommand('defaultParagraphSeparator', false, 'div')
  },
  mounted () {
    this.$nextTick(() => {
      this.caret = new Caret(this.$refs.content)
      this.$refs.content.innerHTML = this.value
      this.$nextTick(this.refreshToolbar)
    })
  },
  render (h) {
    return h(
      'div',
      {
        staticClass: 'q-editor',
        'class': {
          disabled: this.disable
        }
      },
      [
        this.readonly ? '' : h(
          'div',
          { staticClass: 'q-editor-toolbar overflow-auto row no-wrap' },
          getToolbar(h, this)
        ),
        h(
          'div',
          {
            ref: 'content',
            staticClass: 'q-editor-content',
            style: { minHeight: this.minHeight },
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
        )
      ]
    )
  }
}
