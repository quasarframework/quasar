import Vue from 'vue'

import QIcon from '../icon/QIcon.js'
import CheckboxMixin from '../../mixins/checkbox.js'

export default Vue.extend({
  name: 'QToggle',

  mixins: [ CheckboxMixin ],

  props: {
    icon: String,

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
    __getInner (h) {
      return [
        h('div', { staticClass: 'q-toggle__track' }),

        h('div', {
          staticClass: 'q-toggle__thumb absolute flex flex-center no-wrap'
        }, this.computedIcon !== void 0
          ? [
            h(QIcon, {
              props: {
                name: this.computedIcon,
                color: this.computedIconColor
              }
            })
          ]
          : void 0
        )
      ]
    }
  },

  created () {
    this.type = 'toggle'
  }
})
