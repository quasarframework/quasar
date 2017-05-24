<template>
  <q-input
    ref="input"
    class="q-search"

    v-model="model"
    :type="type"
    :autofocus="autofocus"
    :pattern="pattern"
    :placeholder="placeholder"
    :disable="disable"
    :error="error"
    :align="align"
    :float-label="floatLabel"
    :stack-label="stackLabel"
    :prefix="prefix"
    :suffix="suffix"
    :inverted="inverted"

    :color="color"
    :before="controlBefore"
    :after="controlAfter"

    @focus="__onFocus"
    @blur="__onBlur"
  >
    <slot></slot>
  </q-input>
</template>

<script>
import { QIcon } from '../icon'
import { QInput } from '../input'
import Ripple from '../../directives/ripple'

export default {
  name: 'q-search',
  components: {
    QIcon,
    QInput
  },
  directives: {
    Ripple
  },
  props: {
    value: { required: true },
    type: String,
    pattern: String,
    debounce: {
      type: Number,
      default: 300
    },
    icon: {
      type: String,
      default: 'search'
    },
    placeholder: {
      type: String,
      default: 'Search'
    },
    prefix: String,
    suffix: String,
    floatLabel: String,
    stackLabel: String,
    autofocus: Boolean,
    align: String,
    disable: Boolean,
    error: Boolean,
    color: String,
    inverted: Boolean
  },
  data () {
    return {
      timer: null,
      isEmpty: !this.value && this.value !== 0
    }
  },
  computed: {
    model: {
      get () {
        this.isEmpty = !this.value && this.value !== 0
        return this.value
      },
      set (value) {
        clearTimeout(this.timer)
        this.isEmpty = !value && value !== 0
        if (this.value === value) {
          return
        }
        if (this.isEmpty) {
          this.$emit('input', '')
          return
        }
        this.timer = setTimeout(() => {
          this.$emit('input', value)
        }, this.debounce)
      }
    },
    controlBefore () {
      return [{icon: this.icon, handler: this.focus}]
    },
    controlAfter () {
      return [{
        icon: this.inverted ? 'clear' : 'cancel',
        content: true,
        handler: this.clearAndFocus
      }]
    }
  },
  methods: {
    clear () {
      if (!this.disable) {
        this.model = ''
      }
    },
    clearAndFocus () {
      this.clear()
      this.focus()
    },
    focus () {
      this.$refs.input.focus()
    },
    blur () {
      this.$refs.input.blur()
    },

    __onFocus () {
      if (!this.disable) {
        this.$emit('focus')
      }
    },
    __onBlur () {
      this.$emit('blur')
    },
    __enter () {
      this.$emit('enter', this.model)
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>
