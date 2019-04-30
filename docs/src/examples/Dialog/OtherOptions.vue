<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Custom Buttons" color="primary" @click="customBtn" />
    <q-btn label="Positioned" color="primary" @click="positioned" />
    <q-btn label="Stacked Buttons" color="primary" @click="stacked" />
    <q-btn label="Auto Closing" color="primary" @click="autoClose" />
  </div>
</template>

<script>
export default {
  methods: {
    customBtn () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Would you like to turn on the wifi?',
        ok: {
          push: true
        },
        cancel: {
          push: true,
          color: 'negative'
        },
        persistent: true
      }).onOk(() => {
        console.log('>>>> OK')
      }).onCancel(() => {
        console.log('>>>> Cancel')
      }).onDismiss(() => {
        console.log('I am triggered on both OK and Cancel')
      })
    },

    positioned () {
      this.$q.dialog({
        title: 'Positioned',
        message: 'This dialog appears from bottom.',
        position: 'bottom'
      })
    },

    stacked () {
      this.$q.dialog({
        title: 'Stacked Buttons',
        stackButtons: true,
        cancel: true
      })
    },

    autoClose () {
      const dialog = this.$q.dialog({
        title: 'Alert',
        message: 'Autoclosing in 3 seconds.'
      }).onOk(() => {
        console.log('OK')
      }).onCancel(() => {
        console.log('Cancel')
      }).onDismiss(() => {
        clearTimeout(timer)
        console.log('I am triggered on both OK and Cancel')
      })

      const timer = setTimeout(() => {
        dialog.hide()
      }, 3000)
    }
  }
}
</script>
