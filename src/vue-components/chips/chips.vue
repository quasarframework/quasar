<template>
  <div
    class="quasar-chips group"
    @click="focus"
    :class="{active: active, disabled: disabled}"
  >
    <span
      class="chip label bg-light text-grey-9"
      v-for="label in model"
      track-by="$index"
    >
      {{ label }}
      <i class="on-right" @click="remove($index)">close</i>
    </span>
    <div class="quasar-chips-input chip label text-grey-9">
      <input
        type="text"
        class="no-style"
        v-el:input
        v-model="input"
        @keyup.enter="add()"
        @focus="active = true"
        @blur="active = false"
        :disabled="disabled"
        :placeholder="placeholder"
      >
      <button class="small" @click="add()" :class="{invisible: !input.length}">
        <i>send</i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Array,
      twoWay: true,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false,
      coerce: Boolean
    },
    placeholder: String
  },
  data () {
    return {
      active: false,
      input: ''
    }
  },
  methods: {
    add () {
      if (!this.disabled && this.input) {
        this.model.push(this.input)
        this.input = ''
      }
    },
    remove (index) {
      if (!this.disabled && index >= 0 && index < this.model.length) {
        this.model.splice(index, 1)
      }
    },
    focus () {
      this.$els.input.focus()
    }
  }
}
</script>
