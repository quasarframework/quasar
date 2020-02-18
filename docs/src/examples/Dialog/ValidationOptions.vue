<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Radio Options" color="primary" @click="radio" />
    <q-btn label="Checkbox Options" color="primary" @click="checkbox" />
    <q-btn label="Toggle Options" color="primary" @click="toggle" />
  </div>
</template>

<script>
export default {
  methods: {
    radio () {
      this.$q.dialog({
        title: 'Options',
        message: 'Choose your option, but make sure it\'s the second one :)',
        options: {
          type: 'radio',
          model: 'opt1',
          isValid: val => val === 'opt2',
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
        // console.log('>>>> OK, received', data)
      })
    },

    checkbox () {
      this.$q.dialog({
        title: 'Options',
        message: 'Choose your options, but make sure you also pick the second one.',
        options: {
          type: 'checkbox',
          model: [],
          isValid: model => model.includes('opt2'),
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
        // console.log('>>>> OK, received', data)
      })
    },

    toggle () {
      this.$q.dialog({
        title: 'Options',
        message: 'Choose your options, but make sure you also pick the first two.',
        options: {
          type: 'toggle',
          model: [],
          isValid: model => model.includes('opt1') && model.includes('opt2'),
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
        // console.log('>>>> OK, received', data)
      })
    }
  }
}
</script>
