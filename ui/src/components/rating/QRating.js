import Vue from 'vue'

import { stopAndPrevent } from '../../utils/event.js'
import { between } from '../../utils/format.js'
import QIcon from '../icon/QIcon.js'

export default Vue.extend({
  name: 'QRating',

  props: {
    value: {
      type: Number,
      required: true
    },

    max: {
      type: [String, Number],
      default: 5
    },

    icon: [String, Array],
    iconSelected: [String, Array],
    color: String,
    size: String,

    noReset: Boolean,

    readonly: Boolean,
    disable: Boolean
  },

  data () {
    return {
      mouseModel: 0
    }
  },

  computed: {
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
        const
          model = between(parseInt(value, 10), 1, parseInt(this.max, 10)),
          newVal = this.noReset !== true && this.value === model ? 0 : model

        newVal !== this.value && this.$emit('input', newVal)
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
      tabindex = this.editable === true ? 0 : null,
      iconLength = Array.isArray(this.icon) ? this.icon.length : 0,
      iconSelectedLength = Array.isArray(this.iconSelected) ? this.iconSelected.length : 0,
      icon = iconLength > 0 ? this.icon[iconLength - 1] : this.icon,
      iconSelected = iconSelectedLength > 0 ? this.iconSelected[iconSelectedLength - 1] : this.iconSelected

    for (let i = 1; i <= this.max; i++) {
      const
        iconActive = (!this.mouseModel && this.value >= i) || (this.mouseModel && this.mouseModel >= i),
        iconExSelected = this.mouseModel && this.value >= i && this.mouseModel < i,
        iconName = (iconActive === true || iconExSelected === true) && iconSelected !== void 0
          ? i <= iconSelectedLength ? this.iconSelected[i - 1] : iconSelected
          : i <= iconLength ? this.icon[i - 1] : icon

      child.push(
        h(QIcon, {
          key: i,
          ref: `rt${i}`,
          staticClass: 'q-rating__icon',
          class: {
            'q-rating__icon--active': iconActive,
            'q-rating__icon--exselected': iconExSelected,
            'q-rating__icon--hovered': this.mouseModel === i
          },
          props: { name: iconName || this.$q.iconSet.rating.icon },
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
      style: this.style,
      on: this.$listeners
    }, child)
  }
})
