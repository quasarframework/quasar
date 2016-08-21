<template>
  <div
    class="quasar-chips group"
    @click="focus"
    :class="{active: active}"
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
      >
      <button class="small text-light" @click="add()" :class="{invisible: !input.length}">
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
    }
  },
  data () {
    return {
      active: false,
      input: ''
    }
  },
  methods: {
    add () {
      if (this.input) {
        this.model.push(this.input)
        this.input = ''
      }
    },
    remove (index) {
      this.model.splice(index, 1)
    },
    focus () {
      this.$els.input.focus()
    }
  }
}
</script>
