import { getEventKey } from '../../utils/event'
import { getToolbar, getFonts } from './editor-utils'
import { buttons } from './editor-definitions'
import { Caret } from './editor-caret'
import extend from '../../utils/extend'
import FullscreenMixin from '../../utils/mixin-fullscreen'

export default {
  name: 'q-editor',
  mixins: [FullscreenMixin],
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
    maxHeight: String,
    height: String,
    color: String,
    toggleColor: {
      type: String,
      default: 'primary'
    },
    toolbarColor: {
      type: String,
      default: 'grey-4'
    },
    contentColor: {
      type: String,
      default: 'white'
    },
    flat: Boolean,
    outline: Boolean,
    push: Boolean,
    definitions: Object,
    fonts: Object,
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
        push: this.push,
        small: true,
        compact: true
      }
    },
    buttons () {
      let def = this.definitions || this.fonts
        ? extend(true, {}, buttons, this.definitions || {}, getFonts(this.defaultFont, this.fonts))
        : buttons

      return this.toolbar.map(
        group => group.map(token => {
          if (token.options) {
            return {
              type: 'dropdown',
              icon: token.icon,
              label: token.label,
              fixedLabel: token.fixedLabel,
              fixedIcon: token.fixedIcon,
              highlight: token.highlight,
              list: token.list,
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

      if (!e.ctrlKey) {
        return
      }

      const target = this.keys[key]
      if (target !== void 0) {
        const { cmd, param } = target
        e.preventDefault()
        e.stopPropagation()
        this.runCmd(cmd, param, false)
      }
    },
    runCmd (cmd, param, update = true) {
      this.focus()
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
    },
    getContentEl () {
      return this.$refs.content
    }
  },
  created () {
    document.execCommand('defaultParagraphSeparator', false, 'div')
    this.defaultFont = window.getComputedStyle(document.body).fontFamily
  },
  mounted () {
    this.$nextTick(() => {
      this.caret = new Caret(this.$refs.content, this)
      this.$refs.content.innerHTML = this.value
      this.$nextTick(this.refreshToolbar)
    })
  },
  render (h) {
    return h(
      'div',
      { staticClass: 'q-editor' },
      [
        h(
          'div',
          {
            staticClass: 'q-editor-inner',
            style: {
              height: this.inFullscreen ? '100vh' : null
            },
            'class': {
              disabled: this.disable,
              fullscreen: this.inFullscreen,
              column: this.inFullscreen,
              'z-max': this.inFullscreen
            }
          },
          [
            this.readonly ? '' : h(
              'div',
              {
                staticClass: `q-editor-toolbar q-editor-toolbar-padding overflow-auto row no-wrap bg-${this.toolbarColor}`,
                'class': {
                  'q-editor-toolbar-separator': !this.outline && !this.push
                }
              },
              getToolbar(h, this)
            ),
            h(
              'div',
              {
                ref: 'content',
                staticClass: `q-editor-content bg-${this.contentColor}`,
                style: this.inFullscreen
                  ? {}
                  : { minHeight: this.minHeight, height: this.height, maxHeight: this.maxHeight },
                class: {
                  col: this.inFullscreen,
                  'overflow-auto': this.inFullscreen
                },
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
      ]
    )
  }
}
