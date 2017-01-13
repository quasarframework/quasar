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
    checkFirst () {
      let currentOpened = 0
      this.$children.forEach(child => {
        if (child.active) {
          if (currentOpened === 0) {
            currentOpened = child.element
          }
          else {
            child.active = false
          }
        }
      })
      if (currentOpened !== 0) {
        this.config.currentElement = currentOpened
      }
    },
    checkOpened () {
      let current = this.config.currentElement
      this.$children.forEach(child => {
        if (child.element !== current) {
          child.active = false
        }
      })
    },
    toggle () {
      this.checkOpened()
      this.$emit('toggle', this.config.currentElement)
    },
    open () {
      this.checkOpened()
      this.$emit('open', this.config.currentElement)
    },
    close () {
      this.checkOpened()
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
    this.checkFirst()
    this.checkOpened()
  }
}
</script>
