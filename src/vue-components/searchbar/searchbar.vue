<template>
  <div
    class="quasar-searchbar"
    :class="{'quasar-searchbar-centered': !this.focused && this.model === ''}"
  >
    <div class="quasar-searchbar-input-container">
      <button class="quasar-searchbar-icon">
        <i>search</i>
      </button>
      <input
        type="text"
        class="quasar-searchbar-input no-style"
        placeholder="Search"
        v-model="model"
        :debounce="debounce"
        @focus="focused = true"
        @blur="focused = false"
      >
      <button
        class="quasar-searchbar-clear"
        @click="clear()"
        :class="{hidden: this.model === ''}"
      >
        <i class="mat-only">clear</i>
        <i class="ios-only">cancel</i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: String,
      default: ''
    },
    debounce: {
      type: Number,
      default: 300
    }
  },
  data () {
    return {
      focused: false
    }
  },
  methods: {
    clear () {
      this.model = ''
    }
  }
}
</script>
