import { h, defineComponent, withDirectives } from 'vue'

import TouchPan from '../../directives/TouchPan.js'

import CacheMixin from '../../mixins/cache.js'
import DarkMixin from '../../mixins/dark.js'

import { hSlot } from '../../utils/render.js'

const slotsDef = [
  [ 'left', 'center', 'start', 'width' ],
  [ 'right', 'center', 'end', 'width' ],
  [ 'top', 'start', 'center', 'height' ],
  [ 'bottom', 'end', 'center', 'height' ]
]

export default defineComponent({
  name: 'QSlideItem',

  mixins: [ CacheMixin, DarkMixin ],

  props: {
    leftColor: String,
    rightColor: String,
    topColor: String,
    bottomColor: String
  },

  emits: [ 'action', 'top', 'right', 'bottom', 'left' ],

  directives: {
    TouchPan
  },

  computed: {
    langDir () {
      return this.$q.lang.rtl === true
        ? { left: 'right', right: 'left' }
        : { left: 'left', right: 'right' }
    },

    classes () {
      return 'q-slide-item q-item-type overflow-hidden' +
        (this.isDark === true ? ' q-slide-item--dark q-dark' : '')
    }
  },

  methods: {
    reset () {
      this.$refs.content.style.transform = 'translate(0,0)'
    },

    __pan (evt) {
      const node = this.$refs.content

      if (evt.isFirst) {
        this.__dir = null
        this.__size = { left: 0, right: 0, top: 0, bottom: 0 }
        this.__scale = 0

        node.classList.add('no-transition')

        slotsDef.forEach(slot => {
          if (this.$slots[ slot[ 0 ] ] !== void 0) {
            const node = this.$refs[ slot[ 0 ] + 'Content' ]
            node.style.transform = 'scale(1)'
            this.__size[ slot[ 0 ] ] = node.getBoundingClientRect()[ slot[ 3 ] ]
          }
        })

        this.__axis = (evt.direction === 'up' || evt.direction === 'down')
          ? 'Y'
          : 'X'
      }
      else if (evt.isFinal) {
        node.classList.remove('no-transition')

        if (this.__scale === 1) {
          node.style.transform = `translate${this.__axis}(${this.__dir * 100}%)`

          this.timer = setTimeout(() => {
            this.$emit(this.__showing, { reset: this.reset })
            this.$emit('action', { side: this.__showing, reset: this.reset })
          }, 230)
        }
        else {
          node.style.transform = 'translate(0,0)'
        }

        return
      }
      else {
        evt.direction = this.__axis === 'X'
          ? evt.offset.x < 0 ? 'left' : 'right'
          : evt.offset.y < 0 ? 'up' : 'down'
      }

      if (
        (this.$slots.left === void 0 && evt.direction === this.langDir.right) ||
        (this.$slots.right === void 0 && evt.direction === this.langDir.left) ||
        (this.$slots.top === void 0 && evt.direction === 'down') ||
        (this.$slots.bottom === void 0 && evt.direction === 'up')
      ) {
        node.style.transform = 'translate(0,0)'
        return
      }

      let showing, dir, dist

      if (this.__axis === 'X') {
        dir = evt.direction === 'left' ? -1 : 1
        showing = dir === 1 ? this.langDir.left : this.langDir.right
        dist = evt.distance.x
      }
      else {
        dir = evt.direction === 'up' ? -2 : 2
        showing = dir === 2 ? 'top' : 'bottom'
        dist = evt.distance.y
      }

      if (this.__dir !== null && Math.abs(dir) !== Math.abs(this.__dir)) {
        return
      }

      if (this.__dir !== dir) {
        [ 'left', 'right', 'top', 'bottom' ].forEach(d => {
          if (this.$refs[ d ]) {
            this.$refs[ d ].style.visibility = showing === d
              ? 'visible'
              : 'hidden'
          }
        })
        this.__showing = showing
        this.__dir = dir
      }

      this.__scale = Math.max(0, Math.min(1, (dist - 40) / this.__size[ showing ]))

      node.style.transform = `translate${this.__axis}(${dist * dir / Math.abs(dir)}px)`
      this.$refs[ `${showing}Content` ].style.transform = `scale(${this.__scale})`
    }
  },

  render () {
    const
      content = [],
      slots = {
        left: this.$slots[ this.langDir.right ] !== void 0,
        right: this.$slots[ this.langDir.left ] !== void 0,
        up: this.$slots.bottom !== void 0,
        down: this.$slots.top !== void 0
      },
      dirs = Object.keys(slots).filter(key => slots[ key ] === true)

    slotsDef.forEach(slot => {
      const dir = slot[ 0 ]

      if (this.$slots[ dir ] !== void 0) {
        content.push(
          h('div', {
            ref: dir,
            class: `q-slide-item__${dir} absolute-full row no-wrap items-${slot[ 1 ]} justify-${slot[ 2 ]}` +
              (this[ dir + 'Color' ] !== void 0 ? ` bg-${this[ dir + 'Color' ]}` : '')
          }, [
            h('div', { ref: dir + 'Content' }, this.$slots[ dir ]())
          ])
        )
      }
    })

    const node = h('div', {
      ref: 'content',
      key: 'content',
      class: 'q-slide-item__content'
    }, hSlot(this, 'default'))

    content.push(
      withDirectives(node, this.__getCacheWithFn('dir#' + dirs.join(''), () => {
        const modifiers = {
          prevent: true,
          stop: true,
          mouse: true
        }

        dirs.forEach(dir => {
          modifiers[ dir ] = true
        })

        return [[
          TouchPan,
          this.__pan,
          void 0,
          modifiers
        ]]
      }))
    )

    return h('div', { class: this.classes }, content)
  },

  beforeUnmount () {
    clearTimeout(this.timer)
  }
})
