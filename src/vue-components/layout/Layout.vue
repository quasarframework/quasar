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
      v-if="$slots.left"
      class="layout-aside layout-aside-left"
      :class="{
        'fixed': fixed.left || !leftOnLayout,
        'on-top': !leftBreakpoint,
        'transition-generic': !leftInTransit
      }"
      :style="leftStyle"
      v-touch-pan.horizontal="__closeByTouch"
    >
      <slot name="left"></slot>
      <q-resize-observable @resize="onLeftAsideResize" />
    </aside>

    <aside
      ref="right"
      v-if="$slots.right"
      class="layout-aside layout-aside-right"
      :class="{
        'fixed': fixed.right || !rightOnLayout,
        'on-top': !rightBreakpoint,
        'transition-generic': !rightInTransit
      }"
      :style="rightStyle"
      v-touch-pan.horizontal="__closeByTouch"
    >
      <slot name="right"></slot>
      <q-resize-observable @resize="onRightAsideResize" />
    </aside>

    <header
      ref="header"
      v-if="$slots.header || ($q.theme !== 'ios' && $slots.navigation)"
      class="layout-header"
      :class="{'fixed-top': fixed.header}"
      :style="headerStyle"
    >
      <div class="row justify-center">
        <q-btn class="white text-black" @click="toggleLeft">Toggle Left</q-btn>
        <q-btn class="white text-black" @click="toggleRight">Toggle Right</q-btn>
      </div>
      <slot name="header"></slot>
      <slot v-if="$q.theme !== 'ios'" name="navigation"></slot>
      <q-resize-observable @resize="onHeaderResize" />
    </header>

    <div ref="main" :style="pageStyle">
      <main :style="mainStyle">
        <slot></slot>
      </main>
    </div>

    <footer
      ref="footer"
      v-if="$slots.header || ($q.theme === 'ios' && $slots.navigation)"
      class="layout-footer"
      :class="{'fixed-bottom': fixed.footer}"
      :style="footerStyle"
    >
      <slot name="footer"></slot>
      <slot v-if="$q.theme === 'ios'" name="navigation"></slot>
      <q-resize-observable @resize="onFooterResize" />
    </footer>

    <q-scroll-observable @scroll="onPageScroll" />
    <q-resize-observable @resize="onLayoutResize" />
    <q-window-resize-observable @resize="onWindowResize" />
  </div>
</template>

<script>
import { cssTransform } from '../../utils/dom'
import { getScrollHeight } from '../../utils/scroll'
import SideMixin from './side-mixin'

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
  mixins: [SideMixin],
  props: {
    view: {
      type: String,
      default: 'hhh lpr fff',
      validator: v => /^(h|H|L|l)(h|H)(h|H|R|r) (L|l|p)p(R|r|p) (f|F|L|l)(f|F)(f|F|R|r)$/.test(v)
    },
    reveal: Boolean,
    leftSide: {
      type: Object,
      default: () => ({})
    },
    rightSide: {
      type: Object,
      default: () => ({})
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
        openedBig: 'showDefault' in this.leftSide
          ? this.leftSide.hideOnStart
          : true
      },
      rightState: {
        position: 0,
        openedSmall: false,
        openedBig: 'showDefault' in this.rightSide
          ? this.rightSide.hideOnStart
          : true
      }
    }
  },
  provide () {
    return {
      layout: this
    }
  },
  computed: {
    leftBreakpoint () {
      const breakpoint = this.leftSide.breakpoint || 996
      return !this.leftState.openedSmall && this.layout.w >= breakpoint
    },
    leftOnLayout () {
      return this.leftBreakpoint && this.leftState.openedBig
    },
    rightBreakpoint () {
      const breakpoint = this.rightSide.breakpoint || 996
      return !this.rightState.openedSmall && this.layout.w >= breakpoint
    },
    rightOnLayout () {
      return this.rightBreakpoint && this.rightState.openedBig
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
