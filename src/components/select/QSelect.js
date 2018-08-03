import QSearch from '../search/QSearch.js'
import QPopover from '../popover/QPopover.js'
import QList from '../list/QList.js'
import QItemWrapper from '../list/QItemWrapper.js'
import QCheckbox from '../checkbox/QCheckbox.js'
import QRadio from '../radio/QRadio.js'
import QToggle from '../toggle/QToggle.js'
import QIcon from '../icon/QIcon.js'
import QInputFrame from '../input-frame/QInputFrame.js'
import QChip from '../chip/QChip.js'
import FrameMixin from '../../mixins/input-frame.js'
import KeyboardSelectionMixin from '../../mixins/keyboard-selection.js'

function defaultFilterFn (terms, obj) {
  return obj.label.toLowerCase().indexOf(terms) > -1
}

export default {
  name: 'QSelect',
  mixins: [FrameMixin, KeyboardSelectionMixin],
  props: {
    filter: [Function, Boolean],
    filterPlaceholder: String,
    radio: Boolean,
    placeholder: String,
    separator: Boolean,
    value: { required: true },
    multiple: Boolean,
    toggle: Boolean,
    chips: Boolean,
    options: {
      type: Array,
      required: true,
      validator: v => v.every(o => 'label' in o && 'value' in o)
    },
    chipsColor: String,
    chipsBgColor: String,
    displayValue: String
  },
  data () {
    return {
      model: this.multiple && Array.isArray(this.value)
        ? this.value.slice()
        : this.value,
      terms: '',
      focused: false
    }
  },
  watch: {
    value (val) {
      this.model = this.multiple && Array.isArray(val)
        ? val.slice()
        : val
    },
    visibleOptions () {
      this.__keyboardCalcIndex()
    }
  },
  computed: {
    optModel () {
      if (this.multiple) {
        return this.model.length > 0
          ? this.options.map(opt => this.model.includes(opt.value))
          : this.options.map(opt => false)
      }
    },
    visibleOptions () {
      let opts = this.options.map((opt, index) => Object.assign({}, opt, { index }))
      if (this.filter && this.terms.length) {
        const lowerTerms = this.terms.toLowerCase()
        opts = opts.filter(opt => this.filterFn(lowerTerms, opt))
      }
      return opts
    },
    keyboardMaxIndex () {
      return this.visibleOptions.length - 1
    },
    filterFn () {
      return typeof this.filter === 'boolean'
        ? defaultFilterFn
        : this.filter
    },
    actualValue () {
      if (this.displayValue) {
        return this.displayValue
      }
      if (!this.multiple) {
        const opt = this.options.find(opt => opt.value === this.model)
        return opt ? opt.label : ''
      }

      const opt = this.selectedOptions.map(opt => opt.label)
      return opt.length ? opt.join(', ') : ''
    },
    computedClearValue () {
      return this.clearValue || (this.multiple ? [] : null)
    },
    isClearable () {
      return this.editable && this.clearable && JSON.stringify(this.computedClearValue) !== JSON.stringify(this.model)
    },
    selectedOptions () {
      if (this.multiple) {
        return this.length > 0
          ? this.options.filter(opt => this.model.includes(opt.value))
          : []
      }
    },
    hasChips () {
      return this.multiple && this.chips && this.length > 0
    },
    length () {
      return this.multiple
        ? this.model.length
        : ([null, undefined, ''].includes(this.model) ? 0 : 1)
    },
    additionalLength () {
      return this.displayValue && this.displayValue.length > 0
    }
  },
  methods: {
    togglePopup () {
      this.$refs.popover && this[this.$refs.popover.showing ? 'hide' : 'show']()
    },
    show () {
      this.__keyboardCalcIndex()
      if (this.$refs.popover) {
        return this.$refs.popover.show()
      }
    },
    hide () {
      return this.$refs.popover ? this.$refs.popover.hide() : Promise.resolve()
    },
    reposition () {
      const popover = this.$refs.popover
      if (popover && popover.showing) {
        this.$nextTick(() => popover && popover.reposition())
      }
    },

    __keyboardCalcIndex () {
      this.keyboardIndex = -1
      const sel = this.multiple ? this.selectedOptions.map(o => o.value) : [this.model]
      this.$nextTick(() => {
        const index = sel === void 0 ? -1 : Math.max(-1, this.visibleOptions.findIndex(opt => sel.includes(opt.value)))
        if (index > -1) {
          this.keyboardMoveDirection = true
          setTimeout(() => { this.keyboardMoveDirection = false }, 500)
          this.__keyboardShow(index)
        }
      })
    },
    __keyboardCustomKeyHandle (key, e) {
      switch (key) {
        case 13: // ENTER key
        case 32: // SPACE key
          if (!this.$refs.popover.showing) {
            this.show()
          }
          break
      }
    },
    __keyboardShowTrigger () {
      this.show()
    },
    __keyboardSetSelection (index) {
      const opt = this.visibleOptions[index]

      if (this.multiple) {
        this.__toggleMultiple(opt.value, opt.disable)
      }
      else {
        this.__singleSelect(opt.value, opt.disable)
      }
    },
    __keyboardIsSelectableIndex (index) {
      return index > -1 && index < this.visibleOptions.length && !this.visibleOptions[index].disable
    },
    __mouseEnterHandler (e, index) {
      if (!this.keyboardMoveDirection) {
        this.keyboardIndex = index
      }
    },
    __onFocus () {
      if (this.disable || this.focused) {
        return
      }
      this.focused = true
      this.$emit('focus')
    },
    __onShow () {
      if (this.disable) {
        return
      }
      this.__onFocus()
      if (this.filter && this.$refs.filter) {
        this.$refs.filter.focus()
      }
    },
    __onBlur (e) {
      if (!this.focused) {
        return
      }
      setTimeout(() => {
        const el = document.activeElement
        if (
          !this.$refs.popover ||
          !this.$refs.popover.showing ||
          (el !== document.body && !this.$refs.popover.$el.contains(el))
        ) {
          this.__onClose()
          this.hide()
        }
      }, 1)
    },
    __onClose (keepFocus) {
      this.$nextTick(() => {
        if (JSON.stringify(this.model) !== JSON.stringify(this.value)) {
          this.$emit('change', this.model)
        }
      })
      this.terms = ''
      if (!this.focused) {
        return
      }
      if (keepFocus) {
        this.$refs.input && this.$refs.input.$el && this.$refs.input.$el.focus()
        return
      }
      this.focused = false
      this.$emit('blur')
    },
    __singleSelect (val, disable) {
      if (disable) {
        return
      }
      this.__emit(val)
      this.hide()
    },
    __toggleMultiple (value, disable) {
      if (disable) {
        return
      }
      const
        model = this.model,
        index = model.indexOf(value)

      if (index > -1) {
        this.$emit('remove', { index, value: model.splice(index, 1) })
      }
      else {
        this.$emit('add', { index: model.length, value })
        model.push(value)
      }

      this.$emit('input', model)
    },
    __emit (value) {
      this.$emit('input', value)
      this.$nextTick(() => {
        if (JSON.stringify(value) !== JSON.stringify(this.value)) {
          this.$emit('change', value)
        }
      })
    },
    __setModel (val, forceUpdate) {
      this.model = val || (this.multiple ? [] : null)
      this.$emit('input', this.model)
      if (forceUpdate || !this.$refs.popover || !this.$refs.popover.showing) {
        this.__onClose(forceUpdate)
      }
    },
    __getChipTextColor (optColor) {
      if (this.chipsColor) {
        return this.chipsColor
      }
      if (this.isInvertedLight) {
        return this.invertedLight ? optColor || this.color : 'white'
      }
      if (this.isInverted) {
        return optColor || (this.invertedLight ? 'grey-10' : this.color)
      }
      return this.dark
        ? optColor || this.color
        : 'white'
    },
    __getChipBgColor (optColor) {
      if (this.chipsBgColor) {
        return this.chipsBgColor
      }
      if (this.isInvertedLight) {
        return this.invertedLight ? 'grey-10' : optColor || this.color
      }
      if (this.isInverted) {
        return this.invertedLight ? this.color : 'white'
      }
      return this.dark
        ? 'white'
        : optColor || this.color
    }
  },

  render (h) {
    const child = []

    if (this.hasChips) {
      const el = h('div', {
        staticClass: 'col row items-center group q-input-chips',
        'class': this.alignClass
      }, this.selectedOptions.map(opt => {
        return h(QChip, {
          key: opt.label,
          props: {
            small: true,
            dense: this.dense,
            closable: this.editable && !opt.disable,
            color: this.__getChipBgColor(opt.color),
            textColor: this.__getChipTextColor(opt.color),
            icon: opt.icon,
            iconRight: opt.rightIcon,
            avatar: opt.avatar
          },
          on: {
            hide: () => { this.__toggleMultiple(opt.value, this.disable || opt.disable) }
          },
          nativeOn: {
            click: e => { e.stopPropagation() }
          }
        }, [ opt.label ])
      }))
      child.push(el)
    }
    else {
      const el = h('div', {
        staticClass: 'col q-input-target ellipsis',
        'class': this.fakeInputClasses
      }, [ this.fakeInputValue ])
      child.push(el)
    }

    child.push(h(QPopover, {
      ref: 'popover',
      staticClass: 'column no-wrap',
      'class': this.dark ? 'bg-dark' : null,
      props: {
        fit: true,
        disable: !this.editable,
        anchorClick: false
      },
      slot: 'after',
      on: {
        show: this.__onShow,
        hide: () => { this.__onClose(true) }
      },
      nativeOn: {
        keydown: this.__keyboardHandleKey
      }
    }, [
      (this.filter && h(QSearch, {
        ref: 'filter',
        staticClass: 'col-auto',
        style: 'padding: 10px;',
        props: {
          value: this.terms,
          placeholder: this.filterPlaceholder || this.$q.i18n.label.filter,
          debounce: 100,
          color: this.color,
          dark: this.dark,
          noParentField: true,
          noIcon: true
        },
        on: {
          input: val => {
            this.terms = val
            this.reposition()
          }
        }
      })) || void 0,

      (this.visibleOptions.length && h(QList, {
        staticClass: 'no-border scroll',
        props: {
          separator: this.separator,
          dark: this.dark
        }
      }, this.visibleOptions.map((opt, index) => {
        return h(QItemWrapper, {
          key: index,
          'class': [
            opt.disable ? 'text-faded' : 'cursor-pointer',
            index === this.keyboardIndex ? 'q-select-highlight' : '',
            opt.disable ? '' : 'cursor-pointer',
            opt.className || ''
          ],
          props: {
            cfg: opt,
            slotReplace: true,
            active: this.multiple ? void 0 : this.value === opt.value
          },
          nativeOn: {
            '!click': () => {
              const action = this.multiple ? '__toggleMultiple' : '__singleSelect'
              this[action](opt.value, opt.disable)
            },
            mouseenter: e => {
              !opt.disable && this.__mouseEnterHandler(e, index)
            }
          }
        }, [
          this.multiple
            ? h(this.toggle ? QToggle : QCheckbox, {
              slot: this.toggle ? 'right' : 'left',
              props: {
                keepColor: true,
                color: opt.color || this.color,
                dark: this.dark,
                value: this.optModel[opt.index],
                disable: opt.disable,
                noFocus: true
              }
            })
            : (this.radio && h(QRadio, {
              slot: 'left',
              props: {
                keepColor: true,
                color: opt.color || this.color,
                dark: this.dark,
                value: this.value,
                val: opt.value,
                disable: opt.disable,
                noFocus: true
              }
            })) || void 0
        ])
      }))) || void 0
    ]))

    if (this.isClearable) {
      child.push(h(QIcon, {
        slot: 'after',
        staticClass: 'q-if-control',
        props: { name: this.$q.icon.input[`clear${this.isInverted ? 'Inverted' : ''}`] },
        nativeOn: {
          click: this.clear
        }
      }))
    }

    child.push(h(QIcon, {
      slot: 'after',
      staticClass: 'q-if-control',
      props: { name: this.$q.icon.input.dropdown }
    }))

    return h(QInputFrame, {
      ref: 'input',
      staticClass: 'q-select',
      props: {
        prefix: this.prefix,
        suffix: this.suffix,
        stackLabel: this.stackLabel,
        floatLabel: this.floatLabel,
        error: this.error,
        warning: this.warning,
        disable: this.disable,
        readonly: this.readonly,
        inverted: this.inverted,
        invertedLight: this.invertedLight,
        dark: this.dark,
        dense: this.dense,
        box: this.box,
        fullWidth: this.fullWidth,
        outline: this.outline,
        hideUnderline: this.hideUnderline,
        before: this.before,
        after: this.after,
        color: this.color,
        noParentField: this.noParentField,
        focused: this.focused,
        focusable: true,
        length: this.length,
        additionalLength: this.additionalLength
      },
      nativeOn: {
        click: this.togglePopup,
        focus: this.__onFocus,
        blur: this.__onBlur,
        keydown: this.__keyboardHandleKey
      }
    }, child)
  }
}
