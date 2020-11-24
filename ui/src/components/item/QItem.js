import { h, defineComponent } from 'vue'

import DarkMixin from '../../mixins/dark.js'
import RouterLinkMixin from '../../mixins/router-link.js'

import { hUniqueSlot } from '../../utils/render.js'
import { stopAndPrevent } from '../../utils/event.js'
import { isKeyCode } from '../../utils/key-composition.js'

export default defineComponent({
  name: 'QItem',

  mixins: [ DarkMixin, RouterLinkMixin ],

  props: {
    tag: {
      type: String,
      default: 'div'
    },

    active: Boolean,

    clickable: Boolean,
    dense: Boolean,
    insetLevel: Number,

    tabindex: [ String, Number ],

    focused: Boolean,
    manualFocus: Boolean
  },

  emits: [ 'click', 'keyup' ],

  computed: {
    isActionable () {
      return this.clickable === true ||
        this.hasLink === true ||
        this.tag === 'a' ||
        this.tag === 'label'
    },

    isClickable () {
      return this.disable !== true && this.isActionable === true
    },

    classes () {
      return 'q-item q-item-type row no-wrap' +
        (this.dense === true ? ' q-item--dense' : '') +
        (this.isDark === true ? ' q-item--dark' : '') +
        (
          this.hasLink === true
            ? this.linkClass
            : (
                this.active === true
                  ? ' q-item--active'
                  : ''
              )
        ) +
        (this.disable === true ? ' disabled' : '') +
        (
          this.isClickable === true
            ? ' q-item--clickable q-link cursor-pointer ' +
              (this.manualFocus === true ? 'q-manual-focusable' : 'q-focusable q-hoverable') +
              (this.focused === true ? ' q-manual-focusable--focused' : '')
            : ''
        )
    },

    style () {
      if (this.insetLevel !== void 0) {
        const dir = this.$q.lang.rtl === true ? 'Right' : 'Left'
        return {
          [ 'padding' + dir ]: (16 + this.insetLevel * 56) + 'px'
        }
      }
    }
  },

  methods: {
    __getContent () {
      const child = hUniqueSlot(this, 'default', [])

      this.isClickable === true && child.unshift(
        h('div', { class: 'q-focus-helper', tabindex: -1, ref: 'blurTarget' })
      )
      return child
    },

    __onClick (e) {
      if (this.isClickable === true) {
        if (this.$refs.blurTarget) {
          if (e.qKeyEvent !== true && document.activeElement === this.$el) {
            this.$refs.blurTarget.focus()
          }
          else if (document.activeElement === this.$refs.blurTarget) {
            this.$el.focus()
          }
        }

        this.hasLink === true && this.navigateToLink(e)
        this.$emit('click', e)
      }
    },

    __onKeyup (e) {
      if (this.isClickable === true && isKeyCode(e, 13) === true) {
        stopAndPrevent(e)

        // for ripple
        e.qKeyEvent = true

        // for click trigger
        const evt = new MouseEvent('click', e)
        evt.qKeyEvent = true
        this.$el.dispatchEvent(evt)
      }

      this.$emit('keyup', e)
    }
  },

  render () {
    const data = {
      class: this.classes,
      style: this.style,
      onClick: this.__onClick,
      onKeyup: this.__onKeyup
    }

    if (this.isClickable === true) {
      data.tabindex = this.tabindex || '0'
      Object.assign(data, this.linkProps)
    }
    else if (this.isActionable === true) {
      data[ 'aria-disabled' ] = 'true'
    }

    return h(
      this.linkTag,
      data,
      this.__getContent()
    )
  }
})
