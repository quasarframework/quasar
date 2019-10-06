<template>
  <div class="q-pa-md" style="max-width: 220px">
    <q-list bordered separator>

      <q-slide-item @top="onTop" @bottom="onBottom">
        <template v-slot:top>
          <q-icon name="link" />
        </template>
        <template v-slot:bottom>
          <q-icon name="link_off" />
        </template>

        <q-item style="height: 150px">
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" icon="fingerprint" />
          </q-item-section>
          <q-item-section>Slide vertically</q-item-section>
        </q-item>
      </q-slide-item>

    </q-list>
  </div>
</template>

<script>
export default {
  methods: {
    onTop ({ reset }) {
      this.$q.notify('Top action triggered. Resetting in 1 second.')
      this.finalize(reset)
    },

    onBottom ({ reset }) {
      this.$q.notify('Bottom action triggered. Resetting in 1 second.')
      this.finalize(reset)
    },

    finalize (reset) {
      this.timer = setTimeout(() => {
        reset()
      }, 1000)
    }
  },

  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>
