import { width } from '../../utils/dom'
import filter from '../../utils/filter'
import uid from '../../utils/uid'
import { normalizeToInterval } from '../../utils/format'
import { QPopover } from '../popover'
import { QList, QItemWrapper } from '../list'

function prevent (e) {
  e.preventDefault()
  e.stopPropagation()
}

export default {
  name: 'q-autocomplete',
  props: {
    minCharacters: {
      type: Number,
      default: 1
    },
    maxResults: {
      type: Number,
      default: 6
    },
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
        console.error('QAutocomplete needs to be child of QInput or QSearch')
      }
    },
    __inputDebounce: { default: null }
  },
  data () {
    return {
      searchId: '',
      results: [],
      selectedIndex: -1,
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
    trigger () {
      if (!this.__input.hasFocus() || !this.isWorking()) {
        return
      }

      const terms = this.__input.val
      const searchId = uid()
      this.searchId = searchId

      if (terms.length < this.minCharacters) {
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
          this.selectedIndex = 0
          if (popover.showing) {
            popover.reposition()
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
          this.selectedIndex = 0
          this.$refs.popover.show()
          return
        }

        this.hide()
      })
    },
    hide () {
      this.results = []
      this.selectedIndex = -1
      return this.isWorking()
        ? this.$refs.popover.hide()
        : Promise.resolve()
    },
    blurHide () {
      setTimeout(() => this.hide(), 300)
    },
    __clearSearch () {
      clearTimeout(this.timer)
      this.__input.loading = false
      this.searchId = ''
    },
    setValue (result) {
      const suffix = this.__inputDebounce ? 'Debounce' : ''
      this[`__input${suffix}`].set(this.staticData ? result[this.staticData.field] : result.value)

      this.$emit('selected', result)
      this.__clearSearch()
      this.hide()
    },
    move (offset) {
      this.selectedIndex = normalizeToInterval(
        this.selectedIndex + offset,
        0,
        this.computedResults.length - 1
      )
    },
    setCurrentSelection () {
      this.enterKey = true
      if (this.selectedIndex >= 0 && this.selectedIndex < this.results.length) {
        this.setValue(this.results[this.selectedIndex])
      }
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
    },
    __handleKeypress (e) {
      switch (e.keyCode || e.which) {
        case 38: // up
          this.__moveCursor(-1, e)
          break
        case 40: // down
          this.__moveCursor(1, e)
          break
        case 13: // enter
          this.setCurrentSelection()
          prevent(e)
          break
        case 27: // escape
          this.__clearSearch()
          break
      }
    },
    __moveCursor (offset, e) {
      prevent(e)

      if (!this.$refs.popover.showing) {
        this.trigger()
      }
      else {
        this.move(offset)
      }
    }
  },
  mounted () {
    this.__input.register()
    if (this.__inputDebounce) {
      this.__inputDebounce.setChildDebounce(true)
    }
    this.$nextTick(() => {
      this.inputEl = this.__input.getEl()
      this.inputEl.addEventListener('keydown', this.__handleKeypress)
      this.inputEl.addEventListener('blur', this.blurHide)
    })
  },
  beforeDestroy () {
    this.__clearSearch()
    this.__input.unregister()
    if (this.__inputDebounce) {
      this.__inputDebounce.setChildDebounce(false)
    }
    if (this.inputEl) {
      this.inputEl.removeEventListener('keydown', this.__handleKeypress)
      this.inputEl.removeEventListener('blur', this.blurHide)
      this.hide()
    }
  },
  render (h) {
    return h(QPopover, {
      ref: 'popover',
      props: {
        fit: true,
        offset: [0, 10],
        anchorClick: false
      },
      on: {
        show: () => this.$emit('show'),
        hide: () => this.$emit('hide')
      }
    }, [
      h(QList, {
        props: {
          noBorder: true,
          link: true,
          separator: this.separator
        },
        style: this.computedWidth
      },
      this.computedResults.map((result, index) => h(QItemWrapper, {
        key: result.id || JSON.stringify(result),
        'class': { active: this.selectedIndex === index },
        props: { cfg: result },
        on: {
          click: () => { this.setValue(result) }
        }
      })))
    ])
  }
}
