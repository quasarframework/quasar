<template>
  <div
    class="q-chips group textfield"
    @click="focus"
    :class="{active: active, disabled: disable, readonly: readonly}"
  >
    <span
      class="chip label bg-light text-grey-9"
      v-for="(label, index) in value"
      :key="index"
    >
      {{ label }}
      <i class="on-right" @click="remove(index)">close</i>
    </span>
    <div class="q-chips-input chip label text-grey-9">
      <input
        type="text"
        class="no-style"
        ref="input"
        v-model="input"
        @keyup.enter="add()"
        @focus="active = true"
        @blur="active = false"
        :disabled="disable"
        :placeholder="placeholder"
        tabindex="0"
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
    value: {
      type: Array,
      required: true
    },
    disable: Boolean,
    readonly: Boolean,
    placeholder: String
  },
  data () {
    return {
      active: false,
      input: ''
    }
  },
  methods: {
    add (value = this.input) {
      if (!this.disable && !this.readonly && value) {
        this.$emit('input', this.value.concat([value]))
        this.input = ''
      }
    },
    remove (index) {
      if (!this.disable && !this.readonly && index >= 0 && index < this.value.length) {
        let value = this.value.slice(0)
        value.splice(index, 1)
        this.$emit('input', value)
      }
    },
    focus () {
      this.$refs.input.focus()
    }
  }
}
</script>
