<template>
  <div class="q-pa-md">
    <q-btn color="purple" @click="showNotif" label="Show Notification" />
  </div>
</template>

<script>
export default {
  methods: {
    showNotif () {
      this.$q.notify({
        message: 'Jim pinged you.',
        color: 'purple',
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png'
      })
    }
  }
}
</script>
