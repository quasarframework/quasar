export default {
  name: 'q-modal-layout',
  functional: true,
  props: {
    headerStyle: [String, Object, Array],
    headerClass: [String, Object, Array],

    contentStyle: [String, Object, Array],
    contentClass: [String, Object, Array],

    footerStyle: [String, Object, Array],
    footerClass: [String, Object, Array]
  },
  render (h, ctx) {
    const
      child = [],
      props = ctx.props,
      slots = ctx.slots()

    if (slots.header || (__THEME__ !== 'ios' && slots.navigation)) {
      child.push(h('div', {
        staticClass: 'q-layout-header',
        style: props.headerStyle,
        'class': props.headerClass
      }, [
        slots.header,
        __THEME__ !== 'ios' ? slots.navigation : null
      ]))
    }

    child.push(h('div', {
      staticClass: 'q-modal-layout-content col scroll',
      style: props.contentStyle,
      'class': props.contentClass
    }, [
      slots.default
    ]))

    if (slots.footer || (__THEME__ === 'ios' && slots.navigation)) {
      child.push(h('div', {
        staticClass: 'q-layout-footer',
        style: props.footerStyle,
        'class': props.footerClass
      }, [
        slots.footer,
        __THEME__ === 'ios' ? slots.navigation : null
      ]))
    }

    return h('div', {
      staticClass: 'q-modal-layout column absolute-full'
    }, child)
  }
}
