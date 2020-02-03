<template>
  <div class="q-pa-md">
    <q-btn label="Prompt" color="primary" @click="prompt" />
  </div>
</template>

<script>
export default {
  methods: {
    prompt () {
      this.$q.dialog({
        title: 'Prompt',
        message: 'What is your name? (Minimum 3 characters)',
        prompt: {
          model: '',
          isValid: val => val.length > 2, // << here is the magic
          type: 'text' // optional
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
