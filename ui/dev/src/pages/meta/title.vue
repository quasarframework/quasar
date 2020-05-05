<template>
  <div class="q-layout-padding">
    <h5>Title of document should be "Test End"</h5>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: 'Test Start'
    }
  },

  mounted () {
    this.title = 'Test End'
  },

  meta () {
    return {
      title: this.title
    }
  }
}
</script>
