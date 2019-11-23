import Vue from 'vue'

import { stopAndPrevent } from '../../utils/event.js'
import { between } from '../../utils/format.js'
import QIcon from '../icon/QIcon.js'
import SizeMixin from '../../mixins/size.js'

import { cache } from '../../utils/vm.js'

export default Vue.extend({
  name: 'QRating',

  mixins: [ SizeMixin ],

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

    color: [String, Array],

    noReset: Boolean,
    unselectedColor: String,

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
      return this.readonly !== true && this.disable !== true
    },

    classes () {
      return `q-rating--${this.editable === true ? '' : 'non-'}editable` +
        (this.disable === true ? ' disabled' : '') +
        (this.color !== void 0 && !Array.isArray(this.color) && this.unselectedColor === void 0 ? ` text-${this.color}` : '') +
        (this.unselectedColor !== void 0 ? ' q-rating--uncolored' : '')
    },

    iconData () {
      const
        len = Array.isArray(this.icon) === true ? this.icon.length : 0,
        selectedLen = Array.isArray(this.iconSelected) === true ? this.iconSelected.length : 0,
        colorLen = Array.isArray(this.color) === true ? this.color.length : 0

      return {
        len,
        selectedLen,
        colorLen,
        icon: len > 0 ? this.icon[len - 1] : this.icon,
        selected: selectedLen > 0 ? this.iconSelected[selectedLen - 1] : this.iconSelected,
        selectedColor: colorLen > 0 ? this.color[colorLen - 1] : void 0
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
      icons = this.iconData

    for (let i = 1; i <= this.max; i++) {
      const
        active = (!this.mouseModel && this.value >= i) || (this.mouseModel && this.mouseModel >= i),
        exSelected = this.mouseModel && this.value >= i && this.mouseModel < i,
        name = icons.selected !== void 0 && (active === true || exSelected === true)
          ? (i <= icons.selectedLen ? this.iconSelected[i - 1] : icons.selected)
          : (i <= icons.len ? this.icon[i - 1] : icons.icon),
        color = active === true
          ? (i <= icons.colorLen ? this.color[i - 1] : icons.selectedColor)
          : (this.unselectedColor !== void 0 ? this.unselectedColor : void 0)

      child.push(
        h(QIcon, {
          key: i,
          ref: `rt${i}`,
          staticClass: 'q-rating__icon',
          class: {
            'q-rating__icon--active': active,
            'q-rating__icon--exselected': exSelected,
            'q-rating__icon--hovered': this.mouseModel === i,
            [`text-${color}`]: color !== void 0
          },
          props: { name: name || this.$q.iconSet.rating.icon },
          attrs: { tabindex },
          on: cache(this, 'ico#' + i, {
            click: () => { this.__set(i) },
            mouseover: () => { this.__setHoverValue(i) },
            mouseout: () => { this.mouseModel = 0 },
            focus: () => { this.__setHoverValue(i) },
            blur: () => { this.mouseModel = 0 },
            keyup: e => { this.__keyup(e, i) }
          })
        })
      )
    }

    return h('div', {
      staticClass: 'q-rating row inline items-center',
      class: this.classes,
      style: this.sizeStyle,
      on: this.$listeners
    }, child)
  }
})
