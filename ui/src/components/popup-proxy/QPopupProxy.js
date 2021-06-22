import { h, defineComponent, ref, computed, watch, getCurrentInstance } from 'vue'

import QDialog from '../dialog/QDialog.js'
import QMenu from '../menu/QMenu.js'

import useAnchor, { useAnchorProps } from '../../composables/private/use-anchor.js'
import { hSlot } from '../../utils/private/render.js'

export default defineComponent({
  name: 'QPopupProxy',

  props: {
    ...useAnchorProps,

    breakpoint: {
      type: [ String, Number ],
      default: 450
    }
  },

  emits: [ 'show', 'hide' ],

  setup (props, { slots, emit, attrs }) {
    const { proxy } = getCurrentInstance()
    const { $q } = proxy

    const showing = ref(false)
    const popupRef = ref(null)
    const breakpoint = computed(() => parseInt(props.breakpoint, 10))

    const { canShow } = useAnchor({ showing })

    function getType () {
      return $q.screen.width < breakpoint.value || $q.screen.height < breakpoint.value
        ? 'dialog'
        : 'menu'
    }

    const type = ref(getType())

    watch(() => getType(), val => {
      if (showing.value !== true) {
        type.value = val
      }
    })

    // expose public methods
    Object.assign(proxy, {
      show (evt) { canShow(evt) === true && popupRef.value.show(evt) },
      hide (evt) { popupRef.value.hide(evt) },
      toggle (evt) { popupRef.value.toggle(evt) }
    })

    function onShow (evt) {
      showing.value = true
      emit('show', evt)
    }

    function onHide (evt) {
      showing.value = false
      type.value = getType()
      emit('hide', evt)
    }

    return () => {
      const def = hSlot(slots.default)

      const popupProps = (
        type.value === 'menu'
        && def !== void 0
        && def[ 0 ] !== void 0
        && def[ 0 ].type !== void 0
        && [ 'QDate', 'QTime', 'QCarousel', 'QColor' ].includes(
          def[ 0 ].type.name
        )
      ) ? { cover: true, maxHeight: '99vh' } : {}

      const data = {
        ref: popupRef,
        ...popupProps,
        ...attrs,
        onShow,
        onHide
      }

      let component

      if (type.value === 'dialog') {
        component = QDialog
      }
      else {
        component = QMenu
        Object.assign(data, {
          target: props.target,
          contextMenu: props.contextMenu,
          noParentEvent: true,
          separateClosePopup: true
        })
      }

      return h(component, data, () => def)
    }
  }
})
