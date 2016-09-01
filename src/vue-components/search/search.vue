<template>
  <div
    class="quasar-search"
    :class="{'quasar-search-centered': !this.focused && this.model === '', disabled: disabled}"
  >
    <div class="quasar-search-input-container">
      <button class="quasar-search-icon">
        <i>{{ icon }}</i>
      </button>
      <input
        type="text"
        class="quasar-search-input no-style"
        :placeholder="placeholder"
        v-model="model"
        :debounce="debounce"
        @focus="focused = true"
        @blur="focused = false"
        :disabled="disabled"
      >
      <button
        class="quasar-search-clear"
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
    },
    icon: {
      type: String,
      default: 'search'
    },
    placeholder: {
      type: String,
      default: 'Search'
    },
    disabled: {
      type: Boolean,
      default: false,
      coerce: Boolean
    }
  },
  data () {
    return {
      focused: false
    }
  },
  methods: {
    clear () {
      if (!this.disabled) {
        this.model = ''
      }
    }
  }
}
</script>
