<template>
  <q-popover
    fit
    @close="$emit('close')"
    @open="$emit('show')"
    ref="popover"
    :anchor-click="false"
  >
    <div class="list no-border" :class="{delimiter: delimiter}" :style="computedWidth">
      <q-item
        v-for="(result, index) in computedResults"
        :key="result"
        :cfg="result"
        link
        :active="selectedIndex === index"
        @click.native="setValue(result)"
      ></q-item>
    </div>
  </q-popover>
</template>

<script>
import { width } from '../../utils/dom'
import filter from '../../utils/filter'
import uid from '../../utils/uid'
import { isPrintableChar } from '../../utils/is'
import { normalizeToInterval } from '../../utils/format'
import { QInput } from '../input'
import { QPopover } from '../popover'
import { QItem } from '../item'

function prevent (e) {
  e.preventDefault()
  e.stopPropagation()
}

export default {
  name: 'q-autocomplete',
  components: {
    QInput,
    QPopover,
    QItem
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
    staticData: Object,
    delimiter: Boolean
  },
  inject: ['getInputEl', 'setInputValue'],
  data () {
    return {
      searchId: '',
      results: [],
      selectedIndex: -1,
      width: 0,
      timer: null
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
      const terms = this.inputEl.value
      this.width = width(this.inputEl) + 'px'
      const searchId = uid()
      this.searchId = searchId

      if (terms.length < this.minCharacters) {
        this.searchId = ''
        this.close()
        return
      }

      if (this.staticData) {
        this.searchId = ''
        this.results = filter(terms, this.staticData)
        if (this.$q.platform.is.desktop) {
          this.selectedIndex = 0
        }
        this.$refs.popover.open()
        return
      }

      this.$emit('search', terms, results => {
        if (!results || this.searchId !== searchId) {
          return
        }

        this.searchId = ''
        if (this.results === results) {
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
    setValue (result) {
      this.setInputValue(result.value)
      this.$emit('selected', result)
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
      if (this.selectedIndex >= 0) {
        this.setValue(this.results[this.selectedIndex])
      }
    },
    __delayTrigger () {
      clearTimeout(this.timer)
      if (this.staticData) {
        this.$nextTick(this.trigger)
        return
      }
      this.timer = setTimeout(this.trigger, this.debounce)
    },
    __handleKeypress (e) {
      const key = e.keyCode || e.which
      switch (key) {
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
          break
        default:
          if (
            key === 8 || // backspace
            key === 46 || // delete
            isPrintableChar(key)
          ) {
            this.__delayTrigger()
          }
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
    if (!this.getInputEl) {
      console.error('Autocomplete needs to be inserted into an input.')
      return
    }
    this.$nextTick(() => {
      this.inputEl = this.getInputEl()
      this.inputEl.addEventListener('keydown', this.__handleKeypress)
    })
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    if (this.inputEl) {
      this.inputEl.removeEventListener('keydown', this.__handleKeypress)
      this.close()
    }
  }
}
</script>
