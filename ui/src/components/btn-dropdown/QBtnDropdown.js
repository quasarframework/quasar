import { h, defineComponent } from 'vue'

import BtnMixin from '../../mixins/btn.js'

import QIcon from '../icon/QIcon.js'
import QBtn from '../btn/QBtn.js'
import QBtnGroup from '../btn-group/QBtnGroup.js'
import QMenu from '../menu/QMenu.js'

import { slot } from '../../utils/slot.js'
import cache from '../../utils/cache.js'

export default defineComponent({
  name: 'QBtnDropdown',

  mixins: [ BtnMixin ],

  props: {
    modelValue: Boolean,
    split: Boolean,
    dropdownIcon: String,

    contentClass: [ Array, String, Object ],
    contentStyle: [ Array, String, Object ],

    cover: Boolean,
    persistent: Boolean,
    noRouteDismiss: Boolean,
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
    disableDropdown: Boolean,

    noIconAnimation: Boolean
  },

  emits: [ 'update:modelValue', 'click', 'before-show', 'show', 'before-hide', 'hide' ],

  data () {
    return {
      showing: this.modelValue
    }
  },

  watch: {
    modelValue (val) {
      this.$refs.menu !== void 0 && this.$refs.menu[val ? 'show' : 'hide']()
    }
  },

  computed: {
    attrs () {
      const attrs = {
        'aria-expanded': this.showing === true ? 'true' : 'false',
        'aria-haspopup': 'true'
      }

      if (
        this.disable === true ||
        (
          (this.split === false && this.disableMainBtn === true) ||
          this.disableDropdown === true
        )
      ) {
        attrs['aria-disabled'] = 'true'
      }

      return attrs
    }
  },

  render () {
    const Arrow = [
      h(QIcon, {
        class: 'q-btn-dropdown__arrow' +
          (this.showing === true && this.noIconAnimation === false ? ' rotate-180' : '') +
          (this.split === false ? ' q-btn-dropdown__arrow-container' : ''),
        name: this.dropdownIcon || this.$q.iconSet.arrow.dropdown
      })
    ]

    this.disableDropdown !== true && Arrow.push(
      h(QMenu, {
        ref: 'menu',
        cover: this.cover,
        fit: true,
        persistent: this.persistent,
        noRouteDismiss: this.noRouteDismiss,
        autoClose: this.autoClose,
        anchor: this.menuAnchor,
        self: this.menuSelf,
        offset: this.menuOffset,
        contentClass: this.contentClass,
        contentStyle: this.contentStyle,
        separateClosePopup: true,
        ...cache(this, 'menu', {
          'onBefore-show': e => {
            this.showing = true
            this.$emit('before-show', e)
          },
          onShow: e => {
            this.$emit('show', e)
            this.$emit('update:modelValue', true)
          },
          'onBefore-hide': e => {
            this.showing = false
            this.$emit('before-hide', e)
          },
          onHide: e => {
            this.$emit('hide', e)
            this.$emit('update:modelValue', false)
          }
        })
      }, this.$slots.default)
    )

    if (this.split === false) {
      return h(QBtn, {
        class: 'q-btn-dropdown q-btn-dropdown--simple',
        ...this.$props,
        disable: this.disable === true || this.disableMainBtn === true,
        noWrap: true,
        round: false,
        ...this.attrs,
        ...cache(this, 'nonSpl', {
          onClick: e => {
            this.$emit('click', e)
          }
        })
      }, () => slot(this, 'label', []).concat(Arrow))
    }

    return h(QBtnGroup, {
      class: 'q-btn-dropdown q-btn-dropdown--split no-wrap q-btn-item',
      outline: this.outline,
      flat: this.flat,
      rounded: this.rounded,
      push: this.push,
      unelevated: this.unelevated,
      glossy: this.glossy,
      stretch: this.stretch
    }, () => [
      h(QBtn, {
        class: 'q-btn-dropdown--current',
        ...this.$props,
        disable: this.disable === true || this.disableMainBtn === true,
        noWrap: true,
        iconRight: this.iconRight,
        round: false,
        ...cache(this, 'spl', {
          onClick: e => {
            this.hide()
            this.$emit('click', e)
          }
        })
      }, this.$slots.label),

      h(QBtn, {
        class: 'q-btn-dropdown__arrow-container',
        ...this.attrs,
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
      }, () => Arrow)
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
    this.modelValue === true && this.show()
  }
})
