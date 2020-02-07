import Vue from 'vue'

import QBtn from '../btn/QBtn.js'
import QIcon from '../icon/QIcon.js'
import FabMixin from './fab-mixin.js'
import { slot } from '../../utils/slot.js'

const alignMapping = {
  left: 'self-start',
  center: 'self-center',
  right: 'self-end'
}

const alignValues = Object.keys(alignMapping)

export default Vue.extend({
  name: 'QFabAction',

  mixins: [ FabMixin ],

  props: {
    icon: {
      type: String,
      required: true
    },

    align: {
      type: String,
      validator: v => alignValues.includes(v)
    },

    to: [String, Object],
    replace: Boolean
  },

  inject: {
    __qFabClose: {
      default () {
        console.error('QFabAction needs to be child of QFab')
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
    const children = [
      h(QIcon, {
        props: { name: this.icon }
      })
    ]

    this.label !== '' && children[this.leftLabel === true ? 'unshift' : 'push'](h('div', {
      staticClass: 'q-fab__label q-fab__label--' +
        (this.extended === true ? 'extended' : 'collapsed')
    }, [ this.label ]))

    return h(QBtn, {
      staticClass: alignMapping[this.align],
      props: {
        ...this.$props,
        noWrap: true,
        icon: void 0,
        label: void 0,
        fabMini: true
      },
      on: {
        ...this.$listeners,
        click: this.click
      }
    }, slot(this, 'default', []).concat(children))
  }
})
