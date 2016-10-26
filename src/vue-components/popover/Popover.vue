<template>
  <div
    class="quasar-popover animate-scale"
    @click.stop
    :style="transformOrigin"
  >
    <slot></slot>
  </div>
</template>

<script>
// heavily inspired by http://www.material-ui.com/#/components/popover

import Utils from '../../utils'
import EscapeKey from '../../escape-key'

function getAnchorPosition (el) {
  const
    rect = el.getBoundingClientRect(),
    a = {
      top: rect.top,
      left: rect.left,
      width: el.offsetWidth,
      height: el.offsetHeight
    }

  a.right = rect.right || a.left + a.width
  a.bottom = rect.bottom || a.top + a.height
  a.middle = a.left + ((a.right - a.left) / 2)
  a.center = a.top + ((a.bottom - a.top) / 2)

  return a
}

function getTargetPosition (el) {
  return {
    top: 0,
    center: el.offsetHeight / 2,
    bottom: el.offsetHeight,
    left: 0,
    middle: el.offsetWidth / 2,
    right: el.offsetWidth
  }
}

function getOverlapMode (anchor, target, median) {
  if ([anchor, target].indexOf(median) >= 0) return 'auto'
  if (anchor === target) return 'inclusive'
  return 'exclusive'
}

function getPositions (anchor, target) {
  const
    a = Utils.extend({}, anchor),
    t = Utils.extend({}, target)

  const positions = {
    x: ['left', 'right'].filter(p => p !== t.horizontal),
    y: ['top', 'bottom'].filter(p => p !== t.vertical)
  }

  const overlap = {
    x: getOverlapMode(a.horizontal, t.horizontal, 'middle'),
    y: getOverlapMode(a.vertical, t.vertical, 'center')
  }

  positions.x.splice(overlap.x === 'auto' ? 0 : 1, 0, 'middle')
  positions.y.splice(overlap.y === 'auto' ? 0 : 1, 0, 'center')

  if (overlap.y !== 'auto') {
    a.vertical = a.vertical === 'top' ? 'bottom' : 'top'
    if (overlap.y === 'inclusive') {
      t.vertical = t.vertical
    }
  }

  if (overlap.x !== 'auto') {
    a.horizontal = a.horizontal === 'left' ? 'right' : 'left'
    if (overlap.y === 'inclusive') {
      t.horizontal = t.horizontal
    }
  }

  return {
    positions: positions,
    anchorPos: a
  }
}

function applyAutoPositionIfNeeded (anchor, target, targetOrigin, anchorOrigin, targetPosition) {
  const {positions, anchorPos} = getPositions(anchorOrigin, targetOrigin)

  if (targetPosition.top < 0 || targetPosition.top + target.bottom > window.innerHeight) {
    let newTop = anchor[anchorPos.vertical] - target[positions.y[0]]
    if (newTop + target.bottom <= window.innerHeight) {
      targetPosition.top = Math.max(0, newTop)
    }
    else {
      newTop = anchor[anchorPos.vertical] - target[positions.y[1]]
      if (newTop + target.bottom <= window.innerHeight) {
        targetPosition.top = Math.max(0, newTop)
      }
    }
  }
  if (targetPosition.left < 0 || targetPosition.left + target.right > window.innerWidth) {
    let newLeft = anchor[anchorPos.horizontal] - target[positions.x[0]]
    if (newLeft + target.right <= window.innerWidth) {
      targetPosition.left = Math.max(0, newLeft)
    }
    else {
      newLeft = anchor[anchorPos.horizontal] - target[positions.x[1]]
      if (newLeft + target.right <= window.innerWidth) {
        targetPosition.left = Math.max(0, newLeft)
      }
    }
  }
  return targetPosition
}

function parseHorizTransformOrigin (pos) {
  return pos === 'middle' ? 'center' : pos
}

export default {
  props: {
    anchorOrigin: {
      type: Object,
      default () {
        return {vertical: 'bottom', horizontal: 'left'}
      }
    },
    targetOrigin: {
      type: Object,
      default () {
        return {vertical: 'top', horizontal: 'left'}
      }
    },
    maxHeight: String,
    touchPosition: Boolean,
    anchorClick: {
      /*
        for handling anchor outside of Popover
        example: context menu component
      */
      type: Boolean,
      default: true
    },
    disable: Boolean
  },
  data () {
    return {
      opened: false,
      progress: false
    }
  },
  computed: {
    transformOrigin () {
      let
        vert = this.targetOrigin.vertical,
        horiz = parseHorizTransformOrigin(this.targetOrigin.horizontal)

      return {
        'transform-origin': vert + ' ' + horiz + ' 0px'
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.anchorEl = this.$el.parentNode
      this.anchorEl.removeChild(this.$el)
      if (this.anchorClick) {
        this.anchorEl.classList.add('cursor-pointer')
        this.anchorEl.addEventListener('click', this.toggle)
      }
    })
  },
  beforeDestroy () {
    if (this.anchorClick) {
      this.anchorEl.removeEventListener('click', this.toggle)
    }
    this.close()
  },
  methods: {
    toggle (event) {
      if (this.opened) {
        this.close()
      }
      else {
        this.open(event)
      }
    },
    open (event) {
      if (this.disable || this.opened) {
        return
      }
      if (event) {
        event.stopPropagation()
        event.preventDefault()
      }

      this.opened = true
      document.body.click() // close other Popovers
      document.body.appendChild(this.$el)
      EscapeKey.register(() => { this.close() })
      this.scrollTarget = Utils.dom.getScrollTarget(this.anchorEl)
      this.scrollTarget.addEventListener('scroll', this.close)
      document.addEventListener('click', this.close)
      this.$nextTick(() => {
        this.__updatePosition(event)
        this.$emit('open')
      })
    },
    close () {
      if (!this.opened || this.progress) {
        return
      }
      document.removeEventListener('click', this.close)
      this.scrollTarget.removeEventListener('scroll', this.close)
      EscapeKey.pop()
      this.progress = true

      /*
        Using setTimeout to allow
        v-models to take effect
      */
      setTimeout(() => {
        this.opened = false
        this.progress = false
        document.body.removeChild(this.$el)
        this.$emit('close')
      }, 1)
    },
    __updatePosition (event) {
      let anchor
      const
        el = this.$el,
        targetOrigin = this.targetOrigin,
        anchorOrigin = this.anchorOrigin

      if (event && (!this.anchorClick || this.touchPosition)) {
        const {top, left} = Utils.event.position(event)
        anchor = {top, left, width: 1, height: 1, right: left + 1, center: top, middle: left, bottom: top + 1}
      }
      else {
        anchor = getAnchorPosition(this.anchorEl)
      }

      let target = getTargetPosition(el)
      let targetPosition = {
        top: anchor[anchorOrigin.vertical] - target[targetOrigin.vertical],
        left: anchor[anchorOrigin.horizontal] - target[targetOrigin.horizontal]
      }

      targetPosition = applyAutoPositionIfNeeded(anchor, target, targetOrigin, anchorOrigin, targetPosition)

      el.style.top = Math.max(0, targetPosition.top) + 'px'
      el.style.left = Math.max(0, targetPosition.left) + 'px'
      el.style.maxHeight = this.maxHeight || window.innerHeight * 0.9 + 'px'
    }
  }
}
</script>
