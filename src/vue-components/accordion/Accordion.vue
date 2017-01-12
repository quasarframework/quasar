<template>
  <div class="q-accordion">
     <slot></slot>
  </div>
</template>

<script>
export default {
  data () {
    return {
      config: {
        elements: 0,
        currentElement: 0
      }
    }
  },
  methods: {
    toggle () {
      let current = this.config.currentElement
      this.$children.forEach(child => {
        if (child.element !== current) {
          child.active = false
        }
      })
      this.$emit('toggle', current)
    },
    open () {
      this.$emit('open', this.config.currentElement)
    },
    close () {
      this.$emit('close', this.config.currentElement)
    }
  },
  mounted () {
    let element = 1
    this.config.currentElement = this.config.currentElement || 1
    this.config.elements = this.$children.length
    this.$emit('mounted', this.config.currentElement)
    this.$children.forEach(child => {
      child.element = element
      element++
    })
  }
}
</script>
