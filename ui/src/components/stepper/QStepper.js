import { computed, h, provide, shallowRef, watch, withDirectives } from 'vue'

import StepHeader from './StepHeader.js'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import usePanel, {
  usePanelEmits,
  usePanelProps
} from '../../composables/private.use-panel/use-panel.js'

import { createComponent } from '../../utils/private.create/create.js'
import { stepperKey } from '../../utils/private.symbols/symbols.js'
import { hMergeSlot, hSlot } from '../../utils/private.render/render.js'

const camelRE = /(-\w)/g

// KeepAlive's own include/exclude matching
function matchesName(pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.some(entry => matchesName(entry, name))
  }

  if (typeof pattern === 'string') {
    return pattern.split(',').includes(name)
  }

  if (pattern instanceof RegExp) {
    pattern.lastIndex = 0
    return pattern.test(name)
  }

  return false
}

function camelizeProps(props) {
  const acc = {}
  for (const key in props) {
    const newKey = key.replace(camelRE, m => m[1].toUpperCase())
    acc[newKey] = props[key]
  }
  return acc
}

export default /*#__PURE__*/ createComponent({
  name: 'QStepper',

  props: {
    ...useDarkProps,
    ...usePanelProps,

    flat: Boolean,
    bordered: Boolean,
    alternativeLabels: Boolean,
    headerNav: Boolean,
    contracted: Boolean,
    headerClass: String,

    inactiveColor: String,
    inactiveIcon: String,
    doneIcon: String,
    doneColor: String,
    activeIcon: String,
    activeColor: String,
    errorIcon: String,
    errorColor: String
  },

  emits: usePanelEmits,

  setup(props, { slots }) {
    const $q = useQuasar()
    const isDark = useDark(props, $q)

    const {
      updatePanelsList,
      isValidPanelName,
      updatePanelIndex,
      getPanels,
      panelTransition,
      panelDirectives,
      goToPanel,
      keepAliveProps,
      needsUniqueKeepAliveWrapper
    } = usePanel()

    // each step caches its content in a KeepAlive of its own (which is
    // what keeps the content across an orientation switch), so
    // keep-alive-max cannot be counted natively: the stepper tracks the
    // activation order of the visited steps and evicts the surplus
    // through the `include` list instead
    const keepAliveOrder = shallowRef([])

    watch(
      () => props.modelValue,
      name => {
        if (props.keepAliveMax === void 0 || !isValidPanelName(name)) return

        const key = String(name)
        const order = keepAliveOrder.value.filter(entry => entry !== key)
        order.push(key)

        if (order.length > props.keepAliveMax) {
          order.splice(0, order.length - props.keepAliveMax)
        }

        keepAliveOrder.value = order
      },
      { immediate: true }
    )

    const stepKeepAliveProps = computed(() =>
      props.keepAliveMax === void 0
        ? keepAliveProps.value
        : {
            include:
              props.keepAliveInclude === void 0
                ? keepAliveOrder.value
                : keepAliveOrder.value.filter(name =>
                    matchesName(props.keepAliveInclude, name)
                  ),
            exclude: props.keepAliveExclude
          }
    )

    const stepNeedsUniqueKeepAliveWrapper = computed(
      () => props.keepAliveMax !== void 0 || needsUniqueKeepAliveWrapper.value
    )

    provide(
      stepperKey,
      computed(() => ({
        goToPanel,
        keepAliveProps: stepKeepAliveProps,
        needsUniqueKeepAliveWrapper: stepNeedsUniqueKeepAliveWrapper,
        panelTransition,
        ...props
      }))
    )

    const classes = computed(
      () =>
        `q-stepper q-stepper--${props.vertical ? 'vertical' : 'horizontal'}` +
        (props.flat ? ' q-stepper--flat' : '') +
        (props.bordered ? ' q-stepper--bordered' : '') +
        (isDark() ? ' q-stepper--dark q-dark' : '')
    )

    const headerClasses = computed(
      () =>
        'q-stepper__header row items-stretch justify-between' +
        ` q-stepper__header--${props.alternativeLabels ? 'alternative' : 'standard'}-labels` +
        (props.bordered || !props.flat ? ' q-stepper__header--border' : '') +
        (props.contracted ? ' q-stepper__header--contracted' : '') +
        (props.headerClass !== void 0 ? ` ${props.headerClass}` : '')
    )

    const contentClass = computed(
      () => 'q-stepper__content' + (props.vertical ? '' : ' q-panel-parent')
    )

    // the swipe directive stays attached across an orientation switch
    // (Vue never unbinds a directive that merely disappears from the
    // vnode), so a vertical stepper only blanks its handler
    const contentDirectives = computed(() => {
      if (!props.vertical) return panelDirectives.value

      const [directive, , arg, modifiers] = panelDirectives.value[0]
      return [[directive, void 0, arg, modifiers]]
    })

    function getContent() {
      const top = hSlot(slots.message, [])

      if (isValidPanelName(props.modelValue)) updatePanelIndex()

      // every step is rendered in both orientations (an inactive
      // horizontal step renders an empty root), so a step's instance and
      // its content survive a switch; the keys pin the header row and
      // the content to their own vnodes when the row comes and goes
      const content = withDirectives(
        h(
          'div',
          { key: 'content', class: contentClass.value },
          hSlot(slots.default)
        ),
        contentDirectives.value
      )

      if (props.vertical) {
        // oxlint-disable-next-line unicorn/prefer-spread
        return top === void 0 ? [content] : top.concat(content)
      }

      return [
        h(
          'div',
          { key: 'header', class: headerClasses.value },
          getPanels().map(panel => {
            const step = camelizeProps(panel.props)

            return h(StepHeader, {
              key: step.name,
              stepper: props,
              step,
              goToPanel
            })
          })
        ),

        top,

        content
      ]
    }

    return () => {
      updatePanelsList(slots)

      return h(
        'div',
        {
          class: classes.value
        },
        hMergeSlot(slots.navigation, getContent())
      )
    }
  }
})
