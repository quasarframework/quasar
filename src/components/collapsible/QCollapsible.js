import { QItem, QItemSide, QItemTile, QItemWrapper } from '../list'
import { QSlideTransition } from '../slide-transition'
import Ripple from '../../directives/ripple'
import ModelToggleMixin from '../../mixins/model-toggle'

const eventName = 'q:collapsible:close'

export default {
  name: 'q-collapsible',
  mixins: [ModelToggleMixin],
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
    separator: Boolean,
    insetSeparator: Boolean,
    noRipple: Boolean,
    collapseIcon: String,

    dense: Boolean,
    sparse: Boolean,
    multiline: Boolean,

    icon: String,
    rightIcon: String,
    image: String,
    rightImage: String,
    avatar: String,
    rightAvatar: String,
    letter: String,
    rightLetter: String,
    label: String,
    sublabel: String,
    labelLines: [String, Number],
    sublabelLines: [String, Number]
  },
  computed: {
    cfg () {
      return {
        link: !this.iconToggle,
        headerStyle: [Array, String, Object],
        headerClass: [Array, String, Object],

        dark: this.dark,
        dense: this.dense,
        sparse: this.sparse,
        multiline: this.multiline,

        icon: this.icon,
        rightIcon: this.rightIcon,
        image: this.image,
        rightImage: this.rightImage,
        avatar: this.avatar,
        rightAvatar: this.rightAvatar,
        letter: this.letter,
        rightLetter: this.rightLetter,

        label: this.label,
        sublabel: this.sublabel,
        labelLines: this.labelLines,
        sublabelLines: this.sublabelLines
      }
    },
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
          on: {
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
          ? { cfg: this.cfg }
          : { link: !this.iconToggle },
        style: this.headerStyle,
        'class': this.headerClass,
        on: {
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
    if (this.value) {
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
