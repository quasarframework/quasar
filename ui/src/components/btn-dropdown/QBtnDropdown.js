import { h, defineComponent } from 'vue'

import BtnMixin from '../../mixins/btn.js'

import QIcon from '../icon/QIcon.js'
import QBtn from '../btn/QBtn.js'
import QBtnGroup from '../btn-group/QBtnGroup.js'
import QMenu from '../menu/QMenu.js'

import { stop } from '../../utils/event.js'
import { hSlot } from '../../utils/render.js'

export default defineComponent({
  name: 'QBtnDropdown',

  mixins: [BtnMixin],

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
      default: 'bottom end'
    },
    menuSelf: {
      type: String,
      default: 'top end'
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
      this.$refs.menu && this.$refs.menu[ val ? 'show' : 'hide' ]()
    },

    split () {
      this.hide()
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
        attrs[ 'aria-disabled' ] = 'true'
      }

      return attrs
    }
  },

  methods: {
    __onBeforeShow (e) {
      this.showing = true
      this.$emit('before-show', e)
    },

    __onShow (e) {
      this.$emit('show', e)
      this.$emit('update:modelValue', true)
    },

    __onBeforeHide (e) {
      this.showing = false
      this.$emit('before-hide', e)
    },

    __onHide (e) {
      this.$emit('hide', e)
      this.$emit('update:modelValue', false)
    },

    __onClick (e) {
      this.$emit('click', e)
    },

    __onClickHide (e) {
      stop(e)
      this.hide()
      this.$emit('click', e)
    },

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
        'onBefore-show': this.__onBeforeShow,
        onShow: this.__onShow,
        'onBefore-hide': this.__onBeforeHide,
        onHide: this.__onHide
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
        onClick: this.__onClick
      }, () => hSlot(this, 'label', []).concat(Arrow))
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
        onClick: this.__onClickHide
      }, this.$slots.label),

      h(QBtn, {
        class: 'q-btn-dropdown__arrow-container q-anchor--skip',
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

  mounted () {
    this.modelValue === true && this.show()
  }
})
