<template>
  <q-input
    v-model="model"
    :type="type"
    :autofocus="autofocus"
    :pattern="pattern"
    :placeholder="placeholder"
    @focus="focus"
    @blur="blur"
    @keyup.enter="__enter"
    :disabled="disable"
    :readonly="readonly"
    clearable
    complex
    :extra-icons="false"
    :align="align"
    class="q-search"
    v-ripple.mat
  >
    <q-icon slot="before" :name="icon" class="q-input-comp"></q-icon>
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
    value: {
      type: [String, Number],
      default: ''
    },
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
    autofocus: Boolean,
    align: String,
    readonly: Boolean,
    disable: Boolean
  },
  data () {
    return {
      focused: false,
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
    centered () {
      return !this.focused && this.value === ''
    },
    editable () {
      return !this.disable && !this.readonly
    }
  },
  methods: {
    clear () {
      if (this.editable) {
        this.model = ''
      }
    },
    focus () {
      if (this.editable) {
        this.focused = true
        this.$emit('focus')
      }
    },
    blur () {
      this.focused = false
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
