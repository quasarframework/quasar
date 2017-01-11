<template>
  <div class="q-pagination" :class="{disabled: disable}">
    <button :class="{disabled: value === min}" class="primary clear small" @click="set(min)">
      <i>first_page</i>
    </button>
    <button :class="{disabled: value === min}" class="primary clear small" @click="setByOffset(-1)">
      <i>keyboard_arrow_left</i>
    </button>

    <input
      ref="input"
      type="number"
      v-model.number.lazy="newPage"
      :style="{width: inputPlaceholder.length * 10 + 'px'}"
      :placeholder="inputPlaceholder"
      :disabled="disable"
      tabindex="0"
    >

    <button :class="{disabled: value === max}" class="primary clear small" @click="setByOffset(1)">
      <i>keyboard_arrow_right</i>
    </button>
    <button :class="{disabled: value === max}" class="primary clear small" @click="set(max)">
      <i>last_page</i>
    </button>
  </div>
</template>

<script>
import Utils from '../../utils'

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
      return Utils.format.between(parseInt(value, 10), 1, this.max)
    }
  },
  watch: {
    newPage (value) {
      var parsed = parseInt(value, 10)

      if (parsed) {
        this.model = parsed
        this.$refs.input.blur()
      }

      this.newPage = ''
    }
  },
  computed: {
    model: {
      get () {
        return this.__normalize(this.value)
      },
      set (value) {
        if (this.value !== value) {
          this.$emit('input', this.__normalize(value))
        }
        this.$refs.input.blur()
      }
    },
    inputPlaceholder () {
      return this.value + ' / ' + this.max
    }
  }
}
</script>
