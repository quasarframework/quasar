import { h, shallowReactive, defineComponent, withDirectives, vShow } from 'vue'

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
import { hSlot } from '../../utils/render.js'
import uid from '../../utils/uid.js'

const itemGroups = shallowReactive({})

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

    headerStyle: [ Array, String, Object ],
    headerClass: [ Array, String, Object ]
  },

  emits: [ 'click', 'after-show', 'after-hide' ],

  data () {
    return {
      showing: this.modelValue !== null
        ? this.modelValue
        : this.defaultOpened
    }
  },

  watch: {
    group (name) {
      this.exitGroup !== void 0 && this.exitGroup()
      name !== void 0 && this.__enterGroup()
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
          [ 'padding' + dir ]: (this.contentInsetLevel * 56) + 'px'
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

    __onShow () {
      this.$emit('after-show')
    },

    __onHide () {
      this.$emit('after-hide')
    },

    __enterGroup () {
      if (this.uid === void 0) {
        this.uid = uid()
      }

      if (this.showing === true) {
        itemGroups[this.group] = this.uid
      }

      const show = this.$watch(
        'showing',
        val => {
          if (val === true) {
            itemGroups[this.group] = this.uid
          }
          else if (itemGroups[this.group] === this.uid) {
            delete itemGroups[this.group]
          }
        }
      )

      const group = this.$watch(
        () => itemGroups[this.group],
        (val, oldVal) => {
          if (oldVal === this.uid && val !== void 0 && val !== this.uid) {
            this.hide()
          }
        }
      )

      this.exitGroup = () => {
        show()
        group()

        if (itemGroups[this.group] === this.uid) {
          delete itemGroups[this.group]
        }

        this.exitGroup = void 0
      }
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

    __getHeaderChild () {
      let child

      if (this.$slots.header !== void 0) {
        child = this.$slots.header().slice()
      }
      else {
        child = [
          h(QItemSection, () => [
            h(QItemLabel, { lines: this.labelLines }, () => this.label || ''),

            this.caption
              ? h(QItemLabel, { lines: this.captionLines, caption: true }, () => this.caption)
              : null
          ])
        ]

        this.icon && child[this.switchToggleSide === true ? 'push' : 'unshift'](
          h(QItemSection, {
            side: this.switchToggleSide === true,
            avatar: this.switchToggleSide !== true
          }, () => h(QIcon, { name: this.icon }))
        )
      }

      this.disable !== true && child[this.switchToggleSide === true ? 'unshift' : 'push'](
        this.__getToggleIcon()
      )

      return child
    },

    __getHeader () {
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

      return h(QItem, data, this.__getHeaderChild)
    },

    __getTransitionChild () {
      return withDirectives(
        h('div', {
          key: 'e-content',
          class: 'q-expansion-item__content relative-position',
          style: this.contentStyle
        }, hSlot(this, 'default')),
        [[
          vShow,
          this.showing
        ]]
      )
    },

    __getContent () {
      const node = [
        this.__getHeader(),

        h(QSlideTransition, {
          duration: this.duration,
          show: this.__onShow,
          hide: this.__onHide
        }, this.__getTransitionChild)
      ]

      if (this.expandSeparator === true) {
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
    this.uid = void 0
    this.exitGroup = void 0
    this.group !== void 0 && this.__enterGroup()
  },

  beforeUnmount () {
    this.exitGroup !== void 0 && this.exitGroup()
  }
})
