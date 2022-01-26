import { h, ref, computed, watch, onMounted, getCurrentInstance } from 'vue'

import QIcon from '../icon/QIcon.js'
import QBtn from '../btn/QBtn.js'
import QBtnGroup from '../btn-group/QBtnGroup.js'
import QMenu from '../menu/QMenu.js'

import { useBtnProps } from '../btn/use-btn.js'

import { createComponent } from '../../utils/private/create.js'
import { stop } from '../../utils/event.js'
import { hSlot } from '../../utils/private/render.js'

export default createComponent({
  name: 'QBtnDropdown',

  props: {
    ...useBtnProps,

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

  setup (props, { slots, emit }) {
    const { proxy } = getCurrentInstance()

    const showing = ref(props.modelValue)
    const menuRef = ref(null)

    const attributes = computed(() => {
      const acc = {
        'aria-expanded': showing.value === true ? 'true' : 'false',
        'aria-haspopup': 'true'
      }

      if (
        props.disable === true
        || (
          (props.split === false && props.disableMainBtn === true)
          || props.disableDropdown === true
        )
      ) {
        acc[ 'aria-disabled' ] = 'true'
      }

      return acc
    })

    const iconClass = computed(() =>
      'q-btn-dropdown__arrow'
      + (showing.value === true && props.noIconAnimation === false ? ' rotate-180' : '')
      + (props.split === false ? ' q-btn-dropdown__arrow-container' : '')
    )

    watch(() => props.modelValue, val => {
      menuRef.value !== null && menuRef.value[ val ? 'show' : 'hide' ]()
    })

    watch(() => props.split, hide)

    function onBeforeShow (e) {
      showing.value = true
      emit('before-show', e)
    }

    function onShow (e) {
      emit('show', e)
      emit('update:modelValue', true)
    }

    function onBeforeHide (e) {
      showing.value = false
      emit('before-hide', e)
    }

    function onHide (e) {
      emit('hide', e)
      emit('update:modelValue', false)
    }

    function onClick (e) {
      emit('click', e)
    }

    function onClickHide (e) {
      stop(e)
      hide()
      emit('click', e)
    }

    function toggle (evt) {
      menuRef.value !== null && menuRef.value.toggle(evt)
    }

    function show (evt) {
      menuRef.value !== null && menuRef.value.show(evt)
    }

    function hide (evt) {
      menuRef.value !== null && menuRef.value.hide(evt)
    }

    // expose public methods
    Object.assign(proxy, {
      show, hide, toggle
    })

    onMounted(() => {
      props.modelValue === true && show()
    })

    return () => {
      const Arrow = [
        h(QIcon, {
          class: iconClass.value,
          name: props.dropdownIcon || proxy.$q.iconSet.arrow.dropdown
        })
      ]

      props.disableDropdown !== true && Arrow.push(
        h(QMenu, {
          ref: menuRef,
          class: props.contentClass,
          style: props.contentStyle,
          cover: props.cover,
          fit: true,
          persistent: props.persistent,
          noRouteDismiss: props.noRouteDismiss,
          autoClose: props.autoClose,
          anchor: props.menuAnchor,
          self: props.menuSelf,
          offset: props.menuOffset,
          separateClosePopup: true,
          onBeforeShow,
          onShow,
          onBeforeHide,
          onHide
        }, slots.default)
      )

      if (props.split === false) {
        return h(QBtn, {
          class: 'q-btn-dropdown q-btn-dropdown--simple',
          ...props,
          disable: props.disable === true || props.disableMainBtn === true,
          noWrap: true,
          round: false,
          ...attributes.value,
          onClick
        }, () => hSlot(slots.label, []).concat(Arrow))
      }

      return h(QBtnGroup, {
        class: 'q-btn-dropdown q-btn-dropdown--split no-wrap q-btn-item',
        outline: props.outline,
        flat: props.flat,
        rounded: props.rounded,
        push: props.push,
        unelevated: props.unelevated,
        glossy: props.glossy,
        stretch: props.stretch
      }, () => [
        h(QBtn, {
          class: 'q-btn-dropdown--current',
          ...props,
          disable: props.disable === true || props.disableMainBtn === true,
          noWrap: true,
          iconRight: props.iconRight,
          round: false,
          onClick: onClickHide
        }, slots.label),

        h(QBtn, {
          class: 'q-btn-dropdown__arrow-container q-anchor--skip',
          ...attributes.value,
          disable: props.disable === true || props.disableDropdown === true,
          outline: props.outline,
          flat: props.flat,
          rounded: props.rounded,
          push: props.push,
          size: props.size,
          color: props.color,
          textColor: props.textColor,
          dense: props.dense,
          ripple: props.ripple
        }, () => Arrow)
      ])
    }
  }
})
