import { computed, getCurrentInstance, h, ref, shallowRef, watch } from 'vue'

import QDialog from '../dialog/QDialog.js'
import QMenu from '../menu/QMenu.js'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import useAnchor, {
  useAnchorProps
} from '../../composables/private.use-anchor/use-anchor.js'

import { createComponent } from '../../utils/private.create/create.js'
import { injectProp } from '../../utils/private.inject-obj-prop/inject-obj-prop.js'

export default /*#__PURE__*/ createComponent({
  name: 'QPopupProxy',

  props: {
    ...useAnchorProps,

    breakpoint: {
      type: [String, Number],
      default: 450
    }
  },

  emits: ['show', 'hide'],

  setup(props, { slots, emit, attrs }) {
    const { proxy } = getCurrentInstance()
    const $q = useQuasar()

    const showing = ref(false)
    const popupRef = shallowRef(null)
    const breakpoint = computed(() => Number.parseInt(props.breakpoint, 10))

    const { canShow } = useAnchor({ showing, avoidEmit: true })

    function getType() {
      return $q.screen.width < breakpoint.value ||
        $q.screen.height < breakpoint.value
        ? 'dialog'
        : 'menu'
    }

    const type = ref(getType())

    const popupProps = computed(() =>
      type.value === 'menu' ? { maxHeight: '99vh' } : {}
    )

    watch(
      () => getType(),
      val => {
        if (!showing.value) type.value = val
      }
    )

    function onShow(evt) {
      showing.value = true
      emit('show', evt)
    }

    function onHide(evt) {
      showing.value = false
      type.value = getType()
      emit('hide', evt)
    }

    // expose public methods
    Object.assign(proxy, {
      show(evt) {
        if (canShow(evt)) popupRef.value.show(evt)
      },
      hide(evt) {
        popupRef.value.hide(evt)
      },
      toggle(evt) {
        popupRef.value.toggle(evt)
      }
    })

    injectProp(proxy, 'currentComponent', () => ({
      type: type.value,
      ref: popupRef.value
    }))

    return () => {
      const data = {
        ref: popupRef,
        ...popupProps.value,
        ...attrs,
        onShow,
        onHide
      }

      let component

      if (type.value === 'dialog') {
        component = QDialog
      } else {
        component = QMenu
        Object.assign(data, {
          target: props.target,
          contextMenu: props.contextMenu,
          noParentEvent: true,
          separateClosePopup: true
        })
      }

      return h(component, data, slots.default)
    }
  }
})
