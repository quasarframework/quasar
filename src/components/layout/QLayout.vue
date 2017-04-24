<template>
  <div class="layout">
    <div
      v-if="!$q.platform.is.ios && $slots.left && !leftState.openedSmall"
      class="layout-side-opener fixed-left"
      v-touch-pan.horizontal="__openLeftByTouch"
    ></div>
    <div
      v-if="!$q.platform.is.ios && $slots.right && !rightState.openedSmall"
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
      ref="left"
      class="layout-aside layout-aside-left"
      :class="{
        'fixed': fixed.left || !leftOnLayout,
        'on-top': !leftOverBreakpoint,
        'transition-generic': !leftInTransit,
        'top-padding': fixed.left || rows.top[0] === 'l'
      }"
      :style="leftStyle"
      v-touch-pan.horizontal="__closeByTouch"
    >
      <slot name="left"></slot>
      <q-resize-observable
        v-if="$slots.left"
        @resize="onLeftAsideResize"
      ></q-resize-observable>
    </aside>

    <aside
      ref="right"
      class="layout-aside layout-aside-right"
      :class="{
        'fixed': fixed.right || !rightOnLayout,
        'on-top': !rightOverBreakpoint,
        'transition-generic': !rightInTransit,
        'top-padding': fixed.right || rows.top[2] === 'r'
      }"
      :style="rightStyle"
      v-touch-pan.horizontal="__closeByTouch"
    >
      <slot name="right"></slot>
      <q-resize-observable
        v-if="$slots.right"
        @resize="onRightAsideResize"
      ></q-resize-observable>
    </aside>

    <header
      ref="header"
      v-if="$slots.header || ($q.theme !== 'ios' && $slots.navigation)"
      class="layout-header"
      :class="{'fixed-top': fixed.header}"
      :style="headerStyle"
    >
      <slot name="header"></slot>
      <slot v-if="$q.theme !== 'ios'" name="navigation"></slot>
      <q-resize-observable @resize="onHeaderResize"></q-resize-observable>
    </header>

    <div ref="main" :style="pageStyle">
      <main :style="mainStyle">
        <slot></slot>
      </main>
    </div>

    <footer
      ref="footer"
      v-if="$slots.footer || ($q.theme === 'ios' && $slots.navigation)"
      class="layout-footer"
      :class="{'fixed-bottom': fixed.footer}"
      :style="footerStyle"
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
      validator: v => /^(h|H|L|l)(h|H)(h|H|R|r) (L|l|p)p(R|r|p) (f|F|L|l)(f|F)(f|F|R|r)$/.test(v)
    },
    reveal: Boolean,
    leftBreakpoint: {
      type: Number,
      default: 996
    },
    rightBreakpoint: {
      type: Number,
      default: 996
    }
  },
  data () {
    return {
      headerOnScreen: true,
      leftInTransit: false,
      rightInTransit: false,

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
        openedSmall: false,
        openedBig: this.sides.left
      },
      rightState: {
        position: 0,
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
    pageStyle () {
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
      return {
        minHeight: `calc(100vh - ${this.header.h + this.footer.h}px)`
      }
    },
    showHeader () {
      return this.headerOnScreen || !this.reveal
    },
    headerStyle () {
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

      return css
    },
    footerStyle () {
      const
        view = this.rows,
        css = {}

      if (view.bottom[0] === 'l' && this.leftOnLayout) {
        css.marginLeft = this.left.w + 'px'
      }
      if (view.bottom[2] === 'r' && this.rightOnLayout) {
        css.marginRight = this.right.w + 'px'
      }

      return css
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
    leftStyle () {
      if (!this.leftOnLayout) {
        return this.leftInTransit
          ? cssTransform(`translateX(${this.leftState.position}px)`)
          : cssTransform(`translateX(${this.leftState.openedSmall ? 0 : '-100%'})`)
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

      return css
    },
    rightStyle () {
      if (!this.rightOnLayout) {
        return this.rightInTransit
          ? cssTransform(`translateX(${this.rightState.position}px)`)
          : cssTransform(`translateX(${this.rightState.openedSmall ? 0 : '100%'})`)
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

      return css
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
    }
  }
}
</script>
