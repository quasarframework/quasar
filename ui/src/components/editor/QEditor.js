import Vue from 'vue'

import { getToolbar, getFonts, getLinkEditor } from './editor-utils.js'
import { Caret } from './editor-caret.js'

import FullscreenMixin from '../../mixins/fullscreen.js'
import DarkMixin from '../../mixins/dark.js'

import { isSSR } from '../../plugins/Platform.js'
import { stopAndPrevent } from '../../utils/event.js'
import extend from '../../utils/extend.js'
import { shouldIgnoreKey } from '../../utils/key-composition.js'

export default Vue.extend({
  name: 'QEditor',

  mixins: [ FullscreenMixin, DarkMixin ],

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
    toolbarBg: String,
    toolbarTextColor: String,
    toolbarToggleColor: {
      type: String,
      default: 'primary'
    },
    toolbarOutline: Boolean,
    toolbarPush: Boolean,
    toolbarRounded: Boolean,

    contentStyle: Object,
    contentClass: [Object, Array, String],

    square: Boolean,
    flat: Boolean,
    dense: Boolean
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
      const flat = this.toolbarOutline !== true &&
        this.toolbarPush !== true

      return {
        type: 'a',
        flat,
        noWrap: true,
        outline: this.toolbarOutline,
        push: this.toolbarPush,
        rounded: this.toolbarRounded,
        dense: true,
        color: this.toolbarColor,
        disable: !this.editable,
        size: 'sm'
      }
    },

    buttonDef () {
      const
        e = this.$q.lang.editor,
        i = this.$q.iconSet.editor

      return {
        bold: { cmd: 'bold', icon: i.bold, tip: e.bold, key: 66 },
        italic: { cmd: 'italic', icon: i.italic, tip: e.italic, key: 73 },
        strike: { cmd: 'strikeThrough', icon: i.strikethrough, tip: e.strikethrough, key: 83 },
        underline: { cmd: 'underline', icon: i.underline, tip: e.underline, key: 85 },
        unordered: { cmd: 'insertUnorderedList', icon: i.unorderedList, tip: e.unorderedList },
        ordered: { cmd: 'insertOrderedList', icon: i.orderedList, tip: e.orderedList },
        subscript: { cmd: 'subscript', icon: i.subscript, tip: e.subscript, htmlTip: 'x<subscript>2</subscript>' },
        superscript: { cmd: 'superscript', icon: i.superscript, tip: e.superscript, htmlTip: 'x<superscript>2</superscript>' },
        link: { cmd: 'link', disable: vm => vm.caret && !vm.caret.can('link'), icon: i.hyperlink, tip: e.hyperlink, key: 76 },
        fullscreen: { cmd: 'fullscreen', icon: i.toggleFullscreen, tip: e.toggleFullscreen, key: 70 },
        viewsource: { cmd: 'viewsource', icon: i.viewSource, tip: e.viewSource },

        quote: { cmd: 'formatBlock', param: 'BLOCKQUOTE', icon: i.quote, tip: e.quote, key: 81 },
        left: { cmd: 'justifyLeft', icon: i.left, tip: e.left },
        center: { cmd: 'justifyCenter', icon: i.center, tip: e.center },
        right: { cmd: 'justifyRight', icon: i.right, tip: e.right },
        justify: { cmd: 'justifyFull', icon: i.justify, tip: e.justify },

        print: { type: 'no-state', cmd: 'print', icon: i.print, tip: e.print, key: 80 },
        outdent: { type: 'no-state', disable: vm => vm.caret && !vm.caret.can('outdent'), cmd: 'outdent', icon: i.outdent, tip: e.outdent },
        indent: { type: 'no-state', disable: vm => vm.caret && !vm.caret.can('indent'), cmd: 'indent', icon: i.indent, tip: e.indent },
        removeFormat: { type: 'no-state', cmd: 'removeFormat', icon: i.removeFormat, tip: e.removeFormat },
        hr: { type: 'no-state', cmd: 'insertHorizontalRule', icon: i.hr, tip: e.hr },
        undo: { type: 'no-state', cmd: 'undo', icon: i.undo, tip: e.undo, key: 90 },
        redo: { type: 'no-state', cmd: 'redo', icon: i.redo, tip: e.redo, key: 89 },

        h1: { cmd: 'formatBlock', param: 'H1', icon: i.heading1 || i.heading, tip: e.heading1, htmlTip: `<h1 class="q-ma-none">${e.heading1}</h1>` },
        h2: { cmd: 'formatBlock', param: 'H2', icon: i.heading2 || i.heading, tip: e.heading2, htmlTip: `<h2 class="q-ma-none">${e.heading2}</h2>` },
        h3: { cmd: 'formatBlock', param: 'H3', icon: i.heading3 || i.heading, tip: e.heading3, htmlTip: `<h3 class="q-ma-none">${e.heading3}</h3>` },
        h4: { cmd: 'formatBlock', param: 'H4', icon: i.heading4 || i.heading, tip: e.heading4, htmlTip: `<h4 class="q-ma-none">${e.heading4}</h4>` },
        h5: { cmd: 'formatBlock', param: 'H5', icon: i.heading5 || i.heading, tip: e.heading5, htmlTip: `<h5 class="q-ma-none">${e.heading5}</h5>` },
        h6: { cmd: 'formatBlock', param: 'H6', icon: i.heading6 || i.heading, tip: e.heading6, htmlTip: `<h6 class="q-ma-none">${e.heading6}</h6>` },
        p: { cmd: 'formatBlock', param: 'DIV', icon: i.heading, tip: e.paragraph },
        code: { cmd: 'formatBlock', param: 'PRE', icon: i.code, htmlTip: `<code>${e.code}</code>` },

        'size-1': { cmd: 'fontSize', param: '1', icon: i.size1 || i.size, tip: e.size1, htmlTip: `<font size="1">${e.size1}</font>` },
        'size-2': { cmd: 'fontSize', param: '2', icon: i.size2 || i.size, tip: e.size2, htmlTip: `<font size="2">${e.size2}</font>` },
        'size-3': { cmd: 'fontSize', param: '3', icon: i.size3 || i.size, tip: e.size3, htmlTip: `<font size="3">${e.size3}</font>` },
        'size-4': { cmd: 'fontSize', param: '4', icon: i.size4 || i.size, tip: e.size4, htmlTip: `<font size="4">${e.size4}</font>` },
        'size-5': { cmd: 'fontSize', param: '5', icon: i.size5 || i.size, tip: e.size5, htmlTip: `<font size="5">${e.size5}</font>` },
        'size-6': { cmd: 'fontSize', param: '6', icon: i.size6 || i.size, tip: e.size6, htmlTip: `<font size="6">${e.size6}</font>` },
        'size-7': { cmd: 'fontSize', param: '7', icon: i.size7 || i.size, tip: e.size7, htmlTip: `<font size="7">${e.size7}</font>` }
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
            this.$q.lang.editor.defaultFont,
            this.$q.iconSet.editor.font,
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
              size: 'sm',
              dense: true,
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
              : Object.assign({ type: 'toggle' }, obj)
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
      editLinkUrl: null,
      isViewingSource: false
    }
  },

  watch: {
    value (v) {
      if (this.editWatcher === true) {
        this.__setContent(v)
      }
      else {
        this.editWatcher = true
      }
    }
  },

  methods: {
    __onInput () {
      if (this.editWatcher === true) {
        const val = this.isViewingSource
          ? this.$refs.content.innerText
          : this.$refs.content.innerHTML

        if (val !== this.value) {
          this.editWatcher = false
          this.$emit('input', val)
        }
      }
    },

    __onKeydown (e) {
      this.$emit('keydown', e)

      if (e.ctrlKey !== true || shouldIgnoreKey(e) === true) {
        this.refreshToolbar()
        this.$q.platform.is.ie && this.$nextTick(this.__onInput)
        return
      }

      const key = e.keyCode
      const target = this.keys[key]
      if (target !== void 0) {
        const { cmd, param } = target
        stopAndPrevent(e)
        this.runCmd(cmd, param, false)
      }
    },

    __onClick (e) {
      this.refreshToolbar()
      this.$emit('click', e)
    },

    __onBlur () {
      const { scrollTop, scrollHeight } = this.$refs.content
      this.__offsetBottom = scrollHeight - scrollTop
      this.$q.platform.is.ie !== true && this.caret.save()
      this.$emit('blur')
    },

    __onFocus () {
      this.$nextTick(() => {
        if (this.$refs.content !== void 0 && this.__offsetBottom !== void 0) {
          this.$refs.content.scrollTop = this.$refs.content.scrollHeight - this.__offsetBottom
        }
      })
    },

    __onMouseup (e) {
      this.caret.save()
      if (this.$listeners.mouseup !== void 0) {
        this.$emit('mouseup', e)
      }
    },

    __onKeyup (e) {
      this.caret.save()
      if (this.$listeners.keyup !== void 0) {
        this.$emit('keyup', e)
      }
    },

    __onTouchend (e) {
      this.caret.save()
      if (this.$listeners.touchend !== void 0) {
        this.$emit('touchend', e)
      }
    },

    runCmd (cmd, param, update = true) {
      this.focus()
      this.caret.restore()
      this.caret.apply(cmd, param, () => {
        this.focus()
        this.caret.save()
        if (this.$q.platform.is.ie === true || this.$q.platform.is.edge === true) {
          this.$nextTick(this.__onInput)
        }
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
    },

    __setContent (v) {
      if (this.isViewingSource) {
        this.$refs.content.innerText = v
      }
      else {
        this.$refs.content.innerHTML = v
      }
    }
  },

  created () {
    if (isSSR === false) {
      document.execCommand('defaultParagraphSeparator', false, 'div')
      this.defaultFont = window.getComputedStyle(document.body).fontFamily
    }
  },

  mounted () {
    this.caret = new Caret(this.$refs.content, this)
    this.__setContent(this.value)
    this.refreshToolbar()
  },

  render (h) {
    let toolbars

    if (this.hasToolbar) {
      const bars = []

      bars.push(
        h('div', {
          key: 'qedt_top',
          staticClass: 'q-editor__toolbar row no-wrap scroll-x',
          class: this.toolbarBackgroundClass
        }, getToolbar(h, this))
      )

      this.editLinkUrl !== null && bars.push(
        h('div', {
          key: 'qedt_btm',
          staticClass: 'q-editor__toolbar row no-wrap items-center scroll-x',
          class: this.toolbarBackgroundClass
        }, getLinkEditor(h, this, this.$q.platform.is.ie))
      )

      toolbars = h('div', {
        key: 'toolbar_ctainer',
        staticClass: 'q-editor__toolbars-container'
      }, bars)
    }

    const on = {
      ...this.$listeners,
      input: this.__onInput,
      keydown: this.__onKeydown,
      click: this.__onClick,
      blur: this.__onBlur,
      focus: this.__onFocus,

      // save caret
      mouseup: this.__onMouseup,
      keyup: this.__onKeyup,
      touchend: this.__onTouchend
    }

    return h(
      'div',
      {
        staticClass: 'q-editor',
        style: {
          height: this.inFullscreen === true ? '100vh' : null
        },
        'class': {
          disabled: this.disable,
          'fullscreen column': this.inFullscreen,
          'q-editor--square no-border-radius': this.square,
          'q-editor--flat': this.flat,
          'q-editor--dense': this.dense,
          'q-editor--dark q-dark': this.isDark
        }
      },
      [
        toolbars,

        h(
          'div',
          {
            ref: 'content',
            staticClass: `q-editor__content`,
            style: this.innerStyle,
            class: this.innerClass,
            attrs: { contenteditable: this.editable },
            domProps: isSSR
              ? { innerHTML: this.value }
              : undefined,
            on
          }
        )
      ]
    )
  }
})
