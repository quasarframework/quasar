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
import { useQuasar } from 'quasar'
import { onBeforeUnmount } from 'vue'

export default {
  setup () {
    const $q = useQuasar()
    let timer

    function finalize (reset) {
      timer = setTimeout(() => {
        reset()
      }, 1000)
    }

    onBeforeUnmount(() => {
      clearTimeout(timer)
    })

    return {
      onTop ({ reset }) {
        $q.notify('Top action triggered. Resetting in 1 second.')
        finalize(reset)
      },

      onBottom ({ reset }) {
        $q.notify('Bottom action triggered. Resetting in 1 second.')
        finalize(reset)
      }
    }
  }
}
</script>
