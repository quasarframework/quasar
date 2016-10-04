<template>
  <div
    class="quasar-chips group"
    @click.native="focus"
    :class="{active: active, disabled: disable}"
  >
    <span
      class="chip label bg-light text-grey-9"
      v-for="(label, index) in model"
      {{ label }}
      <i class="on-right" @click="remove(index)">close</i>
      :key="index"
    >
      {{ label }}
      <i class="on-right" @click.native="remove(index)">close</i>
    </span>
    <div class="quasar-chips-input chip label text-grey-9">
      <input
        type="text"
        class="no-style"
        ref="input"
        v-model="input"
        :value="value" 
        v-on:input="onInput"
        @keyup.enter="add()"
        @focus.native="active = true"
        @blur.native="active = false"
        v-attr="attrib"
        :placeholder="placeholder"
      >
      <button class="small" @click.native="add()" :class="{invisible: !input.length}">
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
      // twoWay: true // emit event instead
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
<<<<<<< HEAD
      this.$els.input.focus()
    },
    onInput: function (event) {
      this.$emit('input', event.target.value)
=======
      this.$refs.input.focus()
>>>>>>> 4915d33c9312efab098e7949159c1c88240cab3d
    }
  }
}
</script>
