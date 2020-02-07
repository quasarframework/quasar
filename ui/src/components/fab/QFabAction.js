import Vue from 'vue'

import QBtn from '../btn/QBtn.js'
import QIcon from '../icon/QIcon.js'

import FabMixin from '../../mixins/fab.js'

import { mergeSlot } from '../../utils/slot.js'

const alignMap = {
  left: 'self-end',
  center: 'self-center',
  right: 'self-start'
}

const alignValues = Object.keys(alignMap)

export default Vue.extend({
  name: 'QFabAction',

  mixins: [ FabMixin ],

  props: {
    icon: {
      type: String,
      required: true
    },

    verticalAlign: {
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
    const child = [
      h(QIcon, {
        props: { name: this.icon }
      })
    ]

    this.label !== '' && this.__injectLabel(h, child)

    return h(QBtn, {
      class: alignMap[this.verticalAlign],
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
    }, mergeSlot(child, this, 'default'))
  }
})
