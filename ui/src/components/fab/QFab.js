import { h, defineComponent } from 'vue'

import QBtn from '../btn/QBtn.js'
import QIcon from '../icon/QIcon.js'

import FabMixin from '../../mixins/fab.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'

import { hSlot, hMergeSlot } from '../../utils/render.js'

const directions = [ 'up', 'right', 'down', 'left' ]
const alignValues = [ 'left', 'center', 'right' ]

export default defineComponent({
  name: 'QFab',

  mixins: [ FabMixin, ModelToggleMixin ],

  provide () {
    return {
      __qFab: this
    }
  },

  props: {
    icon: String,
    activeIcon: String,

    hideIcon: Boolean,
    hideLabel: {
      default: null
    },

    direction: {
      type: String,
      default: 'right',
      validator: v => directions.includes(v)
    },

    persistent: Boolean,

    verticalActionsAlign: {
      type: String,
      default: 'center',
      validator: v => alignValues.includes(v)
    }
  },

  data () {
    return {
      showing: this.modelValue === true
    }
  },

  computed: {
    hideOnRouteChange () {
      return this.persistent !== true
    },

    classes () {
      return 'q-fab z-fab row inline justify-center' +
        ` q-fab--align-${this.verticalActionsAlign} ${this.formClass}` +
        (this.showing === true ? ' q-fab--opened' : '')
    },

    actionClass () {
      return 'q-fab__actions flex no-wrap inline' +
        ` q-fab__actions--${this.direction}`
    }
  },

  methods: {
    __onChildClick (evt) {
      this.hide(evt)

      if (this.$refs.trigger && this.$refs.trigger.$el) {
        this.$refs.trigger.$el.focus()
      }
    },

    __getTriggerContent () {
      const child = []

      this.hideIcon !== true && child.push(
        h('div', { class: 'q-fab__icon-holder' }, [
          h(QIcon, {
            class: 'q-fab__icon absolute-full',
            name: this.icon || this.$q.iconSet.fab.icon
          }),

          h(QIcon, {
            class: 'q-fab__active-icon absolute-full',
            name: this.activeIcon || this.$q.iconSet.fab.activeIcon
          })
        ])
      )

      this.label !== '' && child[ this.labelProps.action ](
        h('div', this.labelProps.data, [this.label])
      )

      return hMergeSlot(this, 'tooltip', child)
    }
  },

  render () {
    return h('div', {
      class: this.classes
    }, [
      h(QBtn, {
        ref: 'trigger',
        class: this.formClass,
        ...this.$props,
        noWrap: true,
        stack: this.stacked,
        align: void 0,
        icon: void 0,
        label: void 0,
        noCaps: true,
        fab: true,
        'aria-expanded': this.showing === true ? 'true' : 'false',
        'aria-haspopup': 'true',
        onClick: this.toggle
      }, this.__getTriggerContent),

      h('div', { class: this.actionClass }, hSlot(this, 'default'))
    ])
  }
})
