import { h, defineComponent } from 'vue'

import StepHeader from './StepHeader.js'

import DarkMixin from '../../mixins/dark.js'
import { PanelParentMixin } from '../../mixins/panel.js'

import { hSlot, hMergeSlot, hDir } from '../../utils/render.js'

export default defineComponent({
  name: 'QStepper',

  provide () {
    return {
      stepper: this
    }
  },

  mixins: [ DarkMixin, PanelParentMixin ],

  props: {
    flat: Boolean,
    bordered: Boolean,
    alternativeLabels: Boolean,
    headerNav: Boolean,
    contracted: Boolean,
    headerClass: String,

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
      return `q-stepper q-stepper--${this.vertical === true ? 'vertical' : 'horizontal'}` +
        (this.flat === true || this.isDark === true ? ' q-stepper--flat no-shadow' : '') +
        (this.bordered === true || (this.isDark === true && this.flat === false) ? ' q-stepper--bordered' : '') +
        (this.contracted === true ? ' q-stepper--contracted' : '') +
        (this.isDark === true ? ' q-stepper--dark q-dark' : '')
    },

    headerClasses () {
      return 'q-stepper__header row items-stretch justify-between' +
        ` q-stepper__header--${this.alternativeLabels === true ? 'alternative' : 'standard'}-labels` +
        (this.flat === false || this.bordered === true ? ' q-stepper__header--border' : '') +
        (this.headerClass !== void 0 ? ` ${this.headerClass}` : '')
    }
  },

  methods: {
    __getContent () {
      const top = hSlot(this, 'message', [])

      if (this.vertical === true) {
        this.__isValidPanelName(this.modelValue) && this.__updatePanelIndex()

        const content = h('div', {
          class: 'q-stepper__content'
        }, hSlot(this, 'default'))

        return top === void 0
          ? [ content ]
          : top.concat(content)
      }

      return [
        h('div', { class: this.headerClasses }, this.panels.map(panel => {
          const step = panel.props

          return h(StepHeader, {
            key: step.name,
            stepper: this,
            step
          })
        }))
      ].concat(
        top,
        hDir(
          'div',
          { class: 'q-stepper__content q-panel-parent' },
          this.__getPanelContent(),
          'cont',
          this.swipeable,
          () => this.panelDirectives
        )
      )
    },

    __renderPanels () {
      return h('div', {
        class: this.classes
      }, hMergeSlot(this.__getContent(), this, 'navigation'))
    }
  }
})
