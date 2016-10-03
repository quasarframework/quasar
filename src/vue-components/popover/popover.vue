<template>
  <span class="quasar-popover-target">
    <slot name="target"></slot>
    <div
      v-el:content
      class="quasar-popover-content"
      :class="{active: active}"
    >
      <slot></slot>
    </div>
  </span>
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
    minWidth: '',
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
    },
    disable: {
      type: Boolean,
      default: false,
      coerce: Boolean
    },
    position: String,
    cover: {
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
      if (this.disable || this.active || this.inProgress) {
        return
      }

      event.preventDefault()

      let
        content = this.$els.content,
        target = this.$el.children[0],
        targetWidth = Utils.dom.width(target),
        targetHeight = Utils.dom.height(target),
        targetPosition = target.getBoundingClientRect(),
        position,
        css = Utils.extend({}, cssReset)

      if (this.cover) {
        css.minWidth = targetWidth + 'px'
      }
      Utils.dom.css(content, css)

      // necessary to compute menu width and height
      content.classList.add('check')
      content.scrollTop = 0

      let
        viewport = Utils.dom.viewport(),
        windowWidth = viewport.width,
        windowHeight = viewport.height,
        contentWidth = Utils.dom.width(content),
        contentHeight = Utils.dom.height(content)

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

      if (this.position) {
        let position = this.position.split(' ')

        if (position.includes('left')) {
          toRight = false
        }
        else if (position.includes('right')) {
          toRight = true
        }

        if (position.includes('top')) {
          toBottom = false
        }
        else if (position.includes('bottom')) {
          toBottom = true
        }
      }

      if (this.touchPosition) {
        if (!toRight) {
          position.left -= contentWidth
        }
      }
      else {
        if (!toBottom) {
          position.top += targetHeight
        }
        if (!toRight) {
          position.left += targetWidth - contentWidth
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
        css.left = position.left + 'px'
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
      this.inProgress = true

      // give a little timeout so that click
      // event won't be triggered immediately
      setTimeout(() => {
        document.addEventListener('click', this.closeFromOutside)
        this.scrollTarget = Utils.dom.getScrollTarget(target)
        this.scrollTarget.addEventListener('scroll', this.close)
        EscapeKey.register(() => { this.close() })
        this.inProgress = false
      }, 210)
    },
    close () {
      if (this.active && !this.inProgress) {
        this.active = false
        this.inProgress = true
        setTimeout(() => {
          if (this.$els.content) {
            Utils.dom.css(this.$els.content, cssReset)
          }
          this.inProgress = false
        }, 200)

        if (this.scrollTarget) {
          this.scrollTarget.removeEventListener('scroll', this.close)
          this.scrollTarget = null
        }
        document.removeEventListener('click', this.closeFromOutside)
        EscapeKey.pop()
      }
    },
    closeFromOutside (event) {
      if (!this.active || this.$els.content === event.target.closest('.quasar-popover-content')) {
        return
      }
      this.close()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$el.children[0].addEventListener('click', this.toggle)
    })
  },
  beforeDestroy () {
    this.$el.children[0].removeEventListener('click', this.toggle)
    if (this.active) {
      this.close()
    }
  }
}
</script>
