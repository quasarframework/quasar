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
    <q-chip
      small
      :closable="editable"
      slot="flow-before"
      v-for="(label, index) in value"
      :key="index"
      :class="chipClasses"
      @close="remove(index)"
    >
      {{ label }}
    </q-chip>

    <q-icon
      name="send"
      slot="after"
      class="self-end q-chips-button cursor-pointer"
      @click="add()"
      :class="{invisible: !input.length}"
    ></q-icon>

    <slot></slot>
  </q-input>
</template>

<script>
import { QInput } from '../input'
import { QIcon } from '../icon'
import { QChip } from '../chip'

export default {
  name: 'q-chips',
  components: {
    QInput,
    QIcon,
    QChip
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    disable: Boolean,
    readonly: Boolean,
    error: Boolean,
    placeholder: String,
    chipClasses: [String, Object, Array]
  },
  data () {
    return {
      input: ''
    }
  },
  computed: {
    editable () {
      return !this.disable && !this.readonly
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
