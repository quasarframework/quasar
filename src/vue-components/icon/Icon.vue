<script>
export default {
  functional: true,
  props: {
    name: {
      type: String,
      required: true
    }
  },
  render (h, ctx) {
    const icon = ctx.props.name
    let name, text

    if (icon.startsWith('fa-')) {
      name = `fa ${icon}`
    }
    else if (icon.startsWith('ion-')) {
      name = icon
    }
    else {
      name = 'material-icons'
      text = icon
    }

    if (ctx.data.staticClass) {
      ctx.data.staticClass += ` ${name}`
    }
    else {
      ctx.data.staticClass = `${name}`
    }

    return h('i', ctx.data, text)
  }
}
</script>
