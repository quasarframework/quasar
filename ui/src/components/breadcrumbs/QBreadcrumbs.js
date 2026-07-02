import { h } from 'vue'

import useBreadcrumbs, { useBreadcrumbsProps } from './use-breadcrumbs.js'
import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'
import { getNormalizedVNodes } from '../../utils/private.vm/vm.js'

const disabledValues = ['', true]

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/breadcrumbs
 */
/**
 * Default slot in the devland unslotted content of the component
 *
 * @api slot default
 */

/**
 * HTML or component you can slot in to separate the breadcrumbs
 *
 * @api slot separator
 */
export default createComponent({
  name: 'QBreadcrumbs',

  props: useBreadcrumbsProps,

  setup(props, { slots }) {
    const { classes, sepClass, activeClass } = useBreadcrumbs(props)

    return () => {
      if (slots.default === void 0) return

      const vnodes = getNormalizedVNodes(hSlot(slots.default))

      if (vnodes.length === 0) return

      let els = 1

      const child = [],
        len = vnodes.filter(c => c.type?.name === 'QBreadcrumbsEl').length,
        separator =
          slots.separator !== void 0 ? slots.separator : () => props.separator

      vnodes.forEach(comp => {
        if (comp.type?.name === 'QBreadcrumbsEl') {
          const middle = els < len
          const disabled =
            comp.props !== null && disabledValues.includes(comp.props.disable)

          const cls =
            (middle ? '' : ' q-breadcrumbs--last') +
            (!disabled && middle ? activeClass.value : '')

          els++

          child.push(
            h(
              'div',
              {
                class: `flex items-center${cls}`
              },
              [comp]
            )
          )

          if (middle) {
            child.push(
              h(
                'div',
                {
                  class: 'q-breadcrumbs__separator' + sepClass.value
                },
                separator()
              )
            )
          }
        } else {
          child.push(comp)
        }
      })

      return h(
        'div',
        {
          class: 'q-breadcrumbs'
        },
        [h('div', { class: classes.value }, child)]
      )
    }
  }
})
