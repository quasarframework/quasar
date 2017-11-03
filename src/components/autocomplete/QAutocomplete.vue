<template>
  <q-popover
    fit
    @close="$emit('close')"
    @open="$emit('open')"
    :offset="[0, 10]"
    ref="popover"
    :anchor-click="false"
  >
    <q-list no-border link :separator="separator" :style="computedWidth">
      <q-item-wrapper
        v-for="(result, index) in computedResults"
        :key="result.id || JSON.stringify(result)"
        :cfg="result"
        :class="{active: selectedIndex === index}"
        @click="setValue(result)"
      ></q-item-wrapper>
    </q-list>
  </q-popover>
</template>

<script>
import { width } from '../../utils/dom'
import filter from '../../utils/filter'
import uid from '../../utils/uid'
import { normalizeToInterval } from '../../utils/format'
import { QInput } from '../input'
import { QPopover } from '../popover'
import { QList, QItemWrapper } from '../list'

function prevent (e) {
  e.preventDefault()
  e.stopPropagation()
}

export default {
  name: 'q-autocomplete',
  components: {
    QInput,
    QPopover,
    QList,
    QItemWrapper
  },
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
      if (this.maxResults && this.results.length > 0) {
        return this.results.slice(0, this.maxResults)
      }
    },
    computedWidth () {
      return {minWidth: this.width}
    },
    searching () {
      return this.searchId.length > 0
    }
  },
  methods: {
    trigger () {
      if (!this.__input.hasFocus()) {
        return
      }
      const terms = this.__input.val
      this.width = width(this.inputEl) + 'px'
      const searchId = uid()
      this.searchId = searchId

      if (terms.length < this.minCharacters) {
        this.searchId = ''
        this.__clearSearch()
        this.close()
        return
      }

      if (this.staticData) {
        this.searchId = ''
        this.results = this.filter(terms, this.staticData)
        if (this.$q.platform.is.desktop) {
          this.selectedIndex = 0
        }
        this.$refs.popover.open()
        return
      }

      this.close()
      this.__input.loading = true
      this.$emit('search', terms, results => {
        if (this.searchId !== searchId) {
          return
        }

        this.__clearSearch()

        if (!this.results || this.results === results) {
          return
        }

        if (Array.isArray(results) && results.length > 0) {
          this.results = results
          if (this.$refs && this.$refs.popover) {
            if (this.$q.platform.is.desktop) {
              this.selectedIndex = 0
            }
            this.$refs.popover.open()
          }
          return
        }

        this.close()
      })
    },
    close () {
      this.$refs.popover.close()
      this.results = []
      this.selectedIndex = -1
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
      this.close()
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
      if (this.selectedIndex >= 0) {
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

      if (!this.$refs.popover.opened) {
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
      this.inputEl.addEventListener('keyup', this.__handleKeypress)
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
      this.close()
    }
  }
}
</script>
