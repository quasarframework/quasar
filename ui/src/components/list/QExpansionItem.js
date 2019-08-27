import Vue from 'vue'

import QItem from '../list/QItem.js'
import QItemSection from '../list/QItemSection.js'
import QItemLabel from '../list/QItemLabel.js'
import QIcon from '../icon/QIcon.js'
import QSlideTransition from '../slide-transition/QSlideTransition.js'
import QSeparator from '../separator/QSeparator.js'

import { RouterLinkMixin } from '../../mixins/router-link.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'
import { stopAndPrevent } from '../../utils/event.js'
import slot from '../../utils/slot.js'

const eventName = 'q:expansion-item:close'

export default Vue.extend({
  name: 'QExpansionItem',

  mixins: [ RouterLinkMixin, ModelToggleMixin ],

  props: {
    icon: String,

    label: String,
    labelLines: [ Number, String ],

    caption: String,
    captionLines: [ Number, String ],

    dark: Boolean,
    dense: Boolean,

    expandIcon: String,
    expandIconClass: String,
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

  data () {
    return {
      showing: this.$listeners.input !== void 0
        ? this.value
        : this.defaultOpened
    }
  },

  watch: {
    showing (val) {
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
      return `q-expansion-item--${this.showing === true ? 'expanded' : 'collapsed'}` +
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
      return this.expandIcon || (this.denseToggle ? this.$q.iconSet.expansionItem.denseIcon : this.$q.iconSet.expansionItem.icon)
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

    __getToggleIcon (h) {
      return h(QItemSection, {
        staticClass: `cursor-pointer${this.denseToggle === true && this.switchToggleSide === true ? ' items-end' : ''}`,
        class: this.expandIconClass,
        props: {
          side: this.switchToggleSide !== true,
          avatar: this.switchToggleSide
        },
        on: this.activeToggleIcon === true ? {
          click: this.__toggleIcon,
          keyup: this.__toggleIconKeyboard
        } : void 0
      }, [
        h(QIcon, {
          staticClass: 'q-expansion-item__toggle-icon q-focusable',
          class: {
            'rotate-180': this.showing,
            invisible: this.disable
          },
          props: {
            name: this.expansionIcon
          },
          attrs: this.activeToggleIcon === true
            ? { tabindex: 0 }
            : void 0
        }, [
          h('div', {
            staticClass: 'q-focus-helper q-focus-helper--round',
            attrs: { tabindex: -1 },
            ref: 'blurTarget'
          })
        ])
      ])
    },

    __getHeader (h) {
      let child

      if (this.$scopedSlots.header !== void 0) {
        child = [].concat(this.$scopedSlots.header())
      }
      else {
        child = [
          h(QItemSection, [
            h(QItemLabel, {
              props: { lines: this.labelLines }
            }, [ this.label || '' ]),

            this.caption
              ? h(QItemLabel, {
                props: { lines: this.captionLines, caption: true }
              }, [ this.caption ])
              : null
          ])
        ]

        this.icon && child[this.switchToggleSide === true ? 'push' : 'unshift'](
          h(QItemSection, {
            props: {
              side: this.switchToggleSide === true,
              avatar: this.switchToggleSide !== true
            }
          }, [
            h(QIcon, {
              props: { name: this.icon }
            })
          ])
        )
      }

      child[this.switchToggleSide === true ? 'unshift' : 'push'](this.__getToggleIcon(h))

      const data = {
        ref: 'item',
        style: this.headerStyle,
        class: this.headerClass,
        props: {
          dark: this.dark,
          disable: this.disable,
          dense: this.dense,
          insetLevel: this.headerInsetLevel
        }
      }

      if (this.isClickable === true) {
        const evtProp = this.hasRouterLink === true ? 'nativeOn' : 'on'

        data.props.clickable = true
        data[evtProp] = {
          ...this.$listeners,
          click: this.__onHeaderClick
        }

        this.hasRouterLink === true && Object.assign(
          data.props,
          this.routerLinkProps
        )
      }

      return h(QItem, data, child)
    },

    __getContent (h) {
      const node = [
        this.__getHeader(h),

        h(QSlideTransition, {
          props: { duration: this.duration }
        }, [
          h('div', {
            staticClass: 'q-expansion-item__content relative-position',
            style: this.contentStyle,
            directives: [{ name: 'show', value: this.showing }]
          }, slot(this, 'default'))
        ])
      ]

      if (this.expandSeparator) {
        node.push(
          h(QSeparator, {
            staticClass: 'q-expansion-item__border q-expansion-item__border--top absolute-top',
            props: { dark: this.dark }
          }),
          h(QSeparator, {
            staticClass: 'q-expansion-item__border q-expansion-item__border--bottom absolute-bottom',
            props: { dark: this.dark }
          })
        )
      }

      return node
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-expansion-item q-item-type',
      class: this.classes
    }, [
      h(
        'div',
        { staticClass: 'q-expansion-item__container relative-position' },
        this.__getContent(h)
      )
    ])
  },

  created () {
    this.group !== void 0 && this.$root.$on(eventName, this.__eventHandler)
  },

  beforeDestroy () {
    this.group !== void 0 && this.$root.$off(eventName, this.__eventHandler)
  }
})
