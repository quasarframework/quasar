<script>
export default {
  functional: true,
  props: {
    icon: {
      type: String,
      required: true
    }
  },
  render (h, ctx) {
    const icon = ctx.props.icon

    if (icon.startsWith('fa-')) {
      ctx.data.staticClass += ` fa ${icon}`
      return h('i', ctx.data)
    }

    ctx.data.staticClass += ' material-icons'
    return h('i', ctx.data, icon)
  }
}
</script>
