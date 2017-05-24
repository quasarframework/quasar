<template>
  <q-popover
    fit
    @close="$emit('close')"
    @open="$emit('show')"
    :offset="[0, 10]"
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
  inject: ['__input'],
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
      this.__input.set(result.value)
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
      this.enterKey = true
      if (this.selectedIndex >= 0) {
        this.setValue(this.results[this.selectedIndex])
      }
    },
    __delayTrigger () {
      clearTimeout(this.timer)
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
    if (this.__input === void 0) {
      console.error('Autocomplete needs to be inserted into an input form component.')
      return
    }
    this.__input.register()
    this.$nextTick(() => {
      this.inputEl = this.__input.getEl()
      this.inputEl.addEventListener('keydown', this.__handleKeypress)
    })
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    this.__input.unregister()
    if (this.inputEl) {
      this.inputEl.removeEventListener('keydown', this.__handleKeypress)
      this.close()
    }
  }
}
</script>
