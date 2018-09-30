import Vue from 'vue'

import { PanelParentMixin } from '../../mixins/panel.js'
import StepHeader from './StepHeader.js'

export default Vue.extend({
  name: 'QStepper',

  provide () {
    return {
      stepper: this
    }
  },

  mixins: [ PanelParentMixin ],

  props: {
    color: String,
    dark: Boolean,

    animated: Boolean,
    flat: Boolean,
    bordered: Boolean,
    vertical: Boolean,
    alternativeLabels: Boolean,
    headerNavigation: Boolean,
    contractable: Boolean,

    doneIcon: Boolean,
    activeIcon: Boolean,
    errorIcon: Boolean
  },

  computed: {
    classes () {
      return {
        [`q-stepper--${this.vertical ? 'vertical' : 'horizontal'}`]: true,
        [`text-${this.color}`]: this.color,
        'q-stepper--flat no-shadow': this.flat || this.dark,
        'q-stepper--bordered': this.bordered || (this.dark && !this.flat),
        'q-stepper--contractable': this.contractable,
        'q-stepper--dark': this.dark
      }
    }
  },

  methods: {
    __getContent (h) {
      if (this.vertical) {
        this.value && this.__updatePanelIndex()
        return this.$slots.default
      }

      return [
        h('div', {
          staticClass: 'q-stepper__header row items-stretch justify-between',
          'class': {
            'q-stepper__header--border': !this.flat || this.bordered,
            'q-stepper--alternative-labels': this.alternativeLabels
          }
        }, this.__getPanels().map(panel => {
          const step = panel.componentOptions.propsData
          return h(StepHeader, {
            key: step.name,
            props: {
              stepper: this,
              step
            }
          })
        })),

        h('div', { staticClass: 'q-stepper__content relative-position overflow-hidden' }, [
          this.__getPanelContent(h)
        ])
      ]
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-stepper generic-border-radius',
      'class': this.classes
    }, this.__getContent(h).concat(this.$slots.navigation))
  }
})
