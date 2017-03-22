<template>
  <div
    class="q-search"
    :class="{'q-search-centered': centered, disabled: disable, readonly: readonly}"
  >
    <div class="q-search-input-container" v-ripple.mat>
      <button class="q-search-icon">
        <q-icon :name="icon"></q-icon>
        <span v-show="$q.theme === 'ios' && isEmpty">{{placeholder}}</span>
      </button>
      <input
        v-if="numeric"
        type="number"
        pattern="[0-9]*"
        class="q-search-input"
        :placeholder="$q.theme === 'mat' ? placeholder : ''"
        v-model="model"
        @focus="focus"
        @blur="blur"
        :disabled="disable"
        :readonly="readonly"
        tabindex="0"
      >
      <input
        v-else
        type="text"
        class="q-search-input"
        :placeholder="$q.theme === 'mat' ? placeholder : ''"
        v-model="model"
        @focus="focus"
        @blur="blur"
        :disabled="disable"
        :readonly="readonly"
        tabindex="0"
      >
      <button
        class="q-search-clear"
        @click="clear"
        :class="{hidden: this.model === ''}"
      >
        <q-icon name="clear" class="mat-only"></q-icon>
        <q-icon name="cancel" class="ios-only"></q-icon>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    numeric: Boolean,
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
      }
    },
    blur () {
      this.focused = false
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>
