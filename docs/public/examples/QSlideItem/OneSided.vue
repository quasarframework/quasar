<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-list bordered separator>

      <q-slide-item @left="onLeft" @right="onRight">
        <template v-slot:left>
          <q-icon name="done" />
        </template>

        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar2.jpg" draggable="false">
            </q-avatar>
          </q-item-section>
          <q-item-section>Only left action</q-item-section>
        </q-item>
      </q-slide-item>

      <q-slide-item @left="onLeft" @right="onRight">
        <template v-slot:right>
          <q-icon name="alarm" />
        </template>

        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar3.jpg" draggable="false">
            </q-avatar>
          </q-item-section>
          <q-item-section>Only right action</q-item-section>
        </q-item>
      </q-slide-item>

      <q-slide-item @left="onLeft" @right="onRight">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar5.jpg" draggable="false">
            </q-avatar>
          </q-item-section>
          <q-item-section>No actions</q-item-section>
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
      onLeft ({ reset }) {
        $q.notify('Left action triggered. Resetting in 1 second.')
        finalize(reset)
      },

      onRight ({ reset }) {
        $q.notify('Right action triggered. Resetting in 1 second.')
        finalize(reset)
      }
    }
  }
}
</script>
