import { h, defineComponent, withDirectives, vShow } from 'vue'

import QItem from '../item/QItem.js'
import QItemSection from '../item/QItemSection.js'
import QItemLabel from '../item/QItemLabel.js'
import QIcon from '../icon/QIcon.js'
import QSlideTransition from '../slide-transition/QSlideTransition.js'
import QSeparator from '../separator/QSeparator.js'

import { RouterLinkMixin } from '../../mixins/router-link.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'
import DarkMixin from '../../mixins/dark.js'

import { stopAndPrevent } from '../../utils/event.js'
import { slot } from '../../utils/slot.js'

const eventName = 'q:expansion-item:close'

export default defineComponent({
  name: 'QExpansionItem',

  mixins: [ DarkMixin, RouterLinkMixin, ModelToggleMixin ],

  props: {
    icon: String,

    label: String,
    labelLines: [ Number, String ],

    caption: String,
    captionLines: [ Number, String ],

    dense: Boolean,

    expandIcon: String,
    expandedIcon: String,
    expandIconClass: [ Array, String, Object ],
    duration: Number,

    headerInsetLevel: Number,
    contentInsetLevel: Number,

    expandSeparator: Boolean,
    defaultOpened: Boolean,
    expandIconToggle: Boolean,
    switchToggleSide: Boolean,
    denseToggle: Boolean,
    group: String,
    popup: Boolean,

    headerStyle: [Array, String, Object],
    headerClass: [Array, String, Object]
  },

  emits: [ 'click', 'after-show', 'after-hide' ],

  data () {
    return {
      showing: this.modelValue !== void 0
        ? this.modelValue
        : this.defaultOpened
    }
  },

  watch: {
    showing (val) {
      // TODO vue3 - verify $root.$emit()
      val === true && this.group !== void 0 && this.$root.$emit(eventName, this)
    },

    group (newVal, oldVal) {
      if (newVal !== void 0 && oldVal === void 0) {
        this.$root.$on(eventName, this.__eventHandler)
      }
      else if (newVal === void 0 && oldVal !== void 0) {
        this.$root.$off(eventName, this.__eventHandler)
      }
    }
  },

  computed: {
    classes () {
      return 'q-expansion-item q-item-type' +
        ` q-expansion-item--${this.showing === true ? 'expanded' : 'collapsed'}` +
        ` q-expansion-item--${this.popup === true ? 'popup' : 'standard'}`
    },

    contentStyle () {
      if (this.contentInsetLevel !== void 0) {
        const dir = this.$q.lang.rtl === true ? 'Right' : 'Left'
        return {
          ['padding' + dir]: (this.contentInsetLevel * 56) + 'px'
        }
      }
    },

    isClickable () {
      return this.hasRouterLink === true || this.expandIconToggle !== true
    },

    expansionIcon () {
      return this.expandedIcon !== void 0 && this.showing === true
        ? this.expandedIcon
        : this.expandIcon || this.$q.iconSet.expansionItem[this.denseToggle === true ? 'denseIcon' : 'icon']
    },

    activeToggleIcon () {
      return this.disable !== true && (this.hasRouterLink === true || this.expandIconToggle === true)
    }
  },

  methods: {
    __onHeaderClick (e) {
      this.hasRouterLink !== true && this.toggle(e)
      this.$emit('click', e)
    },

    __toggleIconKeyboard (e) {
      e.keyCode === 13 && this.__toggleIcon(e, true)
    },

    __toggleIcon (e, keyboard) {
      keyboard !== true && this.$refs.blurTarget !== void 0 && this.$refs.blurTarget.focus()
      this.toggle(e)
      stopAndPrevent(e)
    },

    __eventHandler (comp) {
      this !== comp && this.group === comp.group && this.hide()
    },

    __getToggleIcon () {
      const data = {
        class: [
          `q-focusable relative-position cursor-pointer${this.denseToggle === true && this.switchToggleSide === true ? ' items-end' : ''}`,
          this.expandIconClass
        ],
        side: this.switchToggleSide !== true,
        avatar: this.switchToggleSide
      }

      const child = [
        h(QIcon, {
          class: 'q-expansion-item__toggle-icon' +
            (this.expandedIcon === void 0 && this.showing === true
              ? ' q-expansion-item__toggle-icon--rotated'
              : ''),
          name: this.expansionIcon
        })
      ]

      if (this.activeToggleIcon === true) {
        Object.assign(data, {
          tabindex: 0,
          onClick: this.__toggleIcon,
          onKeyup: this.__toggleIconKeyboard
        })

        child.unshift(
          h('div', {
            ref: 'blurTarget',
            class: 'q-expansion-item__toggle-focus q-icon q-focus-helper q-focus-helper--rounded',
            tabindex: -1
          })
        )
      }

      return h(QItemSection, data, () => child)
    },

    __getHeader () {
      let child

      if (this.$slots.header !== void 0) {
        child = this.$slots.header().slice()
      }
      else {
        child = [
          h(QItemSection, () => [
            h(QItemLabel, { lines: this.labelLines }, () => [ this.label || '' ]),

            this.caption
              ? h(QItemLabel, { lines: this.captionLines, caption: true }, () => [ this.caption ])
              : null
          ])
        ]

        this.icon && child[this.switchToggleSide === true ? 'push' : 'unshift'](
          h(QItemSection, {
            side: this.switchToggleSide === true,
            avatar: this.switchToggleSide !== true
          }, () => [
            h(QIcon, {
              name: this.icon
            })
          ])
        )
      }

      this.disable !== true && child[this.switchToggleSide === true ? 'unshift' : 'push'](
        this.__getToggleIcon()
      )

      const data = {
        ref: 'item',
        style: this.headerStyle,
        class: this.headerClass,
        dark: this.isDark,
        disable: this.disable,
        dense: this.dense,
        insetLevel: this.headerInsetLevel
      }

      if (this.isClickable === true) {
        data.clickable = true
        data.onClick = this.__onHeaderClick

        // TODO vue3
        // data[evtProp] = {
        //   ...this.qListeners,
        // }

        this.hasRouterLink === true && Object.assign(
          data,
          this.routerLinkProps
        )
      }

      return h(QItem, data, () => child)
    },

    __onShow () {
      this.$emit('after-show')
    },

    __onHide () {
      this.$emit('after-hide')
    },

    __getContent () {
      const node = [
        this.__getHeader(),

        h(QSlideTransition, {
          duration: this.duration,
          show: this.__onShow,
          hide: this.__onHide
        }, () => [
          withDirectives(
            h('div', {
              class: 'q-expansion-item__content relative-position',
              style: this.contentStyle
            }, slot(this, 'default')),
            [[
              vShow,
              this.showing
            ]]
          )
        ])
      ]

      if (this.expandSeparator) {
        node.push(
          h(QSeparator, {
            class: 'q-expansion-item__border q-expansion-item__border--top absolute-top',
            dark: this.isDark
          }),
          h(QSeparator, {
            class: 'q-expansion-item__border q-expansion-item__border--bottom absolute-bottom',
            dark: this.isDark
          })
        )
      }

      return node
    }
  },

  render () {
    return h('div', {
      class: this.classes
    }, [
      h('div', { class: 'q-expansion-item__container relative-position' }, this.__getContent())
    ])
  },

  created () {
    this.group !== void 0 && this.$root.$on(eventName, this.__eventHandler)
  },

  beforeUnmount () {
    this.group !== void 0 && this.$root.$off(eventName, this.__eventHandler)
  }
})
