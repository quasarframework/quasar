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

const
  offset = 20,
  cssReset = {
    top: '',
    right: '',
    bottom: '',
    left: '',
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
        relativePosition,
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
        position = Utils.event.position(event)
        relativePosition = {
          top: position.top - targetPosition.top,
          left: position.left - targetPosition.left
        }
      }
      else {
        position = {
          top: targetPosition.top + targetHeight / 2,
          left: targetPosition.left + targetWidth / 2
        }
      }

      let
        toRight = position.left + contentWidth < windowWidth || 2 * position.left < windowWidth,
        toBottom = position.top + contentHeight < windowHeight || 2 * position.top < windowHeight

      content.classList.remove('check', 'left', 'right', 'bottom', 'top')

      if (!this.touchPosition) {
        relativePosition = {
          top: toBottom ? 0 : targetHeight,
          left: toRight ? 0 : targetWidth
        }
      }

      if (toRight) {
        css.left = relativePosition.left + 'px'
        content.classList.add('left')
        if (windowWidth - position.left < contentWidth) {
          css.maxWidth = windowWidth - position.left - offset + 'px'
        }
      }
      else {
        css.right = (targetWidth - relativePosition.left) + 'px'
        content.classList.add('right')
        if (position.left < contentWidth) {
          css.maxWidth = position.left - offset + 'px'
        }
      }

      if (toBottom) {
        content.classList.add('top')
        css.top = relativePosition.top + 'px'
        if (windowHeight - position.top < contentHeight) {
          css.maxHeight = windowHeight - position.top - offset + 'px'
        }
      }
      else {
        content.classList.add('bottom')
        css.bottom = (targetHeight - relativePosition.top) + 'px'
        if (position.top < contentHeight) {
          css.maxHeight = position.top - offset + 'px'
        }
      }

      Utils.dom.css(content, css)
      this.active = true

      // give a little timeout so that click
      // event won't be triggered immediately
      setTimeout(() => {
        document.addEventListener('click', this.closeFromOutside)
      }, 210)
    },
    close (event) {
      if (this.active) {
        this.active = false
        document.removeEventListener('click', this.closeFromOutside)
        setTimeout(() => {
          Utils.dom.css(this.$els.content, cssReset)
        }, 200)
      }
    },
    closeFromOutside (event) {
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
