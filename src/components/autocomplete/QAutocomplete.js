import { width } from '../../utils/dom'
import filter from '../../utils/filter'
import uid from '../../utils/uid'
import { QPopover } from '../popover'
import { QList, QItemWrapper } from '../list'
import KeyboardSelectionMixin from '../../mixins/keyboard-selection'

export default {
  name: 'QAutocomplete',
  mixins: [KeyboardSelectionMixin],
  props: {
    minCharacters: {
      type: Number,
      default: 1
    },
    maxResults: {
      type: Number,
      default: 6
    },
    maxHeight: String,
    debounce: {
      type: Number,
      default: 500
    },
    filter: {
      type: Function,
      default: filter
    },
    staticData: Object,
    separator: Boolean
  },
  inject: {
    __input: {
      default () {
        console.error('QAutocomplete needs to be child of QInput, QChipsInput or QSearch')
      }
    },
    __inputDebounce: { default: null }
  },
  data () {
    return {
      searchId: '',
      results: [],
      width: 0,
      enterKey: false,
      timer: null
    }
  },
  watch: {
    '__input.val' () {
      if (this.enterKey) {
        this.enterKey = false
      }
      else {
        this.__delayTrigger()
      }
    }
  },
  computed: {
    computedResults () {
      return this.maxResults && this.results.length > 0
        ? this.results.slice(0, this.maxResults)
        : []
    },
    keyboardMaxIndex () {
      return this.computedResults.length - 1
    },
    computedWidth () {
      return {minWidth: this.width}
    },
    searching () {
      return this.searchId.length > 0
    }
  },
  methods: {
    isWorking () {
      return this.$refs && this.$refs.popover
    },
    trigger (focus) {
      if (!this.__input || !this.__input.isEditable() || !this.__input.hasFocus() || !this.isWorking()) {
        return
      }

      const
        terms = [null, void 0].includes(this.__input.val) ? '' : String(this.__input.val),
        termsLength = terms.length,
        searchId = uid()

      this.searchId = searchId

      if (termsLength < this.minCharacters || (focus === true /* avoid callback params */ && termsLength > 0)) {
        this.searchId = ''
        this.__clearSearch()
        this.hide()
        return
      }

      this.width = width(this.inputEl) + 'px'

      if (this.staticData) {
        this.searchId = ''
        this.results = this.filter(terms, this.staticData)
        const popover = this.$refs.popover
        if (this.results.length) {
          this.__keyboardShow(-1)
          if (popover && popover.showing) {
            this.$nextTick(() => popover && popover.reposition())
          }
          else {
            popover.show()
          }
        }
        else {
          popover.hide()
        }
        return
      }

      this.__input.loading = true
      this.$emit('search', terms, results => {
        if (!this.isWorking() || this.searchId !== searchId) {
          return
        }

        this.__clearSearch()

        if (Array.isArray(results) && results.length > 0) {
          this.results = results
          this.__keyboardShow(-1)
          this.$refs.popover.show()
          return
        }

        this.hide()
      })
    },
    hide () {
      this.results = []
      return this.isWorking()
        ? this.$refs.popover.hide()
        : Promise.resolve()
    },
    blurHide () {
      this.__clearSearch()
      setTimeout(() => this.hide(), 300)
    },
    __clearSearch () {
      clearTimeout(this.timer)
      this.__input.loading = false
      this.searchId = ''
    },
    __keyboardCustomKeyHandle (key) {
      switch (key) {
        case 27: // ESCAPE
          this.__clearSearch()
          break
        case 38: // UP key
        case 40: // DOWN key
        case 9: // TAB key
          this.__keyboardSetCurrentSelection(true)
          break
      }
    },
    __keyboardShowTrigger () {
      this.trigger()
    },
    __focusShowTrigger () {
      this.trigger(true)
    },
    __keyboardIsSelectableIndex (index) {
      return index > -1 && index < this.computedResults.length && !this.computedResults[index].disable
    },
    setValue (result, kbdNav) {
      const value = this.staticData ? result[this.staticData.field] : result.value
      const suffix = this.__inputDebounce ? 'Debounce' : ''

      if (this.inputEl && this.__input && !this.__input.hasFocus()) {
        this.inputEl.focus()
      }

      this.enterKey = this.__input && value !== this.__input.val
      this[`__input${suffix}`][kbdNav ? 'setNav' : 'set'](value)

      this.$emit('selected', result)
      if (!kbdNav) {
        this.__clearSearch()
        this.hide()
      }
    },
    __keyboardSetSelection (index, navigation) {
      this.setValue(this.results[index], navigation)
    },
    __delayTrigger () {
      this.__clearSearch()
      if (!this.__input.hasFocus()) {
        return
      }
      if (this.staticData) {
        this.trigger()
        return
      }
      this.timer = setTimeout(this.trigger, this.debounce)
    }
  },
  mounted () {
    this.__input.register()
    if (this.__inputDebounce) {
      this.__inputDebounce.setChildDebounce(true)
    }
    this.$nextTick(() => {
      if (this.__input) {
        this.inputEl = this.__input.getEl()
      }
      this.inputEl.addEventListener('keydown', this.__keyboardHandleKey)
      this.inputEl.addEventListener('blur', this.blurHide)
      this.inputEl.addEventListener('focus', this.__focusShowTrigger)
    })
  },
  beforeDestroy () {
    this.__clearSearch()
    this.__input.unregister()
    if (this.__inputDebounce) {
      this.__inputDebounce.setChildDebounce(false)
    }
    if (this.inputEl) {
      this.inputEl.removeEventListener('keydown', this.__keyboardHandleKey)
      this.inputEl.removeEventListener('blur', this.blurHide)
      this.inputEl.removeEventListener('focus', this.__focusShowTrigger)
      this.hide()
    }
  },
  render (h) {
    const dark = this.__input.isDark()
    return h(QPopover, {
      ref: 'popover',
      'class': dark ? 'bg-dark' : null,
      props: {
        fit: true,
        anchorClick: false,
        maxHeight: this.maxHeight,
        noFocus: true,
        noRefocus: true
      },
      on: {
        show: () => {
          this.__input.selectionOpen = true
          this.$emit('show')
        },
        hide: () => {
          this.__input.selectionOpen = false
          this.$emit('hide')
        }
      }
    }, [
      h(QList, {
        props: {
          dark,
          noBorder: true,
          separator: this.separator
        },
        style: this.computedWidth
      },
      this.computedResults.map((result, index) => h(QItemWrapper, {
        key: result.id || index,
        'class': {
          'q-select-highlight': this.keyboardIndex === index,
          'cursor-pointer': !result.disable,
          'text-faded': result.disable
        },
        props: { cfg: result },
        nativeOn: {
          mouseenter: () => { !result.disable && (this.keyboardIndex = index) },
          click: () => { !result.disable && this.setValue(result) }
        }
      })))
    ])
  }
}
