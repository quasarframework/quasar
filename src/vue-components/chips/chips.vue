<template>
  <div
    class="quasar-chips group"
    @click="focus"
    :class="{active: active, disabled: disable}"
  >
    <span
      class="chip label bg-light text-grey-9"
      v-for="(label, index) in model"
      :key="index"
    >
      {{ label }}
      <i class="on-right" @click="remove(index)">close</i>
    </span>
    <div class="quasar-chips-input chip label text-grey-9">
      <input
        type="text"
        class="no-style"
        ref="input"
        :value="value"
        @input="__onInput"
        @keyup.enter="add()"
        @focus="active = true"
        @blur="active = false"
        v-attr="attrib"
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
    value: {
      type: Array,
      required: true
    },
    disable: {
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
  computed: {
    attrib () {
      return this.disable ? 'disabled' : []
    }
  },
  methods: {
    __onInput (event) {
      this.$emit('input', event.target.value)
    },
    add () {
      if (!this.disable && this.input) {
        this.model.push(this.input)
        this.input = ''
      }
    },
    remove (index) {
      if (!this.disable && index >= 0 && index < this.model.length) {
        this.model.splice(index, 1)
      }
    },
    focus () {
      this.$refs.input.focus()
    }
  }
}
</script>
