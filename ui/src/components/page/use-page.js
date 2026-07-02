import { computed } from 'vue'

export const usePageProps = {
  /**
   * Applies a default responsive page padding
   *
   * @api prop padding
   * @type {Boolean}
   * @category style
   */
  padding: Boolean,

  /**
   * Override default CSS style applied to the component; Function(offset, height) should return an Object
   *
   * @api prop style-fn
   * @type {Function}
   * @category style
   * @param {Number} offset Header + footer offset, in pixels
   * @param {Number} height Layout container height, in pixels
   * @returns {Object}
   */
  styleFn: Function
}

export default function usePage(props, $layout, $q) {
  const style = computed(() => {
    const offset =
      ($layout.header.space ? $layout.header.size : 0) +
      ($layout.footer.space ? $layout.footer.size : 0)

    if (typeof props.styleFn === 'function') {
      const height = $layout.isContainer.value
        ? $layout.containerHeight.value
        : $q.screen.height

      return props.styleFn(offset, height)
    }

    return {
      minHeight: $layout.isContainer.value
        ? $layout.containerHeight.value - offset + 'px'
        : $q.screen.height === 0
          ? offset !== 0
            ? `calc(100vh - ${offset}px)`
            : '100vh'
          : $q.screen.height - offset + 'px'
    }
  })

  const classes = computed(
    () => `q-page${props.padding ? ' q-layout-padding' : ''}`
  )

  return {
    classes,
    style
  }
}
