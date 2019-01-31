import Vue from 'vue'

import { stopAndPrevent } from '../../utils/event.js'
import { between } from '../../utils/format.js'
import QIcon from '../icon/QIcon.js'

export default Vue.extend({
  name: 'QRating',

  props: {
    value: Number,

    max: {
      type: [String, Number],
      default: 5
    },

    icon: String,
    color: String,
    size: String,

    readonly: Boolean,
    disable: Boolean
  },

  data () {
    return {
      mouseModel: 0
    }
  },

  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },

    editable () {
      return !this.readonly && !this.disable
    },

    classes () {
      return `q-rating--${this.editable === true ? '' : 'non-'}editable` +
        (this.disable === true ? ' disabled' : '') +
        (this.color !== void 0 ? ` text-${this.color}` : '')
    },

    style () {
      if (this.size !== void 0) {
        return { fontSize: this.size }
      }
    }
  },

  methods: {
    __set (value) {
      if (this.editable === true) {
        const model = between(parseInt(value, 10), 1, parseInt(this.max, 10))
        this.model = this.model === model ? 0 : model
        this.mouseModel = 0
      }
    },

    __setHoverValue (value) {
      if (this.editable === true) {
        this.mouseModel = value
      }
    },

    __keyup (e, i) {
      switch (e.keyCode) {
        case 13:
        case 32:
          this.__set(i)
          return stopAndPrevent(e)
        case 37: // LEFT ARROW
        case 40: // DOWN ARROW
          if (this.$refs[`rt${i - 1}`]) {
            this.$refs[`rt${i - 1}`].focus()
          }
          return stopAndPrevent(e)
        case 39: // RIGHT ARROW
        case 38: // UP ARROW
          if (this.$refs[`rt${i + 1}`]) {
            this.$refs[`rt${i + 1}`].focus()
          }
          return stopAndPrevent(e)
      }
    }
  },

  render (h) {
    const
      child = [],
      tabindex = this.editable === true ? 0 : null

    for (let i = 1; i <= this.max; i++) {
      child.push(
        h(QIcon, {
          key: i,
          ref: `rt${i}`,
          staticClass: 'q-rating__icon',
          class: {
            'q-rating__icon--active': (!this.mouseModel && this.model >= i) || (this.mouseModel && this.mouseModel >= i),
            'q-rating__icon--exselected': this.mouseModel && this.model >= i && this.mouseModel < i,
            'q-rating__icon--hovered': this.mouseModel === i
          },
          props: { name: this.icon || this.$q.iconSet.rating.icon },
          attrs: { tabindex },
          on: {
            click: () => this.__set(i),
            mouseover: () => this.__setHoverValue(i),
            mouseout: () => { this.mouseModel = 0 },
            focus: () => this.__setHoverValue(i),
            blur: () => { this.mouseModel = 0 },
            keyup: e => { this.__keyup(e, i) }
          }
        })
      )
    }

    return h('div', {
      staticClass: 'q-rating row inline items-center',
      class: this.classes,
      style: this.style
    }, child)
  }
})
