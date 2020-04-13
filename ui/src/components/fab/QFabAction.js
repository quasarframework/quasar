import Vue from 'vue'

import QBtn from '../btn/QBtn.js'
import QIcon from '../icon/QIcon.js'

import FabMixin from '../../mixins/fab.js'

import { mergeSlot } from '../../utils/slot.js'

const anchorMap = {
  start: 'self-end',
  center: 'self-center',
  end: 'self-start'
}

const anchorValues = Object.keys(anchorMap)

export default Vue.extend({
  name: 'QFabAction',

  mixins: [ FabMixin ],

  props: {
    icon: {
      type: String,
      default: ''
    },

    anchor: {
      type: String,
      validator: v => anchorValues.includes(v)
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

  computed: {
    classes () {
      const align = anchorMap[this.anchor]
      return this.formClass + (align !== void 0 ? ` ${align}` : '')
    }
  },

  methods: {
    click (e) {
      this.__qFabClose()
      this.$emit('click', e)
    }
  },

  render (h) {
    const child = []

    this.icon !== '' && child.push(
      h(QIcon, {
        props: { name: this.icon }
      })
    )

    this.label !== '' && child[this.labelProps.action](
      h('div', this.labelProps.data, [ this.label ])
    )

    return h(QBtn, {
      class: this.classes,
      props: {
        ...this.$props,
        noWrap: true,
        stack: this.stacked,
        icon: void 0,
        label: void 0,
        noCaps: true,
        fabMini: true
      },
      on: {
        ...this.$listeners,
        click: this.click
      }
    }, mergeSlot(child, this, 'default'))
  }
})
