<template>
  <div class="quasar-pagination" :class="{disabled: disable}">
    <button :class="{disabled: model === min}" class="primary clear small" @click="__changeValueTo(min)">
      <i>first_page</i>
    </button>
    <button :class="{disabled: model === min}" class="primary clear small" @click="__changeValueByOffset(-1)">
      <i>keyboard_arrow_left</i>
    </button>

    <input
      ref="input"
      type="text"
      v-model.number.lazy="newPage"
      :style="{width: inputPlaceholder.length * 10 + 'px'}"
      :placeholder="inputPlaceholder"
      v-attr="attrib"
    >

    <button :class="{disabled: model === max}" class="primary clear small" @click="__changeValueByOffset(1)">
      <i>keyboard_arrow_right</i>
    </button>
    <button :class="{disabled: model === max}" class="primary clear small" @click="__changeValueTo(max)">
      <i>last_page</i>
    </button>
  </div>
</template>

<script>
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
    disable: {
      type: Boolean,
      default: false,
      coerce: Boolean
    }
  },
  data () {
    return {
      rangeMode: false,
      newPage: ''
    }
  },
  methods: {
    __changeValueTo (value) {
      if (!this.disable) {
        this.$emit('input', this.__normalize(value))
      }
    },
    __changeValueByOffset (offset) {
      if (!this.disable) {
        this.$emit('input', this.__normalize(this.value + offset))
      }
    },
    __normalize (value) {
      return Math.min(this.max, Math.max(1, parseInt(value, 10)))
    }
  },
  computed: {
    inputPlaceholder () {
      return this.value + ' / ' + this.max
    },
    attrib () {
      return this.disable ? 'disabled' : []
    }
  },
  watch: {
    newPage (value) {
      var parsed = parseInt(value, 10)

      if (parsed) {
        this.$emit('input', this.__normalize(parsed))
        this.$refs.input.blur()
      }

      this.newPage = ''
    }
  }
}
</script>
