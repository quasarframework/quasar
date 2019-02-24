import Vue from 'vue'

import { PanelParentMixin } from '../../mixins/panel.js'
import StepHeader from './StepHeader.js'
import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QStepper',

  provide () {
    return {
      stepper: this
    }
  },

  mixins: [ PanelParentMixin ],

  props: {
    dark: Boolean,

    flat: Boolean,
    bordered: Boolean,
    vertical: Boolean,
    alternativeLabels: Boolean,
    headerNav: Boolean,
    contracted: Boolean,

    inactiveColor: String,
    inactiveIcon: String,
    doneIcon: String,
    doneColor: String,
    activeIcon: String,
    activeColor: String,
    errorIcon: String,
    errorColor: String
  },

  computed: {
    classes () {
      return `q-stepper--${this.vertical ? 'vertical' : 'horizontal'}` +
        (this.flat || this.dark ? ' q-stepper--flat no-shadow' : '') +
        (this.bordered || (this.dark && !this.flat) ? ' q-stepper--bordered' : '') +
        (this.contracted === true ? ' q-stepper--contracted' : '') +
        (this.dark === true ? ' q-stepper--dark' : '')
    }
  },

  methods: {
    __getContent (h) {
      if (this.vertical) {
        this.__isValidPanelName(this.value) && this.__updatePanelIndex()
        return [
          h('div', { staticClass: 'q-stepper__content' }, slot(this, 'default'))
        ]
      }

      return [
        h('div', {
          staticClass: 'q-stepper__header row items-stretch justify-between',
          class: {
            [`q-stepper__header--${this.alternativeLabels ? 'alternative' : 'standard'}-labels`]: true,
            'q-stepper__header--border': !this.flat || this.bordered
          }
        }, this.__getAllPanels().map(panel => {
          const step = panel.componentOptions.propsData

          return h(StepHeader, {
            key: step.name,
            props: {
              stepper: this,
              step
            }
          })
        })),

        h('div', {
          staticClass: 'q-stepper__content relative-position overflow-hidden',
          directives: this.panelDirectives
        }, [
          this.__getPanelContent(h)
        ])
      ]
    },

    __render (h) {
      return h('div', {
        staticClass: 'q-stepper',
        class: this.classes,
        on: this.$listeners
      }, this.__getContent(h).concat(slot(this, 'navigation')))
    }
  }
})
