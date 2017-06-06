export default {
  name: 'q-video',
  functional: true,
  props: {
    src: {
      type: String,
      required: true
    }
  },
  render (h, ctx) {
    const
      data = ctx.data,
      prop = ctx.props,
      cls = data.staticClass,
      iframeData = {
        attrs: {
          src: prop.src,
          frameborder: '0',
          allowfullscreen: true
        }
      }

    data.staticClass = `q-video${cls ? ` ${cls}` : ''}`

    return h('div', data, [ h('iframe', iframeData) ])
  }
}
