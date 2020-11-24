import { h, defineComponent } from 'vue'

import { getToolbar, getFonts, getLinkEditor } from './editor-utils.js'
import { Caret } from './editor-caret.js'

import FullscreenMixin from '../../mixins/fullscreen.js'
import DarkMixin from '../../mixins/dark.js'
import SplitAttrsMixin from '../../mixins/split-attrs.js'

import { stopAndPrevent } from '../../utils/event.js'
import extend from '../../utils/extend.js'
import { shouldIgnoreKey } from '../../utils/key-composition.js'

export default defineComponent({
  name: 'QEditor',

  mixins: [ FullscreenMixin, DarkMixin, SplitAttrsMixin ],

  props: {
    modelValue: {
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
    placeholder: String,

    toolbar: {
      type: Array,
      validator: v => v.length === 0 || v.every(group => group.length),
      default () {
        return [
          [ 'left', 'center', 'right', 'justify' ],
          [ 'bold', 'italic', 'underline', 'strike' ],
          [ 'undo', 'redo' ]
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

    paragraphTag: {
      type: String,
      validator: v => [ 'div', 'p' ].includes(v),
      default: 'div'
    },

    contentStyle: Object,
    contentClass: [ Object, Array, String ],

    square: Boolean,
    flat: Boolean,
    dense: Boolean
  },

  emits: [
    'update:modelValue',
    'keydown', 'click', 'mouseup', 'keyup', 'touchend',
    'focus', 'blur'
  ],

  computed: {
    editable () {
      return !this.readonly && !this.disable
    },

    hasToolbar () {
      return this.toolbar && this.toolbar.length > 0
    },

    toolbarBackgroundClass () {
      return this.toolbarBg
        ? ` bg-${this.toolbarBg}`
        : ''
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
        p: { cmd: 'formatBlock', param: this.paragraphTag, icon: i.heading, tip: e.paragraph },
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
              options: token.options.map(item => def[ item ])
            }
          }

          const obj = def[ token ]

          if (obj) {
            return obj.type === 'no-state' || (userDef[ token ] && (
              obj.cmd === void 0 || (this.buttonDef[ obj.cmd ] && this.buttonDef[ obj.cmd ].type === 'no-state')
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
            k[ btn.key ] = {
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

    classes () {
      return `q-editor q-editor--${this.isViewingSource === true ? 'source' : 'default'}` +
        (this.disable === true ? ' disabled' : '') +
        (this.inFullscreen === true ? ' fullscreen column' : '') +
        (this.square === true ? ' q-editor--square no-border-radius' : '') +
        (this.flat === true ? ' q-editor--flat' : '') +
        (this.dense === true ? ' q-editor--dense' : '') +
        (this.isDark === true ? ' q-editor--dark q-dark' : '')
    },

    innerClass () {
      return [
        this.contentClass,
        'q-editor__content',
        { col: this.inFullscreen, 'overflow-auto': this.inFullscreen || this.maxHeight }
      ]
    },

    attrs () {
      if (this.disable === true) {
        return { 'aria-disabled': 'true' }
      }
      if (this.readonly === true) {
        return { 'aria-readonly': 'true' }
      }
    }
  },

  data () {
    return {
      lastEmit: this.modelValue,
      editLinkUrl: null,
      isViewingSource: false
    }
  },

  watch: {
    modelValue (v) {
      if (this.lastEmit !== v) {
        this.lastEmit = v
        this.__setContent(v, true)
      }
    }
  },

  methods: {
    __onInput () {
      if (this.$refs.content) {
        const prop = `inner${this.isViewingSource === true ? 'Text' : 'HTML'}`
        const val = this.$refs.content[ prop ]

        if (val !== this.modelValue) {
          this.lastEmit = val
          this.$emit('update:modelValue', val)
        }
      }
    },

    __onKeydown (e) {
      this.$emit('keydown', e)

      if (e.ctrlKey !== true || shouldIgnoreKey(e) === true) {
        this.refreshToolbar()
        return
      }

      const key = e.keyCode
      const target = this.keys[ key ]
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

    __onBlur (e) {
      if (this.$refs.content) {
        const { scrollTop, scrollHeight } = this.$refs.content
        this.__offsetBottom = scrollHeight - scrollTop
      }
      this.caret.save()
      this.$emit('blur', e)
    },

    __onFocus (e) {
      this.$nextTick(() => {
        if (this.$refs.content && this.__offsetBottom !== void 0) {
          this.$refs.content.scrollTop = this.$refs.content.scrollHeight - this.__offsetBottom
        }
      })
      this.$emit('focus', e)
    },

    __onMouseup (e) {
      this.caret.save()
      this.$emit('mouseup', e)
    },

    __onKeyup (e) {
      this.caret.save()
      this.$emit('keyup', e)
    },

    __onTouchend (e) {
      this.caret.save()
      this.$emit('touchend', e)
    },

    runCmd (cmd, param, update = true) {
      this.focus()
      this.caret.restore()
      this.caret.apply(cmd, param, () => {
        this.focus()
        this.caret.save()
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
      this.$refs.content && this.$refs.content.focus()
    },

    getContentEl () {
      return this.$refs.content
    },

    __setContent (v, restorePosition) {
      if (this.$refs.content) {
        if (restorePosition === true) {
          this.caret.savePosition()
        }

        const prop = `inner${this.isViewingSource === true ? 'Text' : 'HTML'}`
        this.$refs.content[ prop ] = v

        if (restorePosition === true) {
          this.caret.restorePosition(this.$refs.content[ prop ].length)
          this.refreshToolbar()
        }
      }
    }
  },

  created () {
    this.caret = void 0

    if (__QUASAR_SSR_SERVER__ !== true) {
      document.execCommand('defaultParagraphSeparator', false, this.paragraphTag)
      this.defaultFont = window.getComputedStyle(document.body).fontFamily
    }
  },

  mounted () {
    this.caret = new Caret(this.$refs.content, this)
    this.__setContent(this.modelValue)
    this.refreshToolbar()
  },

  render () {
    let toolbars

    if (this.hasToolbar) {
      const bars = [
        h('div', {
          key: 'qedt_top',
          class: 'q-editor__toolbar row no-wrap scroll-x' +
            this.toolbarBackgroundClass
        }, getToolbar(this))
      ]

      this.editLinkUrl !== null && bars.push(
        h('div', {
          key: 'qedt_btm',
          class: 'q-editor__toolbar row no-wrap items-center scroll-x' +
            this.toolbarBackgroundClass
        }, getLinkEditor(this))
      )

      toolbars = h('div', {
        key: 'toolbar_ctainer',
        class: 'q-editor__toolbars-container'
      }, bars)
    }

    return h('div', {
      class: this.classes,
      style: { height: this.inFullscreen === true ? '100vh' : null },
      ...this.attrs
    }, [
      toolbars,

      h('div', {
        ref: 'content',
        style: this.innerStyle,
        class: this.innerClass,
        contenteditable: this.editable,
        placeholder: this.placeholder,
        ...(__QUASAR_SSR_SERVER__
          ? { innerHTML: this.modelValue }
          : {}),
        ...this.qListeners,
        onIput: this.__onInput,
        onKeydown: this.__onKeydown,
        onClick: this.__onClick,
        onBlur: this.__onBlur,
        onFocus: this.__onFocus,

        // save caret
        onMouseup: this.__onMouseup,
        onKeyup: this.__onKeyup,
        onTouchend: this.__onTouchend
      })
    ])
  }
})
