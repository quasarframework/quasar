import { h, computed, inject, getCurrentInstance } from 'vue'

import { hSlot } from '../../utils/private.render/render.js'
import { layoutKey, emptyRenderFn } from '../../utils/private.symbols/symbols.js'

export const usePageStickyProps = {
  position: {
    type: String,
    default: 'bottom-right',
    validator: v => [
      'top-right', 'top-left',
      'bottom-right', 'bottom-left',
      'top', 'right', 'bottom', 'left'
    ].includes(v)
  },
  offset: {
    type: Array,
    validator: v => v.length === 2
  },
  expand: Boolean
}

export default function () {
  const { props, proxy: { $q } } = getCurrentInstance()

  const $layout = inject(layoutKey, emptyRenderFn)
  if ($layout === emptyRenderFn) {
    console.error('QPageSticky needs to be child of QLayout')
    return emptyRenderFn
  }

  const attach = computed(() => {
    const pos = props.position

    return {
      top: pos.indexOf('top') !== -1,
      right: pos.indexOf('right') !== -1,
      bottom: pos.indexOf('bottom') !== -1,
      left: pos.indexOf('left') !== -1,
      vertical: pos === 'top' || pos === 'bottom',
      horizontal: pos === 'left' || pos === 'right'
    }
  })

  const top = computed(() => $layout.header.offset)
  const right = computed(() => $layout.right.offset)
  const bottom = computed(() => $layout.footer.offset)
  const left = computed(() => $layout.left.offset)

  const style = computed(() => {
    let posX = 0, posY = 0

    const side = attach.value
    const dir = $q.lang.rtl === true ? -1 : 1

    if (side.top === true && top.value !== 0) {
      posY = `${ top.value }px`
    }
    else if (side.bottom === true && bottom.value !== 0) {
      posY = `${ -bottom.value }px`
    }

    if (side.left === true && left.value !== 0) {
      posX = `${ dir * left.value }px`
    }
    else if (side.right === true && right.value !== 0) {
      posX = `${ -dir * right.value }px`
    }

    const css = { transform: `translate(${ posX }, ${ posY })` }

    if (props.offset) {
      css.margin = `${ props.offset[ 1 ] }px ${ props.offset[ 0 ] }px`
    }

    if (side.vertical === true) {
      if (left.value !== 0) {
        css[ $q.lang.rtl === true ? 'right' : 'left' ] = `${ left.value }px`
      }
      if (right.value !== 0) {
        css[ $q.lang.rtl === true ? 'left' : 'right' ] = `${ right.value }px`
      }
    }
    else if (side.horizontal === true) {
      if (top.value !== 0) {
        css.top = `${ top.value }px`
      }
      if (bottom.value !== 0) {
        css.bottom = `${ bottom.value }px`
      }
    }

    return css
  })

  const classes = computed(() =>
    `q-page-sticky row flex-center fixed-${ props.position }`
    + ` q-page-sticky--${ props.expand === true ? 'expand' : 'shrink' }`
  )

  function getStickyContent (slots) {
    const content = hSlot(slots.default)

    return h('div', {
      class: classes.value,
      style: style.value
    },
    props.expand === true
      ? content
      : [ h('div', content) ]
    )
  }

  return {
    $layout,
    getStickyContent
  }
}
