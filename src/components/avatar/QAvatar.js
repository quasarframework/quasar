import QIcon from '../icon/QIcon.js'

export default {
  name: 'QAvatar',
  props: {
    color: String,
    textColor: String,

    icon: String,

    size: {
      type: Number,
      default: 48
    },
    ratio: {
      type: Number,
      default: 2.2
    },
    square: Boolean
  },

  computed: {
    classes () {
      return {
        [`bg-${this.color}`]: this.color,
        [`text-${this.textColor} q-chip--colored`]: this.textColor,
        'q-avatar--square': this.square
      }
    },
    style () {
      return {
        width: this.size + 'px',
        height: this.size + 'px',
        fontSize: Math.round(this.size / this.ratio) + 'px'
      }
    }
  },

  methods: {
    __getContent (h) {
      return this.icon
        ? [ h(QIcon, { props: { name: this.icon } }) ].concat(this.$slots.default)
        : this.$slots.default
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-avatar row inline flex-center relative-position text-center overflow-hidden',
      'class': this.classes,
      style: this.style
    }, this.__getContent(h))
  }
}
