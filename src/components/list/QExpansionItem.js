import QItem from '../list/QItem.js'
import QItemSection from '../list/QItemSection.js'
import QItemLabel from '../list/QItemLabel.js'

import QIcon from '../icon/QIcon.js'
import QSlideTransition from '../slide-transition/QSlideTransition.js'

import QSeparator from '../separator/QSeparator.js'

import { RouterLinkMixin } from '../../utils/router-link.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'

import { stopAndPrevent } from '../../utils/event.js'

const eventName = 'q:expansion-item:close'

export default {
  name: 'QExpansionItem',

  mixins: [ RouterLinkMixin, ModelToggleMixin ],

  props: {
    icon: String,
    label: String,
    caption: String,
    dark: Boolean,

    expandIcon: String,
    duration: Number,

    headerInset: Boolean,
    contentInset: Boolean,
    menuInset: Boolean,

    expandSeparator: Boolean,
    opened: Boolean,
    expandIconToggle: Boolean,
    switchToggleSide: Boolean,
    group: String,
    popup: Boolean,

    headerStyle: [Array, String, Object],
    headerClass: [Array, String, Object],

    disable: Boolean
  },

  watch: {
    showing (val) {
      if (val && this.group) {
        this.$root.$emit(eventName, this)
      }
    }
  },

  computed: {
    classes () {
      return [
        `q-expansion-item--${this.showing ? 'expanded' : 'collapsed'}`,
        `q-expansion-item--${this.popup ? 'popup' : 'standard'}`,
        this.contentInset ? 'q-expansion-item--content-inset' : '',
        this.menuInset ? 'q-expansion-item--menu-inset' : ''
      ]
    },
    isClickable () {
      return this.to !== void 0 || !this.expandIconToggle
    }
  },

  methods: {
    __toggleItem (e) {
      !this.expandIconToggle && this.toggle(e)
    },
    __toggleIcon (e) {
      if (this.to !== void 0 || this.expandIconToggle) {
        stopAndPrevent(e)
        this.toggle(e)
      }
    },
    __eventHandler (comp) {
      if (this.group && this !== comp && comp.group === this.group) {
        this.hide()
      }
    },

    __getToggleIcon (h) {
      return h(QItemSection, {
        staticClass: 'cursor-pointer',
        props: {
          side: true
        },
        nativeOn: {
          click: this.__toggleIcon
        }
      }, [
        h(QIcon, {
          staticClass: 'generic-transition',
          'class': {
            'rotate-180': this.showing,
            invisible: this.disable
          },
          props: {
            name: this.expandIcon || this.$q.icon.expansionItem.icon
          }
        })
      ])
    },

    __getHeader (h) {
      let child

      if (this.$slots.header) {
        child = [].concat(this.$slots.header)
      }
      else {
        child = [
          h(QItemSection, [
            h(QItemLabel, [ this.label || '' ]),
            this.caption
              ? h(QItemLabel, { props: { caption: true } }, [ this.caption ])
              : null
          ])
        ]

        this.icon && child[this.switchToggleSide ? 'push' : 'unshift'](
          h(QItemSection, {
            props: {
              avatar: true
            }
          }, [
            h(QIcon, {
              props: { name: this.icon }
            })
          ])
        )
      }

      child[this.switchToggleSide ? 'unshift' : 'push'](this.__getToggleIcon(h))

      const data = {
        style: this.headerStyle,
        'class': this.headerClass,
        props: {
          dark: this.dark,
          disable: this.disable,
          inset: this.headerInset && !this.switchToggleSide
        }
      }

      if (this.isClickable) {
        data.on = {
          click: this.__toggleItem
        }

        Object.assign(data.props, {
          clickable: true,
          to: this.to,
          exact: this.exact,
          append: this.append,
          replace: this.replace
        })
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
            directives: [{ name: 'show', value: this.showing }]
          }, this.$slots.default)
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
      'class': this.classes
    }, [
      h(
        'div',
        { staticClass: 'q-expansion-item__container relative-position' },
        this.__getContent(h)
      )
    ])
  },

  created () {
    this.$root.$on(eventName, this.__eventHandler)
    if (this.opened || this.value) {
      this.show()
    }
  },

  beforeDestroy () {
    this.$root.$off(eventName, this.__eventHandler)
  }
}
