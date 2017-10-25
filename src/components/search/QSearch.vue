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
    :dark="dark"
    :max-length="maxLength"

    :color="color"
    :before="controlBefore"
    :after="controlAfter"

    @focus="__onFocus"
    @blur="__onBlur"
    @keyup="__onKeyup"
    @keydown="__onKeydown"
    @click="__onClick"
  >
    <slot></slot>
  </q-input>
</template>

<script>
import { QIcon } from '../icon'
import { QInput } from '../input'
import InputMixin from '../../mixins/input'
import FrameMixin from '../../mixins/input-frame'
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
  model: {
    prop: 'value',
    event: 'input'
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
      childDebounce: false
    }
  },
  provide () {
    return {
      __inputDebounce: {
        set: val => {
          if (this.model !== val) {
            this.model = val
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
    model (val) {
      clearTimeout(this.timer)
      if (this.value === val) {
        return
      }
      if (!val && val !== 0) {
        this.model = ''
      }
      this.timer = setTimeout(() => {
        this.$emit('input', this.model)
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
      return this.before || [{icon: this.icon, handler: this.focus}]
    },
    controlAfter () {
      return this.after || [{
        icon: this.inverted ? 'clear' : 'cancel',
        content: true,
        handler: this.clear
      }]
    }
  },
  methods: {
    clear () {
      this.$refs.input.clear()
    }
  }
}
</script>
