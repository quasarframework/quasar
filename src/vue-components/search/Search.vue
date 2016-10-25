<template>
  <div
    class="quasar-search"
    :class="{'quasar-search-centered': !this.focused && this.model === '', disabled: disable, readonly: readonly}"
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
        @focus="focus()"
        @blur="blur()"
        :disabled="disable"
        :readonly="readonly"
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
import Utils from '../../utils'

export default {
  props: {
    value: {
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
    readonly: Boolean,
    disable: Boolean
  },
  data () {
    return {
      focused: false
    }
  },
  watch: {
    debounce (value) {
      this.__createDebouncedTrigger(value)
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.__update(value)
      }
    }
  },
  methods: {
    clear () {
      if (!this.disable && !this.readonly) {
        this.$emit('input', '')
      }
    },
    __createDebouncedTrigger (debounce) {
      this.__update = Utils.debounce(value => {
        if (this.value !== value) {
          this.$emit('input', value)
        }
      }, debounce)
    },
    focus () {
      if (!this.disable && !this.readonly) {
        this.focused = true
      }
    },
    blur () {
      this.focused = false
    }
  },
  created () {
    this.__createDebouncedTrigger(this.debounce)
  }
}
</script>
