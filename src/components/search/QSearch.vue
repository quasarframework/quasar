<template>
  <q-input
    ref="input"
    class="q-search"

    v-model="model"
    :type="type"
    :autofocus="autofocus"
    :placeholder="placeholder"
    :disable="disable"
    :error="error"
    :align="align"
    :float-label="floatLabel"
    :stack-label="stackLabel"
    :prefix="prefix"
    :suffix="suffix"
    :inverted="inverted"
    :max-length="maxLength"

    :color="color"
    :before="controlBefore"
    :after="controlAfter"

    @focus="__onFocus"
    @blur="__onBlur"
    @keyup="__onKeyup"
    @keydown="__onKeydown"
  >
    <slot></slot>
  </q-input>
</template>

<script>
import { QIcon } from '../icon'
import { QInput } from '../input'
import InputMixin from '../input/input-mixin'
import FrameMixin from '../input-frame/input-frame-mixin'
import Ripple from '../../directives/ripple'

export default {
  name: 'q-search',
  mixins: [FrameMixin, InputMixin],
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
    }
  },
  data () {
    return {
      model: this.value,
      focused: false,
      childDebounce: false,
      timer: null,
      isEmpty: !this.value && this.value !== 0
    }
  },
  provide () {
    return {
      __inputParent: {
        set: value => {
          if (this.value !== value) {
            this.$emit('input', value)
          }
        },
        setChildDebounce: v => {
          this.childDebounce = v
        }
      }
    }
  },
  watch: {
    value (v) {
      this.model = v
    },
    model (value) {
      clearTimeout(this.timer)
      if (this.value === value) {
        return
      }
      if (!value && value !== 0) {
        this.$emit('input', '')
        return
      }
      this.timer = setTimeout(() => {
        this.$emit('input', value)
      }, this.debounceValue)
    }
  },
  computed: {
    debounceValue () {
      return this.childDebounce
        ? 0
        : this.debounce
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
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>
