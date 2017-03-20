<template>
  <div class="z-fixed animate-pop" :class="className" :style="style">
    <slot></slot>
  </div>
</template>

<script>
import extend from '../../utils/extend'
import { cssTransform } from '../../utils/dom'

export default {
  props: {
    corner: {
      type: String,
      required: true,
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
    className () {
      return `fixed${this.corner ? `-${this.corner}` : ''}${this.animated ? ' transition-generic' : ''}`
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
        page = this.layout.pageStyle,
        size = this.layout.size

      if (this.animated && !this.layout.showHeader) {
        extend(css, cssTransform(`translateY(${-size.header.height}px)`))
      }
      else if (this.pos.top && this.layout.offsetTop) {
        if (this.layout.offsetTop > 0) {
          extend(css, cssTransform(`translateY(${this.layout.offsetTop}px)`))
        }
      }
      else if (this.pos.bottom && this.layout.offsetBottom) {
        extend(css, cssTransform(`translateY(${this.layout.offsetBottom}px)`))
      }

      if (this.pos.top && page.marginTop) {
        css.top = css.top ? `calc(${page.marginTop} + ${css.top})` : page.marginTop
      }
      if (this.pos.right && page.marginRight) {
        css.right = css.right ? `calc(${page.marginRight} + ${css.right})` : page.marginRight
      }
      if (this.pos.bottom && page.marginBottom) {
        css.bottom = css.bottom ? `calc(${page.marginBottom} + ${css.bottom})` : page.marginBottom
      }
      if (this.pos.left && page.marginLeft) {
        css.left = css.left ? `calc(${page.marginLeft} + ${css.left})` : page.marginLeft
      }

      return css
    }
  }
}
</script>
