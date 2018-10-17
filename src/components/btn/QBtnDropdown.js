import Vue from 'vue'

import BtnMixin from './btn-mixin.js'

import QIcon from '../icon/QIcon.js'
import QBtn from './QBtn.js'
import QBtnGroup from './QBtnGroup.js'
import QMenu from '../menu/QMenu.js'

export default Vue.extend({
  name: 'QBtnDropdown',

  mixins: [ BtnMixin ],

  props: {
    value: Boolean,
    split: Boolean,

    contentClass: [Array, String, Object],
    contentStyle: [Array, String, Object],

    menuAnchor: {
      type: String,
      default: 'bottom right'
    },
    menuSelf: {
      type: String,
      default: 'top right'
    }
  },

  data () {
    return {
      showing: this.value
    }
  },

  watch: {
    value (val) {
      this.$refs.menu && this.$refs.menu[val ? 'show' : 'hide']()
    }
  },

  render (h) {
    const
      Menu = h(
        QMenu,
        {
          ref: 'menu',
          props: {
            disable: this.disable,
            fit: true,
            anchor: this.menuAnchor,
            self: this.menuSelf,
            contentClass: this.contentClass,
            contentStyle: this.contentStyle
          },
          on: {
            show: e => {
              this.showing = true
              this.$emit('show', e)
              this.$emit('input', true)
            },
            hide: e => {
              this.showing = false
              this.$emit('hide', e)
              this.$emit('input', false)
            }
          }
        },
        this.$slots.default
      ),
      Icon = h(QIcon, {
        props: {
          name: this.$q.icon.input.dropdown
        },
        staticClass: 'generic-transition',
        'class': {
          'rotate-180': this.showing,
          'q-btn-dropdown__arrow': !this.split
        }
      }),
      Btn = h(QBtn, {
        props: Object.assign({}, this.$props, {
          noWrap: true,
          iconRight: this.split ? this.iconRight : null
        }),
        'class': this.split ? 'q-btn-dropdown--current' : 'q-btn-dropdown q-btn-dropdown--simple',
        on: {
          click: e => {
            this.split && this.hide()
            !this.disable && this.$emit('click', e)
          }
        }
      }, this.split ? null : [ Icon, Menu ])

    if (!this.split) {
      return Btn
    }

    return h(QBtnGroup, {
      props: {
        outline: this.outline,
        flat: this.flat,
        rounded: this.rounded,
        push: this.push,
        unelevated: this.unelevated
      },
      staticClass: 'q-btn-dropdown q-btn-dropdown--split no-wrap q-btn-item',
      'class': { 'self-stretch no-border-radius': this.stretch }
    },
    [
      Btn,
      h(QBtn, {
        props: {
          disable: this.disable,
          outline: this.outline,
          flat: this.flat,
          rounded: this.rounded,
          push: this.push,
          size: this.size,
          color: this.color,
          textColor: this.textColor,
          dense: this.dense,
          ripple: this.ripple
        },
        staticClass: 'q-btn-dropdown__arrow',
        on: { click: this.toggle }
      }, [ Icon ]),
      [ Menu ]
    ])
  },

  methods: {
    toggle () {
      this.$refs.menu && this.$refs.menu.toggle()
    },
    show () {
      this.$refs.menu && this.$refs.menu.show()
    },
    hide () {
      this.$refs.menu && this.$refs.menu.hide()
    }
  },

  mounted () {
    this.value && this.show()
  }
})
