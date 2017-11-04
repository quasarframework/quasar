<template>
 <div>Test area</div>
</template>

<script>
import {
  Dialog
} from 'quasar'

export default {
  name: 'Test',
  beforeCreate () {
    console.log(`Quasar v${this.$q.version}`)
    console.log('has popstate:', this.$q.platform.has.popstate)
    window.addEventListener('popstate', () => {
      console.log('popstate occurred')
    })
  },
  created () {
    console.log('route', this.$route)
  },
  methods: {
    testDialog () {
      Dialog.create({
        title: 'Test Dialog 1',
        buttons: [
          {
            label: 'Button 1',
            preventClose: true,
            handler (data, closeThis) {
              console.log('Button 1 clicked')
              closeThis()
            }
          },
          {
            label: 'Button 2',
            handler () {
              console.log('Button 2 clicked')
            }
          }
        ]
      })
    }
  },
  mounted () {
    this.testDialog()
  }
}
</script>
