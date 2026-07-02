import { computed } from 'vue'

export default function usePageContainer($layout, $q) {
  const style = computed(() => {
    const css = {}

    if ($layout.header.space) {
      css.paddingTop = `${$layout.header.size}px`
    }
    if ($layout.right.space) {
      css[`padding${$q.lang.rtl ? 'Left' : 'Right'}`] =
        `${$layout.right.size}px`
    }
    if ($layout.footer.space) {
      css.paddingBottom = `${$layout.footer.size}px`
    }
    if ($layout.left.space) {
      css[`padding${$q.lang.rtl ? 'Right' : 'Left'}`] = `${$layout.left.size}px`
    }

    return css
  })

  return {
    style
  }
}
