export default {
  name: 'q-icon',
  functional: true,
  props: {
    name: String,
    mat: String,
    ios: String,
    color: String
  },
  render (h, ctx) {
    let name, text
    const
      prop = ctx.props,
      data = ctx.data,
      theme = ctx.parent.$q.theme,
      cls = ctx.data.staticClass,
      icon = prop.mat && theme === 'mat'
        ? prop.mat
        : (prop.ios && theme === 'ios' ? prop.ios : ctx.props.name)

    if (!icon) {
      name = ''
    }
    else if (icon.startsWith('fa-')) {
      name = `fa ${icon}`
    }
    else if (icon.startsWith('ion-')) {
      name = `${icon}`
    }
    else {
      name = 'material-icons'
      text = icon.replace(/ /g, '_')
    }

    data.staticClass = `${cls ? cls + ' ' : ''}q-icon${name.length ? ` ${name}` : ''}${prop.color ? ` text-${prop.color}` : ''}`
    data.attrs['aria-hidden'] = 'true'
    return h('i', data, text ? [text, ctx.children] : [' ', ctx.children])
  }
}
