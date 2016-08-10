<template>
  <div class="quasar-pagination">
    <button :class="{disabled: model === min}" class="primary clear small circular" @click="model = min">
      <i>first_page</i>
    </button>
    <button :class="{disabled: model === min}" class="primary clear small circular" @click="changeModelByOffset(-1)">
      <i>keyboard_arrow_left</i>
    </button>

    <input
      v-el:input
      type="text"
      v-model="newPage"
      number
      lazy
      :style="{width: inputPlaceholder.length * 10 + 'px'}"
      :placeholder="inputPlaceholder"
    >

    <button :class="{disabled: model === max}" class="primary clear small circular" @click="changeModelByOffset(1)">
      <i>keyboard_arrow_right</i>
    </button>
    <button :class="{disabled: model === max}" class="primary clear small circular" @click="model = max">
      <i>last_page</i>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Number,
      twoWay: true,
      required: true,
      coerce: value => parseInt(value, 10)
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      rangeMode: false,
      newPage: ''
    }
  },
  methods: {
    changeModelByOffset (offset) {
      this.model = this.normalize(this.model + offset)
    },
    normalize (value) {
      return Math.min(this.max, Math.max(1, value))
    }
  },
  computed: {
    inputPlaceholder () {
      return this.model + ' / ' + this.max
    }
  },
  watch: {
    newPage (value) {
      var parsed = parseInt(value, 10)

      if (parsed) {
        this.model = this.normalize(parsed)
        this.$els.input.blur()
      }

      this.newPage = ''
    }
  }
}
</script>
