<template>
  <div class="q-pagination" :class="{disabled: disable}">
    <button :class="{disabled: value === min}" class="primary clear small" @click="set(min)">
      <i>first_page</i>
    </button>
    <button :class="{disabled: value === min}" class="primary clear small" @click="setByOffset(-1)">
      <i>keyboard_arrow_left</i>
    </button>

    <q-input
      ref="input"
      class="inline"
      type="number"
      v-model="newPage"
      no-extra-icons
      :min="min"
      :max="max"
      :style="{width: inputPlaceholder.length * 10 + 'px'}"
      :placeholder="inputPlaceholder"
      :disabled="disable"
      @keyup.enter="__update"
      @blur="__update"
    ></q-input>

    <button :class="{disabled: value === max}" class="primary clear small" @click="setByOffset(1)">
      <i>keyboard_arrow_right</i>
    </button>
    <button :class="{disabled: value === max}" class="primary clear small" @click="set(max)">
      <i>last_page</i>
    </button>
  </div>
</template>

<script>
import { between } from '../../utils/format'

export default {
  props: {
    value: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      required: true
    },
    disable: Boolean
  },
  data () {
    return {
      newPage: ''
    }
  },
  methods: {
    set (value) {
      if (!this.disable) {
        this.model = value
      }
    },
    setByOffset (offset) {
      if (!this.disable) {
        this.model = this.value + offset
      }
    },
    __normalize (value) {
      return between(parseInt(value, 10), 1, this.max)
    },
    __update () {
      var parsed = parseInt(this.newPage, 10)
      console.log('__onBlur', parsed)

      if (parsed) {
        console.log('blurring and setting model')
        this.model = parsed
        this.$refs.input.blur()
      }

      this.newPage = ''
    }
  },
  computed: {
    model: {
      get () {
        console.log('getter')
        return this.value
      },
      set (value) {
        if (!value) {
          return
        }
        if (value < this.min || value > this.max) {
          return
        }
        if (this.value !== value) {
          this.$emit('input', value)
        }
      }
    },
    inputPlaceholder () {
      return this.value + ' / ' + this.max
    }
  }
}
</script>
