<template>
  <div class="layout">
    <aside
      ref="left"
      class="layout-aside layout-aside-left"
      :class="{
        'absolute-left': !this.fixed.left,
        'fixed-left': this.fixed.left
      }"
      :style="leftStyle"
    >
      <slot name="left"></slot>
      <q-resize-observable @resize="onLeftAsideResize" />
    </aside>

    <aside
      ref="right"
      class="layout-aside layout-aside-right"
      :class="{
        'absolute-right': !this.fixed.right,
        'fixed-right': this.fixed.right
      }"
      :style="rightStyle"
    >
      <slot name="right"></slot>
      <q-resize-observable @resize="onRightAsideResize" />
    </aside>

    <header
      ref="header"
      class="layout-header"
      :class="{'fixed-top': fixed.header}"
      :style="headerStyle"
    >
      <slot name="header"></slot>
      <slot v-if="$q.theme !== 'ios'" name="navigation"></slot>
      <q-resize-observable @resize="onHeaderResize" />
    </header>

    <main :style="pageStyle">
      <slot></slot>
    </main>

    <footer
      ref="footer"
      class="layout-footer"
      :class="{'fixed-bottom': fixed.footer}"
      :style="footerStyle"
    >
      <slot name="footer"></slot>
      <slot v-if="$q.theme === 'ios'" name="navigation"></slot>
      <q-resize-observable @resize="onFooterResize" />
    </footer>

    <q-scroll-observable v-if="reveal" @scroll="onPageScroll" />
  </div>
</template>

<script>
import { cssTransform } from '../../utils/dom'

export default {
  props: {
    view: {
      type: String,
      default: 'hhh lpr fff'
    },
    reveal: Boolean
  },
  data () {
    return {
      size: {
        header: {height: 0, width: 0},
        left: {height: 0, width: 0},
        right: {height: 0, width: 0},
        footer: {height: 0, width: 0}
      },
      headerOnScreen: true
    }
  },
  computed: {
    fixed () {
      return {
        header: this.reveal || this.view.indexOf('H') > -1,
        footer: this.view.indexOf('F') > -1,
        left: this.view.indexOf('L') > -1,
        right: this.view.indexOf('R') > -1
      }
    },
    layout () {
      const rows = this.view.toLowerCase().split(' ')
      return {
        top: rows[0].split(''),
        middle: rows[1].split(''),
        bottom: rows[2].split('')
      }
    },
    pageStyle () {
      const view = this.layout
      let css = {}

      if (!view.top.includes('p') && this.fixed.header) {
        css['margin-top'] = this.size.header.height + 'px'
      }
      if (!view.bottom.includes('p') && this.fixed.footer) {
        css['margin-bottom'] = this.size.footer.height + 'px'
      }
      if (view.middle[0] !== 'p') {
        css['margin-left'] = this.size.left.width + 'px'
      }
      if (view.middle[2] !== 'p') {
        css['margin-right'] = this.size.right.width + 'px'
      }

      return css
    },
    headerStyle () {
      const
        view = this.layout,
        offset = this.headerOnScreen || !this.reveal ? 0 : -this.size.header.height

      let css = cssTransform(`translateY(${offset}px)`)

      if (view.top[0] === 'l') {
        css['margin-left'] = this.size.left.width + 'px'
      }
      if (view.top[2] === 'r') {
        css['margin-right'] = this.size.right.width + 'px'
      }

      return css
    },
    footerStyle () {
      const view = this.layout
      let css = {}

      if (view.bottom[0] === 'l') {
        css['margin-left'] = this.size.left.width + 'px'
      }
      if (view.bottom[2] === 'r') {
        css['margin-right'] = this.size.right.width + 'px'
      }

      return css
    },
    leftStyle () {
      const view = this.layout
      let css = {}

      if (view.top[0] !== 'l') {
        css['margin-top'] = this.size.header.height + 'px'
      }
      if (view.bottom[0] !== 'l') {
        css['margin-bottom'] = this.size.footer.height + 'px'
      }

      return css
    },
    rightStyle () {
      const view = this.layout
      let css = {}

      if (view.top[2] !== 'r') {
        css['margin-top'] = this.size.header.height + 'px'
      }
      if (view.bottom[2] !== 'r') {
        css['margin-bottom'] = this.size.footer.height + 'px'
      }

      return css
    }
  },
  methods: {
    onHeaderResize (size) {
      this.__updateSize('header', size)
    },
    onFooterResize (size) {
      this.__updateSize('footer', size)
    },
    onLeftAsideResize (size) {
      this.__updateSize('left', size)
    },
    onRightAsideResize (size) {
      this.__updateSize('right', size)
    },
    __updateSize (type, size) {
      this.size[type].width = size.width
      this.size[type].height = size.height
    },
    onPageScroll (data) {
      let visible = true

      if (
        data.position > this.size.header.height &&
        data.direction === 'down' && data.position - data.inflexionPosition >= 100
      ) {
        visible = false
      }

      if (this.headerOnScreen !== visible) {
        this.headerOnScreen = visible
      }
    }
  }
}
</script>
