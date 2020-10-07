<template>
  <div class="q-layout-padding">
    <h5>Title of document should be "Test End"</h5>
  </div>
</template>

<script>
export default {
  data () {
    console.log('init')
    return {
      title: 'Test Start'
    }
  },

  mounted () {
    console.log('mounted')
    this.title = 'Test End'
  },

  meta () {
    console.log('running meta fn in title.vue', this.title)
    return {
      title: this.title
    }
  }
}
</script>
