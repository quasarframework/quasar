import {
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'

import useQuasar from '../use-quasar/use-quasar.js'

import { clearSelection } from '../../utils/private.selection/selection.js'
import { addEvt, cleanEvt, prevent } from '../../utils/event/event.js'
import { isKeyCode } from '../../utils/private.keyboard/key-composition.js'

export const useAnchorStaticProps = {
  /* SSR/SSG does not know about Element */
  target: __QUASAR_SSR_SERVER__
    ? { default: true }
    : {
        type: [Boolean, String, Element],
        default: true
      },

  noParentEvent: Boolean
}

export const useAnchorProps = {
  ...useAnchorStaticProps,
  contextMenu: Boolean
}

// aria-expanded is not a global ARIA attribute: it is only valid on the
// roles below, so an anchor that computes to anything else (a bare <div>
// computes to "generic") must be left untouched
const expandableRoles = {
  application: true,
  button: true,
  checkbox: true,
  columnheader: true,
  combobox: true,
  gridcell: true,
  link: true,
  listbox: true,
  menuitem: true,
  menuitemcheckbox: true,
  menuitemradio: true,
  row: true,
  rowheader: true,
  switch: true,
  tab: true,
  treeitem: true
}

// the input types whose implicit ARIA role is "button"
const expandableInputTypes = {
  button: true,
  image: true,
  reset: true,
  submit: true
}

// aria-haspopup must name the popup's own ARIA role and only these
// roles can be named by it ('true' is a synonym for 'menu')
const popupRoles = {
  dialog: true,
  grid: true,
  listbox: true,
  menu: true,
  tree: true
}

function isExpandableControl(el) {
  const role = el.getAttribute('role')?.trim()

  if (role) {
    // a role attribute holding a fallback list resolves to its first
    // valid role; treating an unknown first token as unsupported keeps
    // us from writing an attribute that might not be allowed
    return Object.hasOwn(expandableRoles, role.split(/\s+/)[0])
  }

  const tag = el.tagName
  return (
    tag === 'BUTTON' ||
    (tag === 'A' && el.hasAttribute('href')) ||
    (tag === 'INPUT' && Object.hasOwn(expandableInputTypes, el.type))
  )
}

export default function useAnchor({
  showing,
  avoidEmit, // required for QPopupProxy (true)
  configureAnchorEl, // optional
  getPopupRole // optional; opts into wiring the anchor's popup ARIA (QMenu)
}) {
  const { props, proxy, emit } = getCurrentInstance()
  const $q = useQuasar()

  const anchorEl = ref(null)

  // the anchor is a foreign DOM node (never rendered by us), so its popup
  // ARIA gets applied imperatively; each attribute is managed only when
  // the devland has not already set it on the anchor itself
  let ariaEl = null,
    ownsExpanded = false,
    ownsHaspopup = false

  let touchTimer = null

  function canShow(evt) {
    // abort with no parent configured or on multi-touch
    return anchorEl.value === null
      ? false
      : evt === void 0 || evt.touches === void 0 || evt.touches.length <= 1
  }

  const anchorEvents = {}

  if (configureAnchorEl === void 0) {
    // default configureAnchorEl is designed for
    // QMenu & QPopupProxy (which is why it's handled here)

    Object.assign(anchorEvents, {
      hide(evt) {
        proxy.hide(evt)
      },

      toggle(evt) {
        proxy.toggle(evt)
        evt.qAnchorHandled = true
      },

      toggleKey(evt) {
        if (isKeyCode(evt, 13)) anchorEvents.toggle(evt)
      },

      contextClick(evt) {
        proxy.hide(evt)
        prevent(evt)
        nextTick(() => {
          proxy.show(evt)
          evt.qAnchorHandled = true
        })
      },

      prevent,

      mobileTouch(evt) {
        anchorEvents.mobileCleanup(evt)

        if (!canShow(evt)) return

        proxy.hide(evt)
        anchorEl.value.classList.add('non-selectable')

        const target = evt.target
        addEvt(anchorEvents, 'anchor', [
          [target, 'touchmove', 'mobileCleanup', 'passive'],
          [target, 'touchend', 'mobileCleanup', 'passive'],
          [target, 'touchcancel', 'mobileCleanup', 'passive'],
          [anchorEl.value, 'contextmenu', 'prevent', 'notPassive']
        ])

        touchTimer = setTimeout(() => {
          touchTimer = null
          proxy.show(evt)
          evt.qAnchorHandled = true
        }, 300)
      },

      mobileCleanup(evt) {
        anchorEl.value.classList.remove('non-selectable')

        if (touchTimer !== null) {
          clearTimeout(touchTimer)
          touchTimer = null
        }

        if (showing.value && evt !== void 0) {
          clearSelection()
        }
      }
    })

    // oxlint-disable-next-line func-name-matching
    configureAnchorEl = function configureAnchorElFn(
      context = props.contextMenu
    ) {
      if (props.noParentEvent || anchorEl.value === null) return

      const evts = context
        ? $q.platform.is.mobile
          ? [[anchorEl.value, 'touchstart', 'mobileTouch', 'passive']]
          : [
              [anchorEl.value, 'mousedown', 'hide', 'passive'],
              [anchorEl.value, 'contextmenu', 'contextClick', 'notPassive']
            ]
        : [
            [anchorEl.value, 'click', 'toggle', 'passive'],
            [anchorEl.value, 'keyup', 'toggleKey', 'passive']
          ]

      addEvt(anchorEvents, 'anchor', evts)
    }
  }

  function unconfigureAnchorEl() {
    cleanEvt(anchorEvents, 'anchor')
  }

  function configureAnchorAria() {
    if (
      getPopupRole === void 0 ||
      anchorEl.value === null ||
      // a context menu opens on right click / long tap, so its anchor is
      // not a control that the user can expand and collapse
      props.contextMenu
    ) {
      return
    }

    const el = anchorEl.value

    // an anchor that is not a control (a bare <div> computes to the
    // "generic" role) gets no popup ARIA at all: aria-expanded would be
    // invalid on it and aria-haspopup would describe a non-control
    if (!isExpandableControl(el)) return

    ownsExpanded = !el.hasAttribute('aria-expanded')
    ownsHaspopup = !el.hasAttribute('aria-haspopup')

    if (ownsExpanded || ownsHaspopup) {
      ariaEl = el
      updateAnchorAria()
    }
  }

  function updateAnchorAria() {
    if (ariaEl === null) return

    if (ownsExpanded) {
      ariaEl.setAttribute('aria-expanded', showing.value ? 'true' : 'false')
    }

    if (ownsHaspopup) {
      const role = getPopupRole()

      if (Object.hasOwn(popupRoles, role)) {
        ariaEl.setAttribute('aria-haspopup', role)
      } else {
        ariaEl.removeAttribute('aria-haspopup')
      }
    }
  }

  function unconfigureAnchorAria() {
    if (ariaEl === null) return

    if (ownsExpanded) ariaEl.removeAttribute('aria-expanded')
    if (ownsHaspopup) ariaEl.removeAttribute('aria-haspopup')

    ariaEl = null
    ownsExpanded = false
    ownsHaspopup = false
  }

  function setAnchorEl(el) {
    anchorEl.value = el
    while (anchorEl.value.classList.contains('q-anchor--skip')) {
      anchorEl.value = anchorEl.value.parentNode
    }
    configureAnchorEl()
  }

  function pickAnchorEl() {
    if (
      props.target === false ||
      props.target === '' ||
      proxy.$el.parentNode === null
    ) {
      anchorEl.value = null
    } else if (props.target === true) {
      setAnchorEl(proxy.$el.parentNode)
    } else {
      let el = props.target

      if (typeof props.target === 'string') {
        try {
          el = document.querySelector(props.target)
        } catch {
          el = void 0
        }
      }

      if (el !== void 0 && el !== null) {
        anchorEl.value = el.$el || el
        configureAnchorEl()
      } else {
        anchorEl.value = null
        console.error(`Anchor: target "${props.target}" not found`)
      }
    }

    configureAnchorAria()
  }

  watch(
    () => props.contextMenu,
    val => {
      if (anchorEl.value !== null) {
        unconfigureAnchorEl()
        configureAnchorEl(val)

        // a context menu anchor gets no popup ARIA
        unconfigureAnchorAria()
        configureAnchorAria()
      }
    }
  )

  watch(
    () => props.target,
    () => {
      if (anchorEl.value !== null) {
        unconfigureAnchorEl()
        unconfigureAnchorAria()
      }

      pickAnchorEl()
    }
  )

  watch(
    () => props.noParentEvent,
    val => {
      if (anchorEl.value !== null) {
        if (val) {
          unconfigureAnchorEl()
        } else {
          configureAnchorEl()
        }
      }
    }
  )

  if (getPopupRole !== void 0) {
    watch(showing, updateAnchorAria)
  }

  onMounted(() => {
    pickAnchorEl()

    if (!avoidEmit && props.modelValue && anchorEl.value === null) {
      emit('update:modelValue', false)
    }
  })

  onBeforeUnmount(() => {
    if (touchTimer !== null) clearTimeout(touchTimer)
    unconfigureAnchorEl()
    unconfigureAnchorAria()
  })

  return {
    anchorEl,
    canShow,
    anchorEvents
  }
}
