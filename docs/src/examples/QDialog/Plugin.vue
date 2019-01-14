<template>
  <div class="q-layout-padding q-mx-auto">
    <div class="row justify-center">
      <div class="q-gutter-md" style="max-width: 700px">
        <q-btn label="Alert" flat color="primary" @click="alert" />
        <q-btn label="Confirm" flat color="primary" @click="confirm" />
        <q-btn label="Prompt" flat color="primary" @click="prompt" />
        <q-btn label="Radio Options" flat color="primary" @click="radio" />
        <q-btn label="Checkbox Options" flat color="primary" @click="checkbox" />
        <q-btn label="Toggle Options" flat color="primary" @click="toggle" />
        <q-btn label="Positioned" flat color="primary" @click="positioned" />
        <q-btn label="Stacked Buttons" flat color="primary" @click="stacked" />
        <q-btn label="Auto Closing" flat color="primary" @click="autoClose" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    alert () {
      this.$q.dialog({
        title: 'Alert',
        message: 'Some message'
      }).onOk(() => {
        console.log('OK')
      }).onCancel(() => {
        console.log('Cancel')
      })
    },

    confirm () {
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
      }).onOk(() => {
        console.log('>>>> second OK catcher')
      }).onCancel(() => {
        console.log('>>>> Cancel')
      })
    },

    prompt () {
      this.$q.dialog({
        title: 'Prompt',
        message: 'What is your name?',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true,
        color: 'secondary'
      }).onOk(data => {
        console.log('>>>> OK, received', data)
      }).onCancel(() => {
        console.log('>>>> Cancel')
      })
    },

    radio () {
      this.$q.dialog({
        title: 'Options',
        message: 'Choose your options',
        options: {
          type: 'radio',
          model: 'opt1',
          // inline: true
          items: [
            { label: 'Option 1', value: 'opt1', color: 'secondary' },
            { label: 'Option 2', value: 'opt2' },
            { label: 'Option 3', value: 'opt3' }
          ]
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        console.log('>>>> OK, received', data)
      }).onCancel(() => {
        console.log('>>>> Cancel')
      })
    },

    checkbox () {
      this.$q.dialog({
        title: 'Options',
        message: 'Choose your options',
        options: {
          type: 'checkbox',
          model: [],
          // inline: true
          items: [
            { label: 'Option 1', value: 'opt1', color: 'secondary' },
            { label: 'Option 2', value: 'opt2' },
            { label: 'Option 3', value: 'opt3' }
          ]
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        console.log('>>>> OK, received', data)
      }).onCancel(() => {
        console.log('>>>> Cancel')
      })
    },

    toggle () {
      this.$q.dialog({
        title: 'Options',
        message: 'Choose your options',
        options: {
          type: 'toggle',
          model: [],
          // inline: true,
          items: [
            { label: 'Option 1', value: 'opt1', color: 'secondary' },
            { label: 'Option 2', value: 'opt2' },
            { label: 'Option 3', value: 'opt3' }
          ]
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        console.log('>>>> OK, received', data)
      }).onCancel(() => {
        console.log('>>>> Cancel')
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
        clearTimeout(timer)
      }).onCancel(() => {
        console.log('Cancel')
        clearTimeout(timer)
      })

      const timer = setTimeout(() => {
        dialog.hide()
      }, 3000)
    }
  }
}
</script>
