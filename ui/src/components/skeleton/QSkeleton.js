import { getCurrentInstance, h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

import useSkeleton, { useSkeletonProps } from './use-skeleton.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/skeleton
 */
/**
 * Default slot in the devland unslotted content of the component
 *
 * @api slot default
 */
export default createComponent({
  name: 'QSkeleton',

  props: useSkeletonProps,

  setup(props, { slots }) {
    const vm = getCurrentInstance()
    const skeleton = useSkeleton(props, vm.proxy.$q)

    return () =>
      h(
        props.tag,
        {
          class: skeleton.classes.value,
          style: skeleton.style.value
        },
        hSlot(slots.default)
      )
  }
})
