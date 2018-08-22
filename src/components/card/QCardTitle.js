export default {
  name: 'QCardTitle',
  render (h) {
    return h('div', {
      staticClass: 'q-card-primary q-card-container row no-wrap'
    }, [
      h('div', {staticClass: 'col column'}, [
        h('div', {staticClass: 'q-card-title'}, this.$slots.default),
        h('div', {staticClass: 'q-card-subtitle'}, [ this.$slots.subtitle ])
      ]),
      h('div', {staticClass: 'col-auto self-center q-card-title-extra'}, [ this.$slots.right ])
    ])
  }
}
