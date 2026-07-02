import { getCurrentInstance, h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hUniqueSlot } from '../../utils/private.render/render.js'

import useItem, { useItemEmits, useItemProps } from './use-item.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/list-and-list-items
 */
/**
 * This is where QItem's content goes
 *
 * @api slot default
 */
export default createComponent({
  name: 'QItem',

  props: useItemProps,

  emits: useItemEmits,

  setup(props, { slots, emit }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()

    const item = useItem(props, emit, $q)

    function getContent() {
      const child = hUniqueSlot(slots.default, [])

      if (item.isClickable.value) {
        child.unshift(
          h('div', {
            class: 'q-focus-helper',
            tabindex: -1,
            ref: item.blurTargetRef
          })
        )
      }

      return child
    }

    return () => {
      const data = {
        ref: item.rootRef,
        class: item.classes.value,
        style: item.style.value,
        role: 'listitem',
        onClick: item.onClick,
        onKeyup: item.onKeyup
      }

      if (item.isClickable.value) {
        data.tabindex = props.tabindex || '0'
        Object.assign(data, item.linkAttrs.value)
      } else if (item.isActionable.value) {
        data['aria-disabled'] = 'true'
      }

      return h(item.linkTag.value, data, getContent())
    }
  }
})
