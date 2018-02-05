import { QItem, QItemSide, QItemTile, QItemWrapper } from '../list'
import { QSlideTransition } from '../slide-transition'
import Ripple from '../../directives/ripple'
import ModelToggleMixin from '../../mixins/model-toggle'
import ItemMixin from '../../mixins/item'
import extend from '../../utils/extend'

const eventName = 'q:collapsible:close'

export default {
  name: 'q-collapsible',
  mixins: [ModelToggleMixin, ItemMixin],
  modelToggle: {
    history: false
  },
  directives: {
    Ripple
  },
  props: {
    disable: Boolean,
    popup: Boolean,
    indent: Boolean,
    group: String,
    iconToggle: Boolean,
    noRipple: Boolean,
    collapseIcon: String,
    opened: Boolean,

    headerStyle: [Array, String, Object],
    headerClass: [Array, String, Object]
  },
  computed: {
    hasRipple () {
      return __THEME__ === 'mat' && !this.noRipple && !this.disable
    },
    classes () {
      return {
        'q-collapsible-opened': this.popup && this.showing,
        'q-collapsible-closed': this.popup && !this.showing,
        'q-item-separator': this.separator,
        'q-item-inset-separator': this.insetSeparator,
        disabled: this.disable
      }
    },
    wrapperCfg () {
      return extend({}, this.$props, {
        link: !this.iconToggle
      })
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
          staticClass: 'cursor-pointer transition-generic relative-position',
          'class': {
            'rotate-180': this.showing,
            invisible: this.disable
          },
          nativeOn: {
            click: this.__toggleIcon
          },
          props: { icon: this.collapseIcon || this.$q.icon.collapsible.icon },
          directives: this.iconToggle && this.hasRipple
            ? [{ name: 'ripple' }]
            : null
        })
      ]
    },
    __getItemProps (wrapper) {
      return {
        props: wrapper
          ? { cfg: this.wrapperCfg }
          : { link: !this.iconToggle },
        style: this.headerStyle,
        'class': this.headerClass,
        nativeOn: {
          click: this.__toggleItem
        },
        directives: this.hasRipple && !this.iconToggle
          ? [{ name: 'ripple' }]
          : null
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
    return h('div', {
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
            }, [
              this.$slots.default
            ])
          ])
        ])
      ])
    ])
  }
}
