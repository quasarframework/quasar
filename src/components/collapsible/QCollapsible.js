import QItem from '../list/QItem.js'
import QItemSide from '../list/QItemSide.js'
import QItemTile from '../list/QItemTile.js'
import QItemWrapper from '../list/QItemWrapper.js'
import QSlideTransition from '../slide-transition/QSlideTransition.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'
import ItemMixin from '../../mixins/item.js'

const eventName = 'q:collapsible:close'

export default {
  name: 'QCollapsible',
  mixins: [ModelToggleMixin, ItemMixin],
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

    headerStyle: [Array, String, Object],
    headerClass: [Array, String, Object]
  },
  computed: {
    classes () {
      return {
        'q-collapsible-opened': this.popup && this.showing,
        'q-collapsible-closed': this.popup && !this.showing,
        'q-collapsible-cursor-pointer': !this.iconToggle,
        'q-item-separator': this.separator,
        'q-item-inset-separator': this.insetSeparator,
        disabled: this.disable
      }
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
      if (!this.iconToggle) {
        this.toggle()
      }
    },
    __toggleIcon (e) {
      if (this.iconToggle) {
        e && e.stopPropagation()
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
        props: { cfg: this.$props },
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

        h(QSlideTransition, [
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
