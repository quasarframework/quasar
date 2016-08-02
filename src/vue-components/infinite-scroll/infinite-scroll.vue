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
import { Utils } from 'quasar'

export default {
  props: {
    handler: {
      type: Function,
      required: true
    },
    inline: {
      type: Boolean,
      default: false,
      coerce: function(value) {
        return !!value
      }
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
        windowHeight = this.scrollContainer.innerHeight(),
        containerBottom = this.scrollContainer.offset().top + windowHeight,
        triggerPosition = this.element.offset().top + this.element.height() - windowHeight

      if (triggerPosition < containerBottom) {
        this.index++
        this.refreshing = true
        this.handler(this.index, () => {
          this.refreshing = false
          this.scroll()
        })
      }
    }
  },
  ready () {
    this.scroll = Utils.debounce(this.scroll, 50)
    this.element = $(this.$els.content)

    this.scrollContainer = this.inline ? $(this.$el) : this.element.parents('.layout-content')
    if (this.scrollContainer.length === 0) {
      this.scrollContainer = $('#quasar-app')
    }
    this.scrollContainer.scroll(this.scroll)

    this.scroll()
  },
  destroy () {
    this.scrollContainer.off('scroll', this.scroll)
  }
}
</script>
