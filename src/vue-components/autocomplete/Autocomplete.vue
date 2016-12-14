<template>
  <span>
    <slot>
      <input
        type="text"
        v-model="model"
      />
    </slot>
    <q-popover ref="popover" :anchorClick="false">
      <div v-if="searching" class="row justify-center" :style="{width: width, padding: '3px 10px'}">
        <spinner name="dots" :size="40"></spinner>
      </div>
      <div v-else class="list no-border" :style="computedWidth">
        <div
          class="item item-link"
          v-for="(result, index) in computedResults"
          @click="setValue(result.value)"
          :class="{active: selectedIndex === index, 'two-lines': result.secondLabel}"
        >
          <i v-if="result.icon" class="item-primary">{{result.icon}}</i>
          <img v-if="result.img" class="item-primary thumbnail" :src="result.img" />

          <div class="item-content" :class="{'has-secondary': result.secondIcon || result.secondImg || result.stamp}">
            <div v-html="result.label"></div>
            <div v-if="result.secondLabel" v-html="result.secondLabel"></div>
          </div>

          <div v-if="result.stamp" class="item-secondary stamp" v-html="result.stamp"></div>
          <i v-if="result.secondIcon" class="item-secondary">{{result.secondIcon}}</i>
          <img v-if="result.secondImg" class="item-secondary thumbnail" :src="result.secondImg" />
        </div>
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
    resultsLimit: {
      type: Number,
      default: 6
    },
    delay: {
      type: Number,
      default: 500
    },
    setWidth: Boolean
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
      if (this.resultsLimit && this.results.length > 0) {
        return this.results.slice(0, this.resultsLimit)
      }
    },
    computedWidth () {
      if (this.setWidth) {
        return {width: this.width}
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

        this.$refs.popover.open()
        this.$emit('search', this.model, results => {
          if (results && this.searchId === searchId) {
            this.searchId = ''
            this.results = results
          }
        })
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
