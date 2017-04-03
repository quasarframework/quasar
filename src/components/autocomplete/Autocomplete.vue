<template>
  <span>
    <slot>
      <q-input v-model="model"></q-input>
    </slot>
    <q-popover @close="popclose" @open="popopen" ref="popover" :anchor-click="false">
      <div class="list no-border" :class="{'item-delimiter': delimiter}" :style="computedWidth">
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
  </span>
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
    popopen () {
      this.$emit('open')
    },
    popclose () {
      this.$emit('close')
    },
    trigger () {
      this.width = width(this.inputEl) + 'px'
      const searchId = uid()
      this.searchId = searchId

      if (this.model.length < this.minCharacters) {
        this.searchId = ''
        this.close()
        return
      }

      if (this.staticData) {
        this.searchId = ''
        this.results = filter(this.model, this.staticData)
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
