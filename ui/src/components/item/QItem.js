import Vue from 'vue'

import DarkMixin from '../../mixins/dark.js'
import TagMixin from '../../mixins/tag.js'
import RouterLinkMixin from '../../mixins/router-link.js'
import ListenersMixin from '../../mixins/listeners.js'

import { uniqueSlot } from '../../utils/private/slot.js'
import { stopAndPrevent } from '../../utils/event.js'
import { isKeyCode } from '../../utils/private/key-composition.js'

export default Vue.extend({
  name: 'QItem',

  mixins: [ DarkMixin, RouterLinkMixin, TagMixin, ListenersMixin ],

  props: {
    active: {
      type: Boolean,
      default: null
    },

    clickable: Boolean,
    dense: Boolean,
    insetLevel: Number,

    tabindex: [ String, Number ],

    focused: Boolean,
    manualFocus: Boolean
  },

  computed: {
    isActionable () {
      return this.clickable === true ||
        this.hasLink === true ||
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
          this.hasLink === true && this.active === null
            ? this.linkClass
            : (
              this.active === true
                ? ` q-item--active${this.activeClass !== void 0 ? ` ${this.activeClass}` : ''} `
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
          ['padding' + dir]: (16 + this.insetLevel * 56) + 'px'
        }
      }
    },

    onEvents () {
      return {
        ...this.qListeners,
        click: this.__onClick,
        keyup: this.__onKeyup
      }
    }
  },

  methods: {
    __onClick (e) {
      if (this.isClickable === true) {
        if (this.$refs.blurTarget !== void 0) {
          if (e.qKeyEvent !== true && document.activeElement === this.$el) {
            this.$refs.blurTarget.focus()
          }
          else if (document.activeElement === this.$refs.blurTarget) {
            this.$el.focus()
          }
        }

        this.__navigateOnClick(e)
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
    },

    __getContent (h) {
      const child = uniqueSlot(this, 'default', [])

      this.isClickable === true && child.unshift(
        h('div', { staticClass: 'q-focus-helper', attrs: { tabindex: -1 }, ref: 'blurTarget' })
      )

      return child
    }
  },

  render (h) {
    const data = {
      class: this.classes,
      style: this.style,
      attrs: { role: 'listitem' },
      on: this.onEvents
    }

    if (this.isClickable === true) {
      data.attrs.tabindex = this.tabindex || '0'
      Object.assign(data.attrs, this.linkAttrs)
    }
    else if (this.isActionable === true) {
      data.attrs['aria-disabled'] = 'true'
    }

    return h(
      this.linkTag,
      data,
      this.__getContent(h)
    )
  }
})
