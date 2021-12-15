import Vue from 'vue'

import QBtn from '../btn/QBtn.js'
import QIcon from '../icon/QIcon.js'

import FabMixin from '../../mixins/fab.js'

import { noop } from '../../utils/event.js'
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

    to: [ String, Object ],
    replace: Boolean
  },

  inject: {
    __qFab: {
      default () {
        return {
          showing: true,
          __onChildClick: noop
        }
      }
    }
  },

  computed: {
    classes () {
      const align = anchorMap[this.anchor]
      return this.formClass + (align !== void 0 ? ` ${align}` : '')
    },

    onEvents () {
      return {
        ...this.qListeners,
        click: this.click
      }
    },

    isDisabled () {
      return this.__qFab.showing !== true || this.disable === true
    }
  },

  methods: {
    click (e) {
      this.__qFab.__onChildClick(e)
      this.$emit('click', e)
    }
  },

  render (h) {
    const child = []

    if (this.$scopedSlots.icon !== void 0) {
      child.push(this.$scopedSlots.icon())
    }
    else if (this.icon !== '') {
      child.push(
        h(QIcon, {
          props: { name: this.icon }
        })
      )
    }

    if (this.label !== '' || this.$scopedSlots.label !== void 0) {
      child[this.labelProps.action](
        h('div', this.labelProps.data, this.$scopedSlots.label !== void 0 ? this.$scopedSlots.label() : [ this.label ])
      )
    }

    return h(QBtn, {
      class: this.classes,
      props: {
        ...this.$props,
        noWrap: true,
        stack: this.stacked,
        icon: void 0,
        label: void 0,
        noCaps: true,
        fabMini: true,
        disable: this.isDisabled
      },
      on: this.onEvents
    }, mergeSlot(child, this, 'default'))
  }
})
