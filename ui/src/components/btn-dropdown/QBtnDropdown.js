import Vue from 'vue'

import BtnMixin from '../../mixins/btn.js'

import QIcon from '../icon/QIcon.js'
import QBtn from '../btn/QBtn.js'
import QBtnGroup from '../btn-group/QBtnGroup.js'
import QMenu from '../menu/QMenu.js'

import { slot } from '../../utils/slot.js'
import { cache } from '../../utils/vm.js'

export default Vue.extend({
  name: 'QBtnDropdown',

  mixins: [ BtnMixin ],

  props: {
    value: Boolean,
    split: Boolean,
    dropdownIcon: String,

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
    },
    menuOffset: Array,

    disableMainBtn: Boolean,
    disableDropdown: Boolean
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
    const label = slot(this, 'label', [])
    const attrs = { 'aria-expanded': this.showing === true ? 'true' : 'false', 'aria-haspopup': true }

    const Arrow = [
      h(QIcon, {
        props: {
          name: this.dropdownIcon || this.$q.iconSet.arrow.dropdown
        },
        staticClass: 'q-btn-dropdown__arrow',
        class: {
          'rotate-180': this.showing,
          'q-btn-dropdown__arrow-container': this.split === false
        }
      })
    ]

    this.disableDropdown !== true && Arrow.push(
      h(QMenu, {
        ref: 'menu',
        props: {
          cover: this.cover,
          fit: true,
          persistent: this.persistent,
          autoClose: this.autoClose,
          anchor: this.menuAnchor,
          self: this.menuSelf,
          offset: this.menuOffset,
          contentClass: this.contentClass,
          contentStyle: this.contentStyle,
          separateClosePopup: true
        },
        on: cache(this, 'menu', {
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
        })
      }, slot(this, 'default'))
    )

    if (this.split === false) {
      return h(QBtn, {
        class: 'q-btn-dropdown q-btn-dropdown--simple',
        props: {
          ...this.$props,
          disable: this.disable === true || this.disableMainBtn === true,
          noWrap: true,
          round: false
        },
        attrs,
        on: cache(this, 'nonSpl', {
          click: e => {
            this.$emit('click', e)
          }
        })
      }, label.concat(Arrow))
    }

    const Btn = h(QBtn, {
      class: 'q-btn-dropdown--current',
      props: {
        ...this.$props,
        disable: this.disable === true || this.disableMainBtn === true,
        noWrap: true,
        iconRight: this.iconRight,
        round: false
      },
      on: cache(this, 'spl', {
        click: e => {
          this.hide()
          this.$emit('click', e)
        }
      })
    }, label)

    return h(QBtnGroup, {
      props: {
        outline: this.outline,
        flat: this.flat,
        rounded: this.rounded,
        push: this.push,
        unelevated: this.unelevated,
        glossy: this.glossy,
        stretch: this.stretch
      },
      staticClass: 'q-btn-dropdown q-btn-dropdown--split no-wrap q-btn-item'
    }, [
      Btn,

      h(QBtn, {
        staticClass: 'q-btn-dropdown__arrow-container',
        attrs,
        props: {
          disable: this.disable === true || this.disableDropdown === true,
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
