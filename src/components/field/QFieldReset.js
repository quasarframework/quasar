export default {
  name: 'q-field-reset',
  functional: true,
  provide () {
    return {
      __field: undefined
    }
  },
  render (h, ctx) {
    return h('div', [
      ctx.children
    ])
  }
}
