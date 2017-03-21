<template>
  <div class="layout">
    <aside
      ref="left"
      v-if="$slots.left"
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
      v-if="$slots.right"
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
      v-if="$slots.header || ($q.theme !== 'ios' && $slots.navigation)"
      class="layout-header"
      :class="{'fixed-top': fixed.header}"
      :style="headerStyle"
    >
      {{size.layout}}<br>{{scroll}}

      <slot name="header"></slot>
      <slot v-if="$q.theme !== 'ios'" name="navigation"></slot>
      <q-resize-observable @resize="onHeaderResize" />
    </header>

    <div :style="pageStyle">
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
  </div>
</template>

<script>
import { viewport, cssTransform } from '../../utils/dom'
import { getScrollHeight } from '../../utils/scroll'

function updateSize (obj, size) {
  if (obj.width !== size.width) {
    obj.width = size.width
  }
  if (obj.height !== size.height) {
    obj.height = size.height
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
        footer: {height: 0, width: 0},
        layout: {height: 0, width: 0}
      },
      headerOnScreen: true,
      scroll: {
        position: 0,
        direction: '',
        directionChanged: false,
        inflexionPosition: 0,
        scrollHeight: 0
      }
    }
  },
  provide () {
    return {
      layout: this
    }
  },
  computed: {
    fixed () {
      return {
        header: this.reveal || this.view.indexOf('H') > -1,
        footer: this.view.indexOf('F') > -1 || this.scroll.scrollHeight < this.size.layout.height,
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
      const
        view = this.layout,
        css = {}

      if (!view.top.includes('p') && this.fixed.header) {
        css.paddingTop = this.size.header.height + 'px'
      }
      if (!view.bottom.includes('p') && this.fixed.footer) {
        css.paddingBottom = this.size.footer.height + 'px'
      }
      if (view.middle[0] !== 'p') {
        css.paddingLeft = this.size.left.width + 'px'
      }
      if (view.middle[2] !== 'p') {
        css.paddingRight = this.size.right.width + 'px'
      }

      return css
    },
    mainStyle () {
      return {
        minHeight: `calc(100vh - ${this.size.header.height}px - ${this.size.footer.height}px)`
      }
    },
    showHeader () {
      return this.headerOnScreen || !this.reveal
    },
    headerStyle () {
      const
        view = this.layout,
        offset = this.showHeader ? 0 : -this.size.header.height,
        css = cssTransform(`translateY(${offset}px)`)

      if (view.top[0] === 'l') {
        css.marginLeft = this.size.left.width + 'px'
      }
      if (view.top[2] === 'r') {
        css.marginRight = this.size.right.width + 'px'
      }

      return css
    },
    footerStyle () {
      const
        view = this.layout,
        css = {}

      if (view.bottom[0] === 'l') {
        css.marginLeft = this.size.left.width + 'px'
      }
      if (view.bottom[2] === 'r') {
        css.marginRight = this.size.right.width + 'px'
      }

      return css
    },
    offsetTop () {
      return !this.fixed.header
        ? this.size.header.height - this.scroll.position
        : 0
    },
    offsetBottom () {
      if (!this.fixed.footer) {
        let translate = this.scroll.scrollHeight - viewport().height - this.scroll.position - this.size.footer.height
        if (translate < 0) {
          return translate
        }
      }
    },
    leftStyle () {
      const
        view = this.layout,
        css = {}

      if (view.top[0] !== 'l') {
        if (this.fixed.left && this.offsetTop) {
          css.top = Math.max(0, this.offsetTop) + 'px'
        }
        else if (this.showHeader) {
          css.top = this.size.header.height + 'px'
        }
      }
      if (view.bottom[0] !== 'l') {
        if (this.fixed.left && this.offsetBottom) {
          css.bottom = -this.offsetBottom + 'px'
        }
        else if (this.fixed.footer) {
          css.bottom = this.size.footer.height + 'px'
        }
      }

      return css
    },
    rightStyle () {
      const
        view = this.layout,
        css = {}

      if (view.top[2] !== 'r') {
        if (this.fixed.right && this.offsetTop) {
          css.top = Math.max(0, this.offsetTop) + 'px'
        }
        else if (this.showHeader) {
          css.top = this.size.header.height + 'px'
        }
      }
      if (view.bottom[2] !== 'r') {
        if (this.offsetBottom) {
          css.bottom = -this.offsetBottom + 'px'
        }
        else if (this.fixed.footer) {
          css.bottom = this.size.footer.height + 'px'
        }
      }

      return css
    }
  },
  methods: {
    onHeaderResize (size) {
      updateSize(this.size.header, size)
    },
    onFooterResize (size) {
      updateSize(this.size.footer, size)
    },
    onLeftAsideResize (size) {
      updateSize(this.size.left, size)
    },
    onRightAsideResize (size) {
      updateSize(this.size.right, size)
    },
    onLayoutResize (size) {
      updateObject(this.scroll, {scrollHeight: getScrollHeight(this.$el)})
      updateSize(this.size.layout, size)
    },
    onPageScroll (data) {
      updateObject(this.scroll, data)

      if (this.reveal) {
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
}
</script>
