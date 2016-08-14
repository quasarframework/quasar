<template>
  <div class="quasar-infinite-scroll">
    <div v-el:content class="quasar-infinite-scroll-content">
      <slot></slot>
    </div>
    <br>
    <div class="quasar-infinite-scroll-message" v-show="refreshing">
      <slot name="message"></slot>
    </div>
  </div>
</template>

<script>
import Utils from '../../utils'

export default {
  props: {
    handler: {
      type: Function,
      required: true
    },
    inline: {
      type: Boolean,
      default: false,
      coerce: Boolean
    }
  },
  data () {
    return {
      index: 0,
      refreshing: false
    }
  },
  methods: {
    scroll () {
      if (this.refreshing) {
        return
      }

      let
        windowHeight = Utils.dom.height(this.scrollContainer),
        containerBottom = Utils.dom.offset(this.scrollContainer).top + windowHeight,
        triggerPosition = Utils.dom.offset(this.element).top + Utils.dom.height(this.element) - windowHeight

      if (triggerPosition < containerBottom) {
        this.index++
        this.refreshing = true
        this.handler(this.index, () => {
          this.refreshing = false
          if (this.element.closest('body')) {
            this.scroll()
          }
        })
      }
    }
  },
  ready () {
    this.scroll = Utils.debounce(this.scroll, 50)
    this.element = this.$els.content

    this.scrollContainer = this.inline ? this.$el : this.element.closest('.layout-view')
    if (!this.scrollContainer) {
      this.scrollContainer = document.getElementById('quasar-app')
    }
    this.scrollContainer.addEventListener('scroll', this.scroll)

    this.scroll()
  },
  destroy () {
    this.scrollContainer.removeEventListener('scroll', this.scroll)
  }
}
</script>
