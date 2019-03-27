import Vue from 'vue'

import BtnMixin from './btn-mixin.js'

import QIcon from '../icon/QIcon.js'
import QBtn from './QBtn.js'
import QBtnGroup from './QBtnGroup.js'
import QMenu from '../menu/QMenu.js'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QBtnDropdown',

  mixins: [ BtnMixin ],

  props: {
    value: Boolean,
    split: Boolean,

    contentClass: [Array, String, Object],
    contentStyle: [Array, String, Object],

    cover: Boolean,
    persistent: Boolean,
    autoClose: Boolean,
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
      this.$refs.menu !== void 0 && this.$refs.menu[val ? 'show' : 'hide']()
    }
  },

  render (h) {
    const Arrow = [
      h(QIcon, {
        props: {
          name: this.$q.iconSet.arrow.dropdown
        },
        staticClass: 'q-btn-dropdown__arrow',
        class: {
          'rotate-180': this.showing,
          'q-btn-dropdown__arrow-container': this.split === false
        }
      }),

      h(QMenu, {
        ref: 'menu',
        props: {
          disable: this.disable,
          cover: this.cover,
          fit: true,
          persistent: this.persistent,
          autoClose: this.autoClose,
          anchor: this.menuAnchor,
          self: this.menuSelf,
          contentClass: this.contentClass,
          contentStyle: this.contentStyle
        },
        on: {
          'before-show': e => {
            this.showing = true
            this.$emit('before-show', e)
          },
          show: e => {
            this.$emit('show', e)
            this.$emit('input', true)
          },
          'before-hide': e => {
            this.showing = false
            this.$emit('before-hide', e)
          },
          hide: e => {
            this.$emit('hide', e)
            this.$emit('input', false)
          }
        }
      }, slot(this, 'default'))
    ]

    const Btn = h(QBtn, {
      class: `q-btn-dropdown${this.split === true ? '--current' : ' q-btn-dropdown--simple'}`,
      props: {
        ...this.$props,
        noWrap: true,
        iconRight: this.split === true ? this.iconRight : null
      },
      on: {
        click: e => {
          this.split === true && this.hide()
          this.disable !== true && this.$emit('click', e)
        }
      }
    }, this.split !== true ? Arrow : null)

    if (this.split === false) {
      return Btn
    }

    return h(QBtnGroup, {
      props: {
        outline: this.outline,
        flat: this.flat,
        rounded: this.rounded,
        push: this.push,
        unelevated: this.unelevated,
        glossy: this.glossy
      },
      staticClass: 'q-btn-dropdown q-btn-dropdown--split no-wrap q-btn-item',
      class: this.stretch === true ? 'self-stretch no-border-radius' : null
    }, [
      Btn,

      h(QBtn, {
        staticClass: 'q-btn-dropdown__arrow-container',
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
        }
      }, Arrow)
    ])
  },

  methods: {
    toggle (evt) {
      this.$refs.menu && this.$refs.menu.toggle(evt)
    },
    show (evt) {
      this.$refs.menu && this.$refs.menu.show(evt)
    },
    hide (evt) {
      this.$refs.menu && this.$refs.menu.hide(evt)
    }
  },

  mounted () {
    this.value === true && this.show()
  }
})
