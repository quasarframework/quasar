import { h, ref, computed, watch, nextTick, getCurrentInstance, Transition, KeepAlive } from 'vue'

import TouchSwipe from '../../directives/TouchSwipe.js'

import useCache from '../../composables/private/use-cache.js'

import { hSlot } from '../../utils/private/render.js'
import { getNormalizedVNodes } from '../../utils/private/vm.js'

export const usePanelChildProps = {
  name: { required: true },
  disable: Boolean
}

const PanelWrapper = {
  setup (_, { slots }) {
    return () => h('div', {
      class: 'q-panel scroll',
      role: 'tabpanel'
    }, hSlot(slots.default))
  }
}

export const usePanelProps = {
  modelValue: {
    required: true
  },

  animated: Boolean,
  infinite: Boolean,
  swipeable: Boolean,
  vertical: Boolean,

  transitionPrev: String,
  transitionNext: String,
  transitionDuration: {
    type: [ String, Number ],
    default: 300
  },

  keepAlive: Boolean,
  keepAliveInclude: [ String, Array, RegExp ],
  keepAliveExclude: [ String, Array, RegExp ],
  keepAliveMax: Number
}

export const usePanelEmits = [ 'update:modelValue', 'beforeTransition', 'transition' ]

export default function () {
  const { props, emit, proxy } = getCurrentInstance()
  const { getCacheWithFn } = useCache()

  let panels, forcedPanelTransition

  const panelIndex = ref(null)
  const panelTransition = ref(null)

  function onSwipe (evt) {
    const dir = props.vertical === true ? 'up' : 'left'
    goToPanelByOffset((proxy.$q.lang.rtl === true ? -1 : 1) * (evt.direction === dir ? 1 : -1))
  }

  const panelDirectives = computed(() => {
    // if props.swipeable
    return [ [
      TouchSwipe,
      onSwipe,
      void 0,
      {
        horizontal: props.vertical !== true,
        vertical: props.vertical,
        mouse: true
      }
    ] ]
  })

  const transitionPrev = computed(() =>
    props.transitionPrev || `slide-${ props.vertical === true ? 'down' : 'right' }`
  )

  const transitionNext = computed(() =>
    props.transitionNext || `slide-${ props.vertical === true ? 'up' : 'left' }`
  )

  const transitionStyle = computed(
    () => `--q-transition-duration: ${ props.transitionDuration }ms`
  )

  const contentKey = computed(() => (
    typeof props.modelValue === 'string' || typeof props.modelValue === 'number'
      ? props.modelValue
      : String(props.modelValue)
  ))

  const keepAliveProps = computed(() => ({
    include: props.keepAliveInclude,
    exclude: props.keepAliveExclude,
    max: props.keepAliveMax
  }))

  const needsUniqueKeepAliveWrapper = computed(() =>
    props.keepAliveInclude !== void 0
    || props.keepAliveExclude !== void 0
  )

  watch(() => props.modelValue, (newVal, oldVal) => {
    const index = isValidPanelName(newVal) === true
      ? getPanelIndex(newVal)
      : -1

    if (forcedPanelTransition !== true) {
      updatePanelTransition(
        index === -1 ? 0 : (index < getPanelIndex(oldVal) ? -1 : 1)
      )
    }

    if (panelIndex.value !== index) {
      panelIndex.value = index
      emit('beforeTransition', newVal, oldVal)
      nextTick(() => {
        emit('transition', newVal, oldVal)
      })
    }
  })

  function nextPanel () { goToPanelByOffset(1) }
  function previousPanel () { goToPanelByOffset(-1) }

  function goToPanel (name) {
    emit('update:modelValue', name)
  }

  function isValidPanelName (name) {
    return name !== void 0 && name !== null && name !== ''
  }

  function getPanelIndex (name) {
    return panels.findIndex(panel => {
      return panel.props.name === name
        && panel.props.disable !== ''
        && panel.props.disable !== true
    })
  }

  function getEnabledPanels () {
    return panels.filter(panel => {
      return panel.props.disable !== ''
        && panel.props.disable !== true
    })
  }

  function updatePanelTransition (direction) {
    const val = direction !== 0 && props.animated === true && panelIndex.value !== -1
      ? 'q-transition--' + (direction === -1 ? transitionPrev.value : transitionNext.value)
      : null

    if (panelTransition.value !== val) {
      panelTransition.value = val
    }
  }

  function goToPanelByOffset (direction, startIndex = panelIndex.value) {
    let index = startIndex + direction

    while (index > -1 && index < panels.length) {
      const opt = panels[ index ]

      if (
        opt !== void 0
        && opt.props.disable !== ''
        && opt.props.disable !== true
      ) {
        updatePanelTransition(direction)
        forcedPanelTransition = true
        emit('update:modelValue', opt.props.name)
        setTimeout(() => {
          forcedPanelTransition = false
        })
        return
      }

      index += direction
    }

    if (props.infinite === true && panels.length !== 0 && startIndex !== -1 && startIndex !== panels.length) {
      goToPanelByOffset(direction, direction === -1 ? panels.length : -1)
    }
  }

  function updatePanelIndex () {
    const index = getPanelIndex(props.modelValue)

    if (panelIndex.value !== index) {
      panelIndex.value = index
    }

    return true
  }

  function getPanelContentChild () {
    const panel = isValidPanelName(props.modelValue) === true
      && updatePanelIndex()
      && panels[ panelIndex.value ]

    return props.keepAlive === true
      ? [
          h(KeepAlive, keepAliveProps.value, [
            h(
              needsUniqueKeepAliveWrapper.value === true
                ? getCacheWithFn(contentKey.value, () => ({ ...PanelWrapper, name: contentKey.value }))
                : PanelWrapper,
              { key: contentKey.value, style: transitionStyle.value },
              () => panel
            )
          ])
        ]
      : [
          h('div', {
            class: 'q-panel scroll',
            style: transitionStyle.value,
            key: contentKey.value,
            role: 'tabpanel'
          }, [ panel ])
        ]
  }

  function getPanelContent () {
    if (panels.length === 0) {
      return
    }

    return props.animated === true
      ? [ h(Transition, { name: panelTransition.value }, getPanelContentChild) ]
      : getPanelContentChild()
  }

  function updatePanelsList (slots) {
    panels = getNormalizedVNodes(
      hSlot(slots.default, [])
    ).filter(
      panel => panel.props !== null
        && panel.props.slot === void 0
        && isValidPanelName(panel.props.name) === true
    )

    return panels.length
  }

  function getPanels () {
    return panels
  }

  // expose public methods
  Object.assign(proxy, {
    next: nextPanel,
    previous: previousPanel,
    goTo: goToPanel
  })

  return {
    panelIndex,
    panelDirectives,

    updatePanelsList,
    updatePanelIndex,

    getPanelContent,
    getEnabledPanels,
    getPanels,

    isValidPanelName,

    keepAliveProps,
    needsUniqueKeepAliveWrapper,

    goToPanelByOffset,
    goToPanel,

    nextPanel,
    previousPanel
  }
}
