import { getEventKey, stopAndPrevent } from '../../utils/event.js'
import { getToolbar, getFonts, getLinkEditor } from './editor-utils.js'
import { Caret } from './editor-caret.js'
import extend from '../../utils/extend.js'
import FullscreenMixin from '../../mixins/fullscreen.js'
import { isSSR } from '../../plugins/platform.js'

export default {
  name: 'QEditor',
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
    definitions: Object,
    fonts: Object,
    toolbar: {
      type: Array,
      validator: v => v.length === 0 || v.every(group => group.length),
      default () {
        return [
          ['left', 'center', 'right', 'justify'],
          ['bold', 'italic', 'underline', 'strike'],
          ['undo', 'redo']
        ]
      }
    },
    toolbarColor: String,
    toolbarTextColor: String,
    toolbarToggleColor: {
      type: String,
      default: 'primary'
    },
    toolbarBg: {
      type: String,
      default: 'grey-3'
    },
    toolbarFlat: Boolean,
    toolbarOutline: Boolean,
    toolbarPush: Boolean,
    toolbarRounded: Boolean,
    contentStyle: Object,
    contentClass: [Object, Array, String]
  },
  computed: {
    editable () {
      return !this.readonly && !this.disable
    },
    hasToolbar () {
      return this.toolbar && this.toolbar.length > 0
    },
    toolbarBackgroundClass () {
      if (this.toolbarBg) {
        return `bg-${this.toolbarBg}`
      }
    },
    buttonProps () {
      return {
        outline: this.toolbarOutline,
        flat: this.toolbarFlat,
        push: this.toolbarPush,
        rounded: this.toolbarRounded,
        dense: true,
        color: this.toolbarColor,
        disable: !this.editable
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

        h1: {cmd: 'formatBlock', param: 'H1', icon: i.header, tip: e.header1, htmlTip: `<h1 class="q-ma-none">${e.header1}</h1>`},
        h2: {cmd: 'formatBlock', param: 'H2', icon: i.header, tip: e.header2, htmlTip: `<h2 class="q-ma-none">${e.header2}</h2>`},
        h3: {cmd: 'formatBlock', param: 'H3', icon: i.header, tip: e.header3, htmlTip: `<h3 class="q-ma-none">${e.header3}</h3>`},
        h4: {cmd: 'formatBlock', param: 'H4', icon: i.header, tip: e.header4, htmlTip: `<h4 class="q-ma-none">${e.header4}</h4>`},
        h5: {cmd: 'formatBlock', param: 'H5', icon: i.header, tip: e.header5, htmlTip: `<h5 class="q-ma-none">${e.header5}</h5>`},
        h6: {cmd: 'formatBlock', param: 'H6', icon: i.header, tip: e.header6, htmlTip: `<h6 class="q-ma-none">${e.header6}</h6>`},
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
      const userDef = this.definitions || {}
      const def = this.definitions || this.fonts
        ? extend(
          true,
          {},
          this.buttonDef,
          userDef,
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
            return obj.type === 'no-state' || (userDef[token] && (
              obj.cmd === void 0 || (this.buttonDef[obj.cmd] && this.buttonDef[obj.cmd].type === 'no-state')
            ))
              ? obj
              : extend(true, { type: 'toggle' }, obj)
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
    },
    innerStyle () {
      return this.inFullscreen
        ? this.contentStyle
        : [
          {
            minHeight: this.minHeight,
            height: this.height,
            maxHeight: this.maxHeight
          },
          this.contentStyle
        ]
    },
    innerClass () {
      return [
        this.contentClass,
        { col: this.inFullscreen, 'overflow-auto': this.inFullscreen || this.maxHeight }
      ]
    }
  },
  data () {
    return {
      editWatcher: true,
      editLinkUrl: null
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
        const val = this.$refs.content.innerHTML
        if (val !== this.value) {
          this.editWatcher = false
          this.$emit('input', val)
        }
      }
    },
    onKeydown (e) {
      const key = getEventKey(e)

      if (!e.ctrlKey) {
        this.refreshToolbar()
        this.$q.platform.is.ie && this.$nextTick(this.onInput)
        return
      }

      const target = this.keys[key]
      if (target !== void 0) {
        const { cmd, param } = target
        stopAndPrevent(e)
        this.runCmd(cmd, param, false)
        this.$q.platform.is.ie && this.$nextTick(this.onInput)
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
        this.editLinkUrl = null
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
    if (!isSSR) {
      document.execCommand('defaultParagraphSeparator', false, 'div')
      this.defaultFont = window.getComputedStyle(document.body).fontFamily
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.$refs.content) {
        this.caret = new Caret(this.$refs.content, this)
        this.$refs.content.innerHTML = this.value
      }
      this.$nextTick(this.refreshToolbar)
    })
  },
  render (h) {
    let toolbars
    if (this.hasToolbar) {
      const toolbarConfig = {
        staticClass: `q-editor-toolbar row no-wrap scroll-x`,
        'class': [
          { 'q-editor-toolbar-separator': !this.toolbarOutline && !this.toolbarPush },
          this.toolbarBackgroundClass
        ]
      }
      toolbars = []
      toolbars.push(h('div', extend({key: 'qedt_top'}, toolbarConfig), [
        h('div', { staticClass: 'row no-wrap q-editor-toolbar-padding fit items-center' }, getToolbar(h, this))
      ]))
      if (this.editLinkUrl !== null) {
        toolbars.push(h('div', extend({key: 'qedt_btm'}, toolbarConfig), [
          h('div', { staticClass: 'row no-wrap q-editor-toolbar-padding fit items-center' }, getLinkEditor(h, this))
        ]))
      }
      toolbars = h('div', toolbars)
    }

    return h(
      'div',
      {
        staticClass: 'q-editor',
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
        toolbars,
        h(
          'div',
          {
            ref: 'content',
            staticClass: `q-editor-content`,
            style: this.innerStyle,
            class: this.innerClass,
            attrs: { contenteditable: this.editable },
            domProps: isSSR
              ? { innerHTML: this.value }
              : undefined,
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
