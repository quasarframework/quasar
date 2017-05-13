<template>
  <div class="q-toolbar" :class="classes">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'q-toolbar',
  props: {
    color: String,
    inverted: Boolean
  },
  computed: {
    classes () {
      const
        inv = this.inverted,
        cls = []

      cls.push(`q-toolbar-${inv ? 'inverted' : 'normal'}`)
      if (this.color) {
        cls.push(`${inv ? 'text' : 'bg'}-${this.color}`)
      }

      return cls
    }
  }
}
</script>
