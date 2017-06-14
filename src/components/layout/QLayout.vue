<template>
  <div class="layout">
    <div
      v-if="!$q.platform.is.ios && $slots.left && !leftState.openedSmall && !leftOnLayout"
      class="layout-side-opener fixed-left"
      v-touch-pan.horizontal="__openLeftByTouch"
    ></div>
    <div
      v-if="!$q.platform.is.ios && $slots.right && !rightState.openedSmall && !rightOnLayout"
      class="layout-side-opener fixed-right"
      v-touch-pan.horizontal="__openRightByTouch"
    ></div>
    <div
      v-if="$slots.left || $slots.right"
      ref="backdrop"
      class="fullscreen layout-backdrop"
      :class="{
        'transition-generic': !backdrop.inTransit,
        'no-pointer-events': hideBackdrop,
      }"
      :style="{
        opacity: backdrop.percentage,
        hidden: hideBackdrop
      }"
      @click="__hide"
      v-touch-pan.horizontal="__closeByTouch"
    ></div>

    <aside
      v-if="$slots.left"
      class="layout-aside layout-aside-left scroll"
      :class="computedLeftClass"
      :style="computedLeftStyle"
      v-touch-pan.horizontal="__closeLeftByTouch"
    >
      <slot name="left"></slot>
      <q-resize-observable @resize="onLeftAsideResize"></q-resize-observable>
    </aside>

    <aside
      v-if="$slots.right"
      class="layout-aside layout-aside-right scroll"
      :class="computedRightClass"
      :style="computedRightStyle"
      v-touch-pan.horizontal="__closeRightByTouch"
    >
      <slot name="right"></slot>
      <q-resize-observable @resize="onRightAsideResize"></q-resize-observable>
    </aside>

    <header
      ref="header"
      v-if="$slots.header || ($q.theme !== 'ios' && $slots.navigation)"
      class="layout-header transition-generic"
      :class="computedHeaderClass"
      :style="computedHeaderStyle"
    >
      <slot name="header"></slot>
      <slot v-if="$q.theme !== 'ios'" name="navigation"></slot>
      <q-resize-observable @resize="onHeaderResize"></q-resize-observable>
    </header>

    <div class="layout-page-container transition-generic" ref="main" :style="computedPageStyle">
      <main class="layout-page" :style="mainStyle" :class="pageClass">
        <slot></slot>
      </main>
    </div>

    <footer
      ref="footer"
      v-if="$slots.footer || ($q.theme === 'ios' && $slots.navigation)"
      class="layout-footer transition-generic"
      :class="computedFooterClass"
      :style="computedFooterStyle"
    >
      <slot name="footer"></slot>
      <slot v-if="$q.theme === 'ios'" name="navigation"></slot>
      <q-resize-observable @resize="onFooterResize"></q-resize-observable>
    </footer>

    <q-scroll-observable @scroll="onPageScroll"></q-scroll-observable>
    <q-resize-observable @resize="onLayoutResize"></q-resize-observable>
    <q-window-resize-observable @resize="onWindowResize"></q-window-resize-observable>
  </div>
</template>

<script>
import extend from '../../utils/extend'
import { cssTransform } from '../../utils/dom'
import { getScrollHeight } from '../../utils/scroll'
import SideMixin from './side-mixin'
import TouchPan from '../../directives/touch-pan'
import { QResizeObservable, QWindowResizeObservable, QScrollObservable } from '../observables'

function updateSize (obj, size) {
  if (obj.w !== size.width) {
    obj.w = size.width
  }
  if (obj.h !== size.height) {
    obj.h = size.height
  }
}

function updateObject (obj, data) {
  Object.keys(data).forEach(key => {
    if (obj[key] !== data[key]) {
      obj[key] = data[key]
    }
  })
}

export default {
  name: 'q-layout',
  components: {
    QResizeObservable,
    QWindowResizeObservable,
    QScrollObservable
  },
  directives: {
    TouchPan
  },
  mixins: [SideMixin],
  model: {
    prop: 'sides'
  },
  props: {
    sides: {
      type: Object,
      validator: v => 'left' in v && 'right' in v,
      default () {
        return {
          left: true,
          right: true
        }
      }
    },
    view: {
      type: String,
      default: 'hhh lpr fff',
      validator: v => /^(h|l)h(h|r) lpr (f|l)f(f|r)$/.test(v.toLowerCase())
    },
    reveal: Boolean,

    leftBreakpoint: {
      type: Number,
      default: 996
    },
    leftStyle: Object,
    leftClass: Object,

    rightBreakpoint: {
      type: Number,
      default: 996
    },
    rightStyle: Object,
    rightClass: Object,

    headerStyle: Object,
    headerClass: Object,

    footerStyle: Object,
    footerClass: Object,

    pageStyle: Object,
    pageClass: Object
  },
  data () {
    return {
      headerOnScreen: true,

      header: {h: 0, w: 0},
      left: {h: 0, w: 0},
      right: {h: 0, w: 0},
      footer: {h: 0, w: 0},
      layout: {h: 0, w: 0},

      scroll: {
        position: 0,
        direction: '',
        directionChanged: false,
        inflexionPosition: 0,
        scrollHeight: 0
      },

      backdrop: {
        inTransit: false,
        touchEvent: false,
        percentage: 0
      },

      leftState: {
        position: 0,
        inTransit: false,
        openedSmall: false,
        openedBig: this.sides.left
      },
      rightState: {
        position: 0,
        inTransit: false,
        openedSmall: false,
        openedBig: this.sides.right
      }
    }
  },
  provide () {
    return {
      layout: this
    }
  },
  watch: {
    sides: {
      deep: true,
      handler (val) {
        if (val.left !== this.leftState.openedBig) {
          this.leftState.openedBig = val.left
        }
        if (val.right !== this.rightState.openedBig) {
          this.rightState.openedBig = val.right
        }
      }
    },
    'leftState.openedBig' (v) {
      this.$emit('input', {
        left: v,
        right: this.rightState.openedBig
      })
    },
    'rightState.openedBig' (v) {
      this.$emit('input', {
        left: this.leftState.openedBig,
        right: v
      })
    },
    leftOverBreakpoint (v) {
      this.$emit('left-breakpoint', v)
    },
    rightOverBreakpoint (v) {
      this.$emit('right-breakpoint', v)
    }
  },
  computed: {
    leftOverBreakpoint () {
      return !this.leftState.openedSmall && this.layout.w >= this.leftBreakpoint
    },
    leftOnLayout () {
      return this.leftOverBreakpoint && this.leftState.openedBig
    },
    rightOverBreakpoint () {
      return !this.rightState.openedSmall && this.layout.w >= this.rightBreakpoint
    },
    rightOnLayout () {
      return this.rightOverBreakpoint && this.rightState.openedBig
    },
    hideBackdrop () {
      return !this.backdrop.inTransit && !this.leftState.openedSmall && !this.rightState.openedSmall
    },
    fixed () {
      return {
        header: this.reveal || this.view.indexOf('H') > -1,
        footer: this.view.indexOf('F') > -1,
        left: this.view.indexOf('L') > -1,
        right: this.view.indexOf('R') > -1
      }
    },
    rows () {
      const rows = this.view.toLowerCase().split(' ')
      return {
        top: rows[0].split(''),
        middle: rows[1].split(''),
        bottom: rows[2].split('')
      }
    },
    computedPageStyle () {
      const
        view = this.rows,
        css = {}

      if (!view.top.includes('p') && this.fixed.header) {
        css.paddingTop = this.header.h + 'px'
      }
      if (!view.bottom.includes('p') && this.fixed.footer) {
        css.paddingBottom = this.footer.h + 'px'
      }
      if (view.middle[0] !== 'p' && this.leftOnLayout) {
        css.paddingLeft = this.left.w + 'px'
      }
      if (view.middle[2] !== 'p' && this.rightOnLayout) {
        css.paddingRight = this.right.w + 'px'
      }

      return css
    },
    mainStyle () {
      const css = {
        minHeight: `calc(100vh - ${this.header.h + this.footer.h}px)`
      }

      return this.pageStyle
        ? extend({}, this.pageStyle, css)
        : css
    },
    showHeader () {
      return this.headerOnScreen || !this.reveal
    },
    computedHeaderStyle () {
      const
        view = this.rows,
        css = this.showHeader
          ? {}
          : cssTransform(`translateY(${-this.header.h}px)`)

      if (view.top[0] === 'l' && this.leftOnLayout) {
        css.marginLeft = this.left.w + 'px'
      }
      if (view.top[2] === 'r' && this.rightOnLayout) {
        css.marginRight = this.right.w + 'px'
      }

      return this.headerStyle
        ? extend({}, this.headerStyle, css)
        : css
    },
    computedFooterStyle () {
      const
        view = this.rows,
        css = {}

      if (view.bottom[0] === 'l' && this.leftOnLayout) {
        css.marginLeft = this.left.w + 'px'
      }
      if (view.bottom[2] === 'r' && this.rightOnLayout) {
        css.marginRight = this.right.w + 'px'
      }

      return this.footerStyle
        ? extend({}, this.footerStyle, css)
        : css
    },
    computedLeftClass () {
      const classes = {
        'fixed': this.fixed.left || !this.leftOnLayout,
        'on-top': !this.leftOverBreakpoint || this.leftState.inTransit,
        'transition-generic': !this.leftState.inTransit,
        'top-padding': this.fixed.left || this.rows.top[0] === 'l'
      }

      return this.leftClass
        ? extend({}, this.leftClass, classes)
        : classes
    },
    computedRightClass () {
      const classes = {
        'fixed': this.fixed.right || !this.rightOnLayout,
        'on-top': !this.rightOverBreakpoint || this.rightState.inTransit,
        'transition-generic': !this.rightState.inTransit,
        'top-padding': this.fixed.right || this.rows.top[2] === 'r'
      }

      return this.rightClass
        ? extend({}, this.rightClass, classes)
        : classes
    },
    computedHeaderClass () {
      const classes = {'fixed-top': this.fixed.header}
      return this.headerClass
        ? extend({}, this.headerClass, classes)
        : classes
    },
    computedFooterClass () {
      const classes = {'fixed-bottom': this.fixed.footer}
      return this.footerClass
        ? extend({}, this.footerClass, classes)
        : classes
    },
    offsetTop () {
      return !this.fixed.header
        ? this.header.h - this.scroll.position
        : 0
    },
    offsetBottom () {
      if (!this.fixed.footer) {
        let translate = this.scroll.scrollHeight - this.layout.h - this.scroll.position - this.footer.h
        if (translate < 0) {
          return translate
        }
      }
    },
    computedLeftStyle () {
      if (!this.leftOnLayout) {
        const style = this.leftState.inTransit
          ? cssTransform(`translateX(${this.leftState.position}px)`)
          : cssTransform(`translateX(${this.leftState.openedSmall ? 0 : '-100%'})`)

        return this.leftStyle
          ? extend({}, this.leftStyle, style)
          : style
      }

      const
        view = this.rows,
        css = {}

      if (view.top[0] !== 'l') {
        if (this.fixed.left && this.offsetTop) {
          css.top = Math.max(0, this.offsetTop) + 'px'
        }
        else if (this.showHeader) {
          css.top = this.header.h + 'px'
        }
      }
      if (view.bottom[0] !== 'l') {
        if (this.fixed.footer || !this.fixed.left) {
          css.bottom = this.footer.h + 'px'
        }
        else if (this.offsetBottom) {
          css.bottom = -this.offsetBottom + 'px'
        }
      }

      return this.leftStyle
        ? extend({}, this.leftStyle, css)
        : css
    },
    computedRightStyle () {
      if (!this.rightOnLayout) {
        const style = this.rightState.inTransit
          ? cssTransform(`translateX(${this.rightState.position}px)`)
          : cssTransform(`translateX(${this.rightState.openedSmall ? 0 : '100%'})`)

        return this.rightStyle
          ? extend({}, this.rightStyle, style)
          : style
      }

      const
        view = this.rows,
        css = {}

      if (view.top[2] !== 'r') {
        if (this.fixed.right && this.offsetTop) {
          css.top = Math.max(0, this.offsetTop) + 'px'
        }
        else if (this.showHeader) {
          css.top = this.header.h + 'px'
        }
      }
      if (view.bottom[2] !== 'r') {
        if (this.fixed.footer || !this.fixed.right) {
          css.bottom = this.footer.h + 'px'
        }
        else if (this.offsetBottom) {
          css.bottom = -this.offsetBottom + 'px'
        }
      }

      return this.rightStyle
        ? extend({}, this.rightStyle, css)
        : css
    }
  },
  methods: {
    onHeaderResize (size) {
      updateSize(this.header, size)
    },
    onFooterResize (size) {
      updateSize(this.footer, size)
    },
    onLeftAsideResize (size) {
      updateSize(this.left, size)
    },
    onRightAsideResize (size) {
      updateSize(this.right, size)
    },
    onLayoutResize () {
      updateObject(this.scroll, {scrollHeight: getScrollHeight(this.$el)})
    },
    onWindowResize (size) {
      updateSize(this.layout, size)
      this.$emit('resize', size)
    },
    onPageScroll (data) {
      updateObject(this.scroll, data)

      if (this.reveal) {
        const visible = !(
          data.position > this.header.h &&
          data.direction === 'down' && data.position - data.inflexionPosition >= 100
        )

        if (this.headerOnScreen !== visible) {
          this.headerOnScreen = visible
        }
      }

      this.$emit('scroll', data)
    }
  }
}
</script>
