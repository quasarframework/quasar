import { getCurrentInstance, h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hMergeSlot, hSlot } from '../../utils/private.render/render.js'

import useIcon, { useIconProps } from './use-icon.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/icon
 */
/**
 * Suggestions: QTooltip or QMenu
 *
 * @api slot default
 */
export default createComponent({
  name: 'QIcon',

  props: useIconProps,

  setup(props, { slots }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()
    const icon = useIcon(props, $q)

    return () => {
      const data = {
        class: icon.classes.value,
        style: icon.sizeStyle.value,
        'aria-hidden': 'true'
      }

      if (icon.type.value.none) {
        return h(props.tag, data, hSlot(slots.default))
      }

      if (icon.type.value.img) {
        return h(
          props.tag,
          data,
          hMergeSlot(slots.default, [h('img', { src: icon.type.value.src })])
        )
      }

      if (icon.type.value.svg) {
        return h(
          props.tag,
          data,
          hMergeSlot(slots.default, [
            h(
              'svg',
              {
                viewBox: icon.type.value.viewBox || '0 0 24 24'
              },
              icon.type.value.nodes
            )
          ])
        )
      }

      if (icon.type.value.svguse) {
        return h(
          props.tag,
          data,
          hMergeSlot(slots.default, [
            h(
              'svg',
              {
                viewBox: icon.type.value.viewBox
              },
              [h('use', { 'xlink:href': icon.type.value.src })]
            )
          ])
        )
      }

      if (icon.type.value.cls !== void 0) {
        data.class += ' ' + icon.type.value.cls
      }

      return h(
        props.tag,
        data,
        hMergeSlot(slots.default, [icon.type.value.content])
      )
    }
  }
})
