<template>
  <div
    class="q-search"
    :class="{'q-search-centered': centered, disabled: disable, readonly: readonly}"
  >
    <div class="q-search-input-container">
      <button class="q-search-icon">
        <i>{{ icon }}</i>
        <span v-show="$quasar.theme === 'ios' && this.value === '' && !hasText">{{placeholder}}</span>
      </button>
      <input
        type="text"
        class="q-search-input no-style"
        :placeholder="$quasar.theme === 'mat' ? placeholder : ''"
        v-model="model"
        @focus="focus()"
        @blur="blur()"
        :disabled="disable"
        :readonly="readonly"
      >
      <button
        class="q-search-clear"
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
      focused: false,
      hasText: this.value.length > 0
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
        this.hasText = this.value.length > 0
        return this.value
      },
      set (value) {
        this.hasText = value.length > 0
        this.__update(value)
      }
    },
    centered () {
      return !this.focused && this.value === ''
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
