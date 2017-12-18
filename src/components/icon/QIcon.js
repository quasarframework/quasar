export default {
  name: 'q-icon',
  functional: true,
  props: {
    name: String,
    mat: String,
    ios: String,
    color: String,
    size: String
  },
  render (h, ctx) {
    let name, text
    const
      prop = ctx.props,
      data = ctx.data,
      cls = ctx.data.staticClass,
      icon = prop.mat && __THEME__ === 'mat'
        ? prop.mat
        : (prop.ios && __THEME__ === 'ios' ? prop.ios : ctx.props.name)

    if (!icon) {
      name = ''
    }
    else if (/^fa[s|r|l|b]{0,1} /.test(icon)) {
      name = icon
    }
    else if (icon.startsWith('bt-')) {
      name = `bt ${icon}`
    }
    else if (icon.startsWith('ion-') || icon.startsWith('icon-')) {
      name = `${icon}`
    }
    else if (icon.startsWith('ion4-')) {
      name = ''
    }
    else if (icon.startsWith('mdi-')) {
      name = `mdi ${icon}`
    }
    else {
      name = 'material-icons'
      text = icon.replace(/ /g, '_')
    }

    data.staticClass = `${cls ? cls + ' ' : ''}q-icon${name.length ? ` ${name}` : ''}${prop.color ? ` text-${prop.color}` : ''}`

    if (!data.hasOwnProperty('attrs')) {
      data.attrs = {}
    }
    data.attrs['aria-hidden'] = 'true'

    if (prop.size) {
      const style = `font-size: ${prop.size};`
      data.style = data.style
        ? [data.style, style]
        : style
    }

    if (icon.startsWith('ion4-')) {
      if (!ctx.children) {
        ctx.children = []
      }
      ctx.children.push(h('ion-icon', {attrs: {name: icon.substr(5)}}))
    }

    return h('i', data, text ? [text, ctx.children] : [' ', ctx.children])
  }
}
