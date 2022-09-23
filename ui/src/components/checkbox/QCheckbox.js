import Vue from 'vue'

import QIcon from '../icon/QIcon.js'

import CheckboxMixin from '../../mixins/checkbox.js'

export default Vue.extend({
  name: 'QCheckbox',

  mixins: [ CheckboxMixin ],

  computed: {
    computedIcon () {
      return this.isTrue === true
        ? this.checkedIcon
        : (this.isIndeterminate === true
          ? this.indeterminateIcon
          : this.uncheckedIcon
        )
    }
  },

  methods: {
    __getInner (h) {
      return this.computedIcon !== void 0
        ? [
          h('div', {
            key: 'icon',
            staticClass: 'q-checkbox__icon-container absolute-full flex flex-center no-wrap'
          }, [
            h(QIcon, {
              staticClass: 'q-checkbox__icon',
              props: { name: this.computedIcon }
            })
          ])
        ]
        : [
          h('div', {
            key: 'svg',
            staticClass: 'q-checkbox__bg absolute'
          }, [
            h('svg', {
              staticClass: 'q-checkbox__svg fit absolute-full',
              attrs: { focusable: 'false' /* needed for IE11 */, viewBox: '0 0 24 24' }
            }, [
              h('path', {
                staticClass: 'q-checkbox__truthy',
                attrs: {
                  fill: 'none',
                  d: 'M1.73,12.91 8.1,19.28 22.79,4.59'
                }
              }),

              h('path', {
                staticClass: 'q-checkbox__indet',
                attrs: {
                  d: 'M4,14H20V10H4'
                }
              })
            ])
          ])
        ]
    }
  },

  created () {
    this.type = 'checkbox'
  }
})
