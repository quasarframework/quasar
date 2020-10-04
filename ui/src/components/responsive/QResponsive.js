import { h, defineComponent } from 'vue'

import RatioMixin from '../../mixins/ratio.js'

import { slot } from '../../utils/render.js'

export default defineComponent({
  name: 'QResponsive',

  mixins: [ RatioMixin ],

  render () {
    return h('div', {
      class: 'q-responsive'
    }, [
      h('div', {
        class: 'q-responsive__filler overflow-hidden'
      }, [
        h('div', { style: this.ratioStyle })
      ]),

      h('div', {
        class: 'q-responsive__content absolute-full fit'
      }, slot(this, 'default'))
    ])
  }
})
