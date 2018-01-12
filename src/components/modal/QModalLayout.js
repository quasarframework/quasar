export default {
  name: 'q-modal-layout',
  props: {
    headerStyle: [String, Object, Array],
    headerClass: [String, Object, Array],

    contentStyle: [String, Object, Array],
    contentClass: [String, Object, Array],

    footerStyle: [String, Object, Array],
    footerClass: [String, Object, Array]
  },
  render (h) {
    const child = []

    if (this.$slots.header || (__THEME__ !== 'ios' && this.$slots.navigation)) {
      child.push(h('div', {
        staticClass: 'q-layout-header',
        style: this.headerStyle,
        'class': this.headerClass
      }, [
        this.$slots.header,
        __THEME__ !== 'ios' ? this.$slots.navigation : null
      ]))
    }

    child.push(h('div', {
      staticClass: 'q-modal-layout-content col scroll',
      style: this.contentStyle,
      'class': this.contentClass
    }, [
      this.$slots.default
    ]))

    if (this.$slots.footer || (__THEME__ === 'ios' && this.$slots.navigation)) {
      child.push(h('div', {
        staticClass: 'q-layout-footer',
        style: this.footerStyle,
        'class': this.footerClass
      }, [
        this.$slots.footer,
        __THEME__ === 'ios' ? this.$slots.navigation : null
      ]))
    }

    return h('div', {
      staticClass: 'q-modal-layout column absolute-full'
    }, child)
  }
}
