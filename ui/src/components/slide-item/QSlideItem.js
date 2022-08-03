import { h, ref, computed, withDirectives, onBeforeUnmount, onBeforeUpdate, getCurrentInstance } from 'vue'

import TouchPan from '../../directives/TouchPan.js'

import useDark, { useDarkProps } from '../../composables/private/use-dark.js'
import useCache from '../../composables/private/use-cache.js'

import { createComponent } from '../../utils/private/create.js'
import { hSlot } from '../../utils/private/render.js'

const slotsDef = [
  [ 'left', 'center', 'start', 'width' ],
  [ 'right', 'center', 'end', 'width' ],
  [ 'top', 'start', 'center', 'height' ],
  [ 'bottom', 'end', 'center', 'height' ]
]

export default createComponent({
  name: 'QSlideItem',

  props: {
    ...useDarkProps,

    leftColor: String,
    rightColor: String,
    topColor: String,
    bottomColor: String,

    onSlide: Function
  },

  emits: [ 'action', 'top', 'right', 'bottom', 'left' ],

  setup (props, { slots, emit }) {
    const { proxy } = getCurrentInstance()
    const { $q } = proxy

    const isDark = useDark(props, $q)
    const { getCacheWithFn } = useCache()

    const contentRef = ref(null)

    let timer, pan = {}, dirRefs = {}, dirContentRefs = {}

    const langDir = computed(() => (
      $q.lang.rtl === true
        ? { left: 'right', right: 'left' }
        : { left: 'left', right: 'right' }
    ))

    const classes = computed(() =>
      'q-slide-item q-item-type overflow-hidden'
      + (isDark.value === true ? ' q-slide-item--dark q-dark' : '')
    )

    function reset () {
      contentRef.value.style.transform = 'translate(0,0)'
    }

    function emitSlide (side, ratio, isReset) {
      props.onSlide !== void 0 && emit('slide', { side, ratio, isReset })
    }

    function onPan (evt) {
      const node = contentRef.value

      if (evt.isFirst) {
        pan = {
          dir: null,
          size: { left: 0, right: 0, top: 0, bottom: 0 },
          scale: 0
        }

        node.classList.add('no-transition')

        slotsDef.forEach(slotName => {
          if (slots[ slotName[ 0 ] ] !== void 0) {
            const node = dirContentRefs[ slotName[ 0 ] ]
            node.style.transform = 'scale(1)'
            pan.size[ slotName[ 0 ] ] = node.getBoundingClientRect()[ slotName[ 3 ] ]
          }
        })

        pan.axis = (evt.direction === 'up' || evt.direction === 'down')
          ? 'Y'
          : 'X'
      }
      else if (evt.isFinal) {
        node.classList.remove('no-transition')

        if (pan.scale === 1) {
          node.style.transform = `translate${ pan.axis }(${ pan.dir * 100 }%)`

          timer = setTimeout(() => {
            emit(pan.showing, { reset })
            emit('action', { side: pan.showing, reset })
          }, 230)
        }
        else {
          node.style.transform = 'translate(0,0)'
          emitSlide(pan.showing, 0, true)
        }

        return
      }
      else {
        evt.direction = pan.axis === 'X'
          ? evt.offset.x < 0 ? 'left' : 'right'
          : evt.offset.y < 0 ? 'up' : 'down'
      }

      if (
        (slots.left === void 0 && evt.direction === langDir.value.right)
        || (slots.right === void 0 && evt.direction === langDir.value.left)
        || (slots.top === void 0 && evt.direction === 'down')
        || (slots.bottom === void 0 && evt.direction === 'up')
      ) {
        node.style.transform = 'translate(0,0)'
        return
      }

      let showing, dir, dist

      if (pan.axis === 'X') {
        dir = evt.direction === 'left' ? -1 : 1
        showing = dir === 1 ? langDir.value.left : langDir.value.right
        dist = evt.distance.x
      }
      else {
        dir = evt.direction === 'up' ? -2 : 2
        showing = dir === 2 ? 'top' : 'bottom'
        dist = evt.distance.y
      }

      if (pan.dir !== null && Math.abs(dir) !== Math.abs(pan.dir)) {
        return
      }

      if (pan.dir !== dir) {
        [ 'left', 'right', 'top', 'bottom' ].forEach(d => {
          if (dirRefs[ d ]) {
            dirRefs[ d ].style.visibility = showing === d
              ? 'visible'
              : 'hidden'
          }
        })
        pan.showing = showing
        pan.dir = dir
      }

      pan.scale = Math.max(0, Math.min(1, (dist - 40) / pan.size[ showing ]))

      node.style.transform = `translate${ pan.axis }(${ dist * dir / Math.abs(dir) }px)`
      dirContentRefs[ showing ].style.transform = `scale(${ pan.scale })`

      emitSlide(showing, pan.scale, false)
    }

    onBeforeUpdate(() => {
      dirRefs = {}
      dirContentRefs = {}
    })

    onBeforeUnmount(() => {
      clearTimeout(timer)
    })

    // expose public methods
    Object.assign(proxy, { reset })

    return () => {
      const
        content = [],
        slotsList = {
          left: slots[ langDir.value.right ] !== void 0,
          right: slots[ langDir.value.left ] !== void 0,
          up: slots.bottom !== void 0,
          down: slots.top !== void 0
        },
        dirs = Object.keys(slotsList).filter(key => slotsList[ key ] === true)

      slotsDef.forEach(slotName => {
        const dir = slotName[ 0 ]

        if (slots[ dir ] !== void 0) {
          content.push(
            h('div', {
              ref: el => { dirRefs[ dir ] = el },
              class: `q-slide-item__${ dir } absolute-full row no-wrap items-${ slotName[ 1 ] } justify-${ slotName[ 2 ] }`
                + (props[ dir + 'Color' ] !== void 0 ? ` bg-${ props[ dir + 'Color' ] }` : '')
            }, [
              h('div', { ref: el => { dirContentRefs[ dir ] = el } }, slots[ dir ]())
            ])
          )
        }
      })

      const node = h('div', {
        key: `${ dirs.length === 0 ? 'only-' : '' } content`,
        ref: contentRef,
        class: 'q-slide-item__content'
      }, hSlot(slots.default))

      if (dirs.length === 0) {
        content.push(node)
      }
      else {
        content.push(
          withDirectives(node, getCacheWithFn('dir#' + dirs.join(''), () => {
            const modifiers = {
              prevent: true,
              stop: true,
              mouse: true
            }

            dirs.forEach(dir => {
              modifiers[ dir ] = true
            })

            return [ [
              TouchPan,
              onPan,
              void 0,
              modifiers
            ] ]
          }))
        )
      }

      return h('div', { class: classes.value }, content)
    }
  }
})
