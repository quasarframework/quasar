import Vue from 'vue'

import WBtn from '../btn/QBtn.js'
import FabMixin from './fab-mixin.js'
import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'WFabAction',

  mixins: [ FabMixin ],

  props: {
    icon: {
      type: String,
      required: true
    },

    to: [String, Object],
    replace: Boolean
  },

  inject: {
    __qFabClose: {
      default () {
        console.error('WFabAction needs to be child of WFab')
      }
    }
  },

  methods: {
    click (e) {
      this.__qFabClose()
      this.$emit('click', e)
    }
  },

  render (h) {
    return h(WBtn, {
      props: {
        ...this.$props,
        fabMini: true
      },
      on: {
        ...this.$listeners,
        click: this.click
      }
    }, slot(this, 'default'))
  }
})
