<template>
  <span>
    <slot>
      <input
        type="text"
        v-model="model"
      />
    </slot>
    <q-popover ref="popover" :anchor-click="false">
      <div v-if="searching" class="row justify-center" :style="{minWidth: width, padding: '3px 10px'}">
        <spinner name="dots" :size="40"></spinner>
      </div>
      <div v-else class="list no-border" :class="{'item-delimiter': delimiter}" :style="computedWidth">
        <q-list-item
          v-for="(result, index) in computedResults"
          :item="result"
          link
          :active="selectedIndex === index"
          @click.native="setValue(result.value)"
        ></q-list-item>
      </div>
    </q-popover>
  </span>
</template>

<script>
import Utils from '../../utils'

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
    setWidth: Boolean,
    delimiter: Boolean
  },
  data () {
    return {
      searchId: '',
      results: [],
      selectedIndex: -1,
      width: 0
    }
  },
  watch: {
    delay (val) {
      this.__updateDelay(val)
    }
  },
  computed: {
    model: {
      get () {
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
      if (this.setWidth) {
        return {minWidth: this.width}
      }
    },
    searching () {
      return this.searchId.length > 0
    }
  },
  methods: {
    trigger () {
      this.width = Utils.dom.width(this.inputEl) + 'px'
      this.$nextTick(() => {
        const searchId = Utils.uid()
        this.searchId = searchId

        if (this.model.length < this.minCharacters) {
          this.searchId = ''
          this.close()
          return
        }

        this.$refs.popover.close()
        setTimeout(() => {
          if (this.staticData) {
            this.searchId = ''
            this.results = Utils.filter(this.model, this.staticData)
            this.$refs.popover.open()
            return
          }

          this.$refs.popover.open()
          this.$emit('search', this.model, results => {
            if (results && this.searchId === searchId) {
              this.searchId = ''

              if (Array.isArray(results) && results.length > 0) {
                this.$refs.popover.close()
                this.$nextTick(() => {
                  this.results = results
                  setTimeout(() => {
                    if (this.$refs && this.$refs.popover) {
                      this.$refs.popover.open()
                    }
                  }, 10)
                })
                return
              }

              this.close()
            }
          })
        }, 10)
      })
    },
    close () {
      this.$refs.popover.close()
      this.results = []
      this.selectedIndex = -1
    },
    setValue (val) {
      this.model = val
      this.close()
    },
    move (offset) {
      this.selectedIndex = Math.max(-1, Math.min(this.computedResults.length - 1, this.selectedIndex + offset))
    },
    setCurrentSelection () {
      if (this.selectedIndex >= 0) {
        this.setValue(this.results[this.selectedIndex].value)
      }
    },
    __updateDelay () {
      this.inputEl.removeEventListener('input', this.delayedTrigger)
      this.delayedTrigger = this.delay ? Utils.debounce(this.trigger, this.delay) : this.trigger
      this.inputEl.addEventListener('input', this.delayedTrigger)
    },
    handleKeydown (e) {
      switch (e.keyCode || e.which) {
        case 38: // up
          this.move(-1)
          break
        case 40: // down
          if (!this.$refs.popover.opened) {
            this.trigger()
          }
          else {
            this.move(1)
          }
          break
        case 13: // enter
          this.setCurrentSelection()
          break
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
      this.__updateDelay()
      this.inputEl.addEventListener('keydown', this.handleKeydown)
    })
  },
  beforeDestroy () {
    this.close()
    this.inputEl.removeEventListener('input', this.delayedTrigger)
    this.inputEl.removeEventListener('keydown', this.handleKeydown)
  }
}
</script>
