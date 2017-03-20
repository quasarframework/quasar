<template>
  <div class="z-marginals animate-pop" :class="className" :style="style">
    <slot></slot>
  </div>
</template>

<script>
import extend from '../../utils/extend'
import { viewport, cssTransform } from '../../utils/dom'

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
      if (!this.pos.top && !this.pos.right && !this.pos.bottom && !this.pos.left) {
        return
      }

      const
        css = extend({}, this.offset),
        page = this.layout.pageStyle,
        scroll = this.layout.scroll,
        fixed = this.layout.fixed,
        size = this.layout.size

      if (this.animated && !this.layout.showHeader) {
        extend(css, cssTransform(`translateY(${-size.header.height}px)`))
      }
      else if (!fixed.header && this.pos.top) {
        let translate = scroll.position - size.header.height
        if (translate < 0) {
          extend(css, cssTransform(`translateY(${-translate}px)`))
        }
      }
      else if (!fixed.footer && this.pos.bottom) {
        let translate = scroll.scrollHeight - viewport().height - scroll.position - size.footer.height
        if (translate < 0) {
          extend(css, cssTransform(`translateY(${translate}px)`))
        }
      }

      if (this.pos.top && page.marginTop) {
        css.top = css.top ? `calc(${page.marginTop} + ${css.top || 0})` : page.marginTop
      }
      if (this.pos.right && page.marginRight) {
        css.right = css.right ? `calc(${page.marginRight} + ${css.right || 0})` : page.marginRight
      }
      if (this.pos.bottom && page.marginBottom) {
        css.bottom = css.bottom ? `calc(${page.marginBottom} + ${css.bottom || 0})` : page.marginBottom
      }
      if (this.pos.left && page.marginLeft) {
        css.left = css.left ? `calc(${page.marginLeft} + ${css.left || 0})` : page.marginLeft
      }

      return css
    }
  },
  mounted () {
    this.layout.scrollNeeded++
  },
  beforeDestroy () {
    this.layout.scrollNeeded--
  }
}
</script>
