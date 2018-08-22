export default {
  name: 'QModalLayout',
  inject: {
    __qmodal: {
      default () {
        console.error('QModalLayout needs to be child of QModal')
      }
    }
  },
  props: {
    headerStyle: [String, Object, Array],
    headerClass: [String, Object, Array],

    contentStyle: [String, Object, Array],
    contentClass: [String, Object, Array],

    footerStyle: [String, Object, Array],
    footerClass: [String, Object, Array]
  },
  watch: {
    __qmodal (newModal, oldModal) {
      oldModal && oldModal.unregister(this)
      newModal && newModal.register(this)
    }
  },
  mounted () {
    this.__qmodal && this.__qmodal.register(this)
  },
  beforeDestroy () {
    this.__qmodal && this.__qmodal.unregister(this)
  },
  render (h) {
    const child = []

    if (this.$slots.header || (process.env.THEME !== 'ios' && this.$slots.navigation)) {
      child.push(h('div', {
        staticClass: 'q-layout-header',
        style: this.headerStyle,
        'class': this.headerClass
      }, [
        this.$slots.header,
        process.env.THEME !== 'ios' ? this.$slots.navigation : null
      ]))
    }

    child.push(h('div', {
      staticClass: 'q-modal-layout-content col scroll',
      style: this.contentStyle,
      'class': this.contentClass
    }, this.$slots.default))

    if (this.$slots.footer || (process.env.THEME === 'ios' && this.$slots.navigation)) {
      child.push(h('div', {
        staticClass: 'q-layout-footer',
        style: this.footerStyle,
        'class': this.footerClass
      }, [
        this.$slots.footer,
        process.env.THEME === 'ios' ? this.$slots.navigation : null
      ]))
    }

    return h('div', {
      staticClass: 'q-modal-layout col column no-wrap'
    }, child)
  }
}
