<template>
  <span>
    <slot>
      <input
        type="text"
        v-model="model"
      />
    </slot>
    <q-popover ref="popover" :anchor-click="false">
      <div class="list no-border" :class="{'item-delimiter': delimiter}" :style="computedWidth">
        <q-list-item
          v-for="(result, index) in computedResults"
          :item="result"
          link
          :active="selectedIndex === index"
          @click.native="setValue(result)"
        ></q-list-item>
      </div>
    </q-popover>
  </span>
</template>

<script>
import Utils from '../../utils'

function prevent (e) {
  e.preventDefault()
  e.stopPropagation()
}

export default {
  props: {
    value: {
      type: String,
      required: true
    },
    minCharacters: {
      type: Number,
      default: 1
    },
    maxResults: {
      type: Number,
      default: 6
    },
    delay: {
      type: Number,
      default: 500
    },
    staticData: Object,
    delimiter: Boolean
  },
  data () {
    return {
      searchId: '',
      results: [],
      selectedIndex: -1,
      width: 0,
      timer: null,
      avoidTrigger: false
    }
  },
  computed: {
    model: {
      get () {
        if (!this.avoidTrigger) {
          if (document.activeElement === this.inputEl) {
            this.__delayTrigger()
          }
        }
        else {
          this.avoidTrigger = false
        }
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
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
      this.width = Utils.dom.width(this.inputEl) + 'px'
      const searchId = Utils.uid()
      this.searchId = searchId

      if (this.model.length < this.minCharacters) {
        this.searchId = ''
        this.close()
        return
      }

      if (this.staticData) {
        this.searchId = ''
        this.results = Utils.filter(this.model, this.staticData)
        if (this.$q.platform.is.desktop) {
          this.selectedIndex = 0
        }
        this.$refs.popover.open()
        return
      }

      this.$emit('search', this.model, results => {
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
      this.avoidTrigger = true
      this.model = result.value
      this.$emit('selected', result)
      this.close()
    },
    move (offset) {
      const size = this.computedResults.length
      let index = (this.selectedIndex + offset) % this.computedResults.length
      if (index < 0) {
        index = size + index
      }
      this.selectedIndex = index
    },
    setCurrentSelection () {
      if (this.selectedIndex >= 0) {
        this.setValue(this.results[this.selectedIndex])
      }
    },
    __delayTrigger () {
      clearTimeout(this.timer)
      this.timer = setTimeout(this.trigger, this.staticData ? 0 : this.delay)
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
        default:
          this.close()
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
    this.$nextTick(() => {
      this.inputEl = this.$el.querySelector('input')
      if (!this.inputEl) {
        console.error('Autocomplete needs to contain one input field in its slot.')
        return
      }
      this.inputEl.addEventListener('keydown', this.__handleKeypress)
    })
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    this.inputEl.removeEventListener('keydown', this.__handleKeypress)
    this.close()
  }
}
</script>
