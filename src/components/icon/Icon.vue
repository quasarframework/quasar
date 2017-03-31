<script>
export default {
  name: 'q-icon',
  functional: true,
  props: {
    name: String,
    mat: String,
    ios: String
  },
  render (h, ctx) {
    let name, text
    const
      props = ctx.props,
      theme = ctx.parent.$q.theme

    const icon = props.mat && theme === 'mat'
      ? props.mat
      : (props.ios && theme === 'ios' ? props.ios : ctx.props.name)

    if (!icon) {
      console.error('q-icon has no icon to display for current theme; set "name" or both "mat" and "ios" props')
      return
    }

    if (icon.startsWith('fa-')) {
      name = `icon fa ${icon}`
    }
    else if (icon.startsWith('ion-')) {
      name = `icon ${icon}`
    }
    else {
      name = 'material-icons'
      text = icon.replace(/ /g, '_')
    }

    if (ctx.data.staticClass) {
      ctx.data.staticClass += ` ${name}`
    }
    else {
      ctx.data.staticClass = `${name}`
    }

    return h('i', ctx.data, text ? [text, ctx.children] : [' ', ctx.children])
  }
}
</script>
