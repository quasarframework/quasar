<template>
  <div class="q-pa-md">
    <div class="row q-gutter-sm">
      <q-btn no-caps unelevated color="positive" @click="triggerPositive" label="Trigger 'positive'" />
      <q-btn no-caps unelevated color="negative" @click="triggerNegative" label="Trigger 'negative'" />
      <q-btn no-caps unelevated color="warning" text-color="dark" @click="triggerWarning" label="Trigger 'warning'" />
      <q-btn no-caps unelevated color="info" @click="triggerInfo" label="Trigger 'info'" />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    triggerPositive () {
      this.$q.notify({
        type: 'positive',
        message: `This is a "positive" type notification.`
      })
    },

    triggerNegative () {
      this.$q.notify({
        type: 'negative',
        message: `This is a "negative" type notification.`
      })
    },

    triggerWarning () {
      this.$q.notify({
        type: 'warning',
        message: `This is a "warning" type notification.`
      })
    },

    triggerInfo () {
      this.$q.notify({
        type: 'info',
        message: `This is a "info" type notification.`
      })
    }
  }
}
</script>
