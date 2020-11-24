import { h, defineComponent } from 'vue'

import QIcon from '../icon/QIcon.js'
import CheckboxMixin from '../../mixins/checkbox.js'

export default defineComponent({
  name: 'QToggle',

  mixins: [ CheckboxMixin ],

  props: {
    icon: String,
    checkedIcon: String,
    uncheckedIcon: String,
    indeterminateIcon: String,

    iconColor: String
  },

  computed: {
    computedIcon () {
      return (
        this.isTrue === true
          ? this.checkedIcon
          : (this.isIndeterminate === true ? this.indeterminateIcon : this.uncheckedIcon)
      ) || this.icon
    },

    computedIconColor () {
      if (this.isTrue === true) {
        return this.iconColor
      }
    }
  },

  methods: {
    __getInner () {
      return [
        h('div', { class: 'q-toggle__track' }),

        h('div', {
          class: 'q-toggle__thumb absolute flex flex-center no-wrap'
        }, this.computedIcon !== void 0
          ? [
              h(QIcon, {
                name: this.computedIcon,
                color: this.computedIconColor
              })
            ]
          : void 0
        )
      ]
    }
  },

  created () {
    this.type = 'toggle'
  },

  // TODO vue3 - render() required for SSR explicitly even though declared in mixin
  render: CheckboxMixin.render
})
