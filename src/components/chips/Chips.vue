<template>
  <q-input
    ref="input"
    v-model="input"
    @keydown="__handleKey"
    :disabled="disable"
    :readonly="readonly"
    :placeholder="placeholder"
    :error="error"
    @click.native="focus"
    class="q-chips"
  >
    <div slot="flow-before" v-for="(label, index) in value" :key="index" class="chip label bg-light text-grey-9">
      {{ label }}
      <q-icon name="close" class="on-right" @click="remove(index)"></q-icon>
    </div>

    <q-icon
      name="send"
      slot="after"
      class="self-end q-chips-button"
      @click="add()"
      :class="{invisible: !input.length}"
    ></q-icon>
  </q-input>
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
    error: Boolean,
    placeholder: String
  },
  data () {
    return {
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
    },
    __handleKey (e) {
      // ENTER key
      if (e.which === 13 || e.keyCode === 13) {
        this.add()
      }
      // Backspace key
      else if (e.which === 8 || e.keyCode === 8) {
        const length = this.value.length
        if (!this.input.length && length) {
          this.remove(length - 1)
        }
      }
    }
  }
}
</script>
