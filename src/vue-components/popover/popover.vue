<template>
  <div class="quasar-popover">
    <div
      v-el:target
      class="quasar-popover-target"
      @click="toggle"
    >
      <slot name="target"></slot>
    </div>
    <div
      v-el:content
      class="quasar-popover-content"
      :class="{active: active}"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Utils from '../../utils'
import EscapeKey from '../../escape-key'

const
  offset = 20,
  cssReset = {
    top: '',
    bottom: '',
    left: '',
    right: '',
    maxHeight: '',
    maxWidth: '',
    transformOrigin: ''
  }

export default {
  data () {
    return {
      active: false
    }
  },
  props: {
    touchPosition: {
      type: Boolean,
      default: false,
      coerce: Boolean
    }
  },
  methods: {
    toggle (event) {
      this[this.active ? 'close' : 'open'](event)
    },
    open (event) {
      if (this.active) {
        return
      }

      event.preventDefault()

      let
        content = this.$els.content,
        target = this.$els.target,
        position,
        css = Utils.extend({}, cssReset)

      // necessary to compute menu width and height
      content.classList.add('check')
      content.scrollTop = 0

      let
        viewport = Utils.dom.viewport(),
        windowWidth = viewport.width,
        windowHeight = viewport.height,
        contentWidth = Utils.dom.width(content),
        contentHeight = Utils.dom.height(content),
        targetWidth = Utils.dom.width(target),
        targetHeight = Utils.dom.height(target),
        targetPosition = this.$els.target.getBoundingClientRect()

      if (this.touchPosition) {
        let touchPosition = Utils.event.position(event)
        position = {
          top: touchPosition.top,
          left: touchPosition.left
        }
      }
      else {
        position = {
          top: targetPosition.top,
          left: targetPosition.left
        }
      }

      let
        toRight = position.left + contentWidth < windowWidth || 2 * position.left < windowWidth,
        toBottom = position.top + contentHeight < windowHeight || 2 * position.top < windowHeight

      content.classList.remove('check', 'left', 'right', 'bottom', 'top')

      if (!this.touchPosition) {
        if (!toBottom) {
          position.top += targetHeight
        }
        if (!toRight) {
          position.left += targetWidth
        }
      }

      if (toRight) {
        content.classList.add('left')
        css.left = position.left + 'px'
        if (windowWidth - position.left < contentWidth) {
          css.maxWidth = (windowWidth - position.left - offset) + 'px'
        }
      }
      else {
        content.classList.add('right')
        css.right = (windowWidth - position.left) + 'px'
        if (position.left < contentWidth) {
          css.maxWidth = (position.left - offset) + 'px'
        }
      }

      if (toBottom) {
        content.classList.add('top')
        css.top = position.top + 'px'
        if (windowHeight - position.top < contentHeight) {
          css.maxHeight = (windowHeight - position.top - offset) + 'px'
        }
      }
      else {
        content.classList.add('bottom')
        css.bottom = (windowHeight - position.top) + 'px'
        if (position.top < contentHeight) {
          css.maxHeight = (position.top - offset) + 'px'
        }
      }

      Utils.dom.css(content, css)
      this.active = true

      // give a little timeout so that click
      // event won't be triggered immediately
      setTimeout(() => {
        document.addEventListener('click', this.closeFromOutside)
        this.scrollContainer = this.$el.closest('.layout-view')
        if (!this.scrollContainer) {
          this.scrollContainer = document.getElementById('quasar-app')
        }
        this.scrollContainer.addEventListener('scroll', this.close)
        EscapeKey.register(() => { this.close() })
      }, 210)
    },
    close () {
      if (this.active) {
        this.active = false
        setTimeout(() => {
          Utils.dom.css(this.$els.content, cssReset)
        }, 200)

        this.scrollContainer.removeEventListener('scroll', this.close)
        document.removeEventListener('click', this.closeFromOutside)
        EscapeKey.pop()
      }
    },
    closeFromOutside () {
      if (!this.active || this.$els.content === event.target.closest('.quasar-popover-content')) {
        return
      }
      this.close()
    }
  },
  beforeDestroy () {
    if (this.active) {
      document.removeEventListener('click', this.closeFromOutside)
    }
  }
}
</script>
