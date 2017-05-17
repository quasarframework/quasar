<template>
  <div class="z-fixed" :class="[`fixed-${corner}`]" :style="style">
    <slot></slot>
  </div>
</template>

<script>
import extend from '../../utils/extend'
import { cssTransform } from '../../utils/dom'

const sides = ['top', 'right', 'bottom', 'left']

export default {
  name: 'q-fixed-position',
  props: {
    corner: {
      type: String,
      default: 'bottom-right',
      validator: v => ['top-right', 'top-left', 'bottom-right', 'bottom-left'].includes(v)
    },
    offset: {
      type: Object,
      default: () => ({})
    }
  },
  inject: ['layout'],
  computed: {
    animated () {
      return this.pos.top && this.layout.reveal
    },
    pos () {
      return {
        top: this.corner.indexOf('top') > -1,
        right: this.corner.indexOf('right') > -1,
        bottom: this.corner.indexOf('bottom') > -1,
        left: this.corner.indexOf('left') > -1
      }
    },
    style () {
      const
        css = extend({}, this.offset),
        layout = this.layout,
        page = layout.computedPageStyle

      if (this.animated && !layout.showHeader) {
        extend(css, cssTransform(`translateY(${-layout.header.h}px)`))
      }
      else if (this.pos.top && layout.offsetTop) {
        if (layout.offsetTop > 0) {
          extend(css, cssTransform(`translateY(${layout.offsetTop}px)`))
        }
      }
      else if (this.pos.bottom && layout.offsetBottom) {
        extend(css, cssTransform(`translateY(${layout.offsetBottom}px)`))
      }

      sides.forEach(side => {
        let prop = `padding${side.charAt(0).toUpperCase() + side.slice(1)}`
        if (this.pos[side] && page[prop]) {
          css[side] = css[side] ? `calc(${page[prop]} + ${css[side]})` : page[prop]
        }
      })

      return css
    }
  }
}
</script>
