<template>
  <div
    class="quasar-chips group"
    @click.native="focus"
    :class="{active: active, disabled: disable}"
  >
    <span
      class="chip label bg-light text-grey-9"
      v-for="(label, index) in model"
      :key="index"
    >
      {{ label }}
      <i class="on-right" @click.native="remove(index)">close</i>
    </span>
    <div class="quasar-chips-input chip label text-grey-9">
      <input
        type="text"
        class="no-style"
        v-el:input
        v-model="input"
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
      twoWay: true,
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
      this.$els.input.focus()
    }
  }
}
</script>
