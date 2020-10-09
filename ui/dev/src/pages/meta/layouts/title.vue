<template>
  <div class="q-layout-padding">
    <h5>Title of document should be "Test End"</h5>
  </div>
</template>

<script>
import { createMetaMixin } from 'quasar'

export default {
  mixins: [
    createMetaMixin(function () {
      console.log('running meta fn in title.vue', this.title)
      return {
        title: this.title
      }
    })
  ],

  data () {
    console.log('init')
    return {
      title: 'Test Start'
    }
  },

  mounted () {
    console.log('mounted, triggering title change')
    this.title = 'Test End'
  }
}
</script>
