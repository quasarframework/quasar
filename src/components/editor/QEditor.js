import { getEventKey } from '../../utils/event'
import { getToolbar, getFonts } from './editor-utils'
import { Caret } from './editor-caret'
import extend from '../../utils/extend'
import FullscreenMixin from '../../mixins/fullscreen'

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
        size: 'sm',
        compact: true
      }
    },
    buttonDef () {
      const
        e = this.$q.i18n.editor,
        i = this.$q.icon.editor

      return {
        bold: {cmd: 'bold', icon: i.bold, tip: e.bold, key: 66},
        italic: {cmd: 'italic', icon: i.italic, tip: e.italic, key: 73},
        strike: {cmd: 'strikeThrough', icon: i.strikethrough, tip: e.strikethrough, key: 83},
        underline: {cmd: 'underline', icon: i.underline, tip: e.underline, key: 85},
        unordered: {cmd: 'insertUnorderedList', icon: i.unorderedList, tip: e.unorderedList},
        ordered: {cmd: 'insertOrderedList', icon: i.orderedList, tip: e.orderedList},
        subscript: {cmd: 'subscript', icon: i.subscript, tip: e.subscript, htmlTip: 'x<subscript>2</subscript>'},
        superscript: {cmd: 'superscript', icon: i.superscript, tip: e.superscript, htmlTip: 'x<superscript>2</superscript>'},
        link: {cmd: 'link', icon: i.hyperlink, tip: e.hyperlink, key: 76},
        fullscreen: {cmd: 'fullscreen', icon: i.toggleFullscreen, tip: e.toggleFullscreen, key: 70},

        quote: {cmd: 'formatBlock', param: 'BLOCKQUOTE', icon: i.quote, tip: e.quote, key: 81},
        left: {cmd: 'justifyLeft', icon: i.left, tip: e.left},
        center: {cmd: 'justifyCenter', icon: i.center, tip: e.center},
        right: {cmd: 'justifyRight', icon: i.right, tip: e.right},
        justify: {cmd: 'justifyFull', icon: i.justify, tip: e.justify},

        print: {type: 'no-state', cmd: 'print', icon: i.print, tip: e.print, key: 80},
        outdent: {type: 'no-state', disable: vm => vm.caret && !vm.caret.can('outdent'), cmd: 'outdent', icon: i.outdent, tip: e.outdent},
        indent: {type: 'no-state', disable: vm => vm.caret && !vm.caret.can('indent'), cmd: 'indent', icon: i.indent, tip: e.indent},
        removeFormat: {type: 'no-state', cmd: 'removeFormat', icon: i.removeFormat, tip: e.removeFormat},
        hr: {type: 'no-state', cmd: 'insertHorizontalRule', icon: i.hr, tip: e.hr},
        undo: {type: 'no-state', cmd: 'undo', icon: i.undo, tip: e.undo, key: 90},
        redo: {type: 'no-state', cmd: 'redo', icon: i.redo, tip: e.redo, key: 89},

        h1: {cmd: 'formatBlock', param: 'H1', icon: i.header, tip: e.header1, htmlTip: `<h1>${e.header1}</h1>`},
        h2: {cmd: 'formatBlock', param: 'H2', icon: i.header, tip: e.header2, htmlTip: `<h2>${e.header2}</h2>`},
        h3: {cmd: 'formatBlock', param: 'H3', icon: i.header, tip: e.header3, htmlTip: `<h3>${e.header3}</h3>`},
        h4: {cmd: 'formatBlock', param: 'H4', icon: i.header, tip: e.header4, htmlTip: `<h4>${e.header4}</h4>`},
        h5: {cmd: 'formatBlock', param: 'H5', icon: i.header, tip: e.header5, htmlTip: `<h5>${e.header5}</h5>`},
        h6: {cmd: 'formatBlock', param: 'H6', icon: i.header, tip: e.header6, htmlTip: `<h6>${e.header6}</h6>`},
        p: {cmd: 'formatBlock', param: 'DIV', icon: i.header, tip: e.paragraph},
        code: {cmd: 'formatBlock', param: 'PRE', icon: i.code, tip: `<code>${e.code}</code>`},

        'size-1': {cmd: 'fontSize', param: '1', icon: i.size, tip: e.size1, htmlTip: `<font size="1">${e.size1}</font>`},
        'size-2': {cmd: 'fontSize', param: '2', icon: i.size, tip: e.size2, htmlTip: `<font size="2">${e.size2}</font>`},
        'size-3': {cmd: 'fontSize', param: '3', icon: i.size, tip: e.size3, htmlTip: `<font size="3">${e.size3}</font>`},
        'size-4': {cmd: 'fontSize', param: '4', icon: i.size, tip: e.size4, htmlTip: `<font size="4">${e.size4}</font>`},
        'size-5': {cmd: 'fontSize', param: '5', icon: i.size, tip: e.size5, htmlTip: `<font size="5">${e.size5}</font>`},
        'size-6': {cmd: 'fontSize', param: '6', icon: i.size, tip: e.size6, htmlTip: `<font size="6">${e.size6}</font>`},
        'size-7': {cmd: 'fontSize', param: '7', icon: i.size, tip: e.size7, htmlTip: `<font size="7">${e.size7}</font>`}
      }
    },
    buttons () {
      let def = this.definitions || this.fonts
        ? extend(
          true,
          {},
          this.buttonDef,
          this.definitions || {},
          getFonts(
            this.defaultFont,
            this.$q.i18n.editor.defaultFont,
            this.$q.icon.editor.font,
            this.fonts
          )
        )
        : this.buttonDef

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
              column: this.inFullscreen
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
