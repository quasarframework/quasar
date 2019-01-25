import QItem from '../list/QItem.js'
import QItemSide from '../list/QItemSide.js'
import QItemTile from '../list/QItemTile.js'
import QItemWrapper from '../list/QItemWrapper.js'
import QSlideTransition from '../slide-transition/QSlideTransition.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'
import ItemMixin, { subItemProps } from '../../mixins/item.js'
import { stopAndPrevent } from '../../utils/event.js'

const eventName = 'q:collapsible:close'

export default {
  name: 'QCollapsible',
  mixins: [
    ModelToggleMixin,
    ItemMixin,
    { props: subItemProps }
  ],
  modelToggle: {
    history: false
  },
  props: {
    disable: Boolean,
    popup: Boolean,
    indent: Boolean,
    group: String,
    iconToggle: Boolean,
    collapseIcon: String,
    opened: Boolean,
    duration: Number,

    headerStyle: [Array, String, Object],
    headerClass: [Array, String, Object]
  },
  computed: {
    classes () {
      return {
        'q-collapsible-opened': this.showing,
        'q-collapsible-closed': !this.showing,
        'q-collapsible-popup-opened': this.popup && this.showing,
        'q-collapsible-popup-closed': this.popup && !this.showing,
        'q-collapsible-cursor-pointer': !this.separateToggle,
        'q-item-dark': this.dark,
        'q-item-separator': this.separator,
        'q-item-inset-separator': this.insetSeparator,
        disabled: this.disable
      }
    },
    separateToggle () {
      return this.iconToggle || this.to !== void 0
    }
  },
  watch: {
    showing (val) {
      if (val && this.group) {
        this.$root.$emit(eventName, this)
      }
    }
  },
  methods: {
    __toggleItem () {
      if (!this.separateToggle) {
        this.toggle()
      }
    },
    __toggleIcon (e) {
      if (this.separateToggle) {
        e && stopAndPrevent(e)
        this.toggle()
      }
    },
    __eventHandler (comp) {
      if (this.group && this !== comp && comp.group === this.group) {
        this.hide()
      }
    },
    __getToggleSide (h, slot) {
      return [
        h(QItemTile, {
          slot: slot ? 'right' : undefined,
          staticClass: 'cursor-pointer transition-generic relative-position q-collapsible-toggle-icon',
          'class': {
            'rotate-180': this.showing,
            invisible: this.disable
          },
          nativeOn: {
            click: this.__toggleIcon
          },
          props: { icon: this.collapseIcon || this.$q.icon.collapsible.icon }
        })
      ]
    },
    __getItemProps (wrapper) {
      return {
        props: wrapper ? { cfg: this.$props } : this.$props,
        style: this.headerStyle,
        'class': this.headerClass,
        nativeOn: {
          click: this.__toggleItem
        }
      }
    }
  },
  created () {
    this.$root.$on(eventName, this.__eventHandler)
    if (this.opened || this.value) {
      this.show()
    }
  },
  beforeDestroy () {
    this.$root.$off(eventName, this.__eventHandler)
  },
  render (h) {
    return h(this.tag, {
      staticClass: 'q-collapsible q-item-division relative-position',
      'class': this.classes
    }, [
      h('div', {
        staticClass: 'q-collapsible-inner'
      }, [
        this.$slots.header
          ? h(QItem, this.__getItemProps(), [
            this.$slots.header,
            h(QItemSide, { props: { right: true }, staticClass: 'relative-position' }, this.__getToggleSide(h))
          ])
          : h(QItemWrapper, this.__getItemProps(true), this.__getToggleSide(h, true)),

        h(QSlideTransition, {
          props: { duration: this.duration }
        }, [
          h('div', {
            directives: [{ name: 'show', value: this.showing }]
          }, [
            h('div', {
              staticClass: 'q-collapsible-sub-item relative-position',
              'class': { indent: this.indent }
            }, this.$slots.default)
          ])
        ])
      ])
    ])
  }
}
