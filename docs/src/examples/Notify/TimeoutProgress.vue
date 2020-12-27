<template>
  <div class="q-pa-md">
    <q-btn no-caps color="purple" @click="showNotifs" label="Show timeout progress" />
  </div>
</template>

<script>
export default {
  methods: {
    showNotifs () {
      this.$q.notify({
        progress: true,
        message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic quisquam non ad sit assumenda consequuntur esse inventore officia. Corrupti reiciendis impedit vel, fugit odit quisquam quae porro exercitationem eveniet quasi.',
        color: 'primary',
        multiLine: true,
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        actions: [
          { label: 'Reply', color: 'yellow', handler: () => { /* ... */ } }
        ]
      })

      setTimeout(() => {
        this.$q.notify({
          progress: true,
          message: 'Jim emailed you.',
          icon: 'mail',
          color: 'white',
          textColor: 'primary'
        })
      }, 2000)

      setTimeout(() => {
        this.$q.notify({
          progress: true,
          message: 'Jim pinged you.',
          color: 'purple',
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          actions: [
            { label: 'Reply', color: 'yellow', handler: () => { /* ... */ } }
          ]
        })
      }, 3200)
    }
  }
}
</script>
