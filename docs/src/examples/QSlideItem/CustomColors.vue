<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-list bordered separator>

      <q-slide-item @left="onLeft" @right="onRight" left-color="red" right-color="purple">
        <template v-slot:left>
          <div class="row items-center">
            <q-icon left name="done" /> Left
          </div>
        </template>
        <template v-slot:right>
          <div class="row items-center">
            Right content.. long <q-icon right name="alarm" />
          </div>
        </template>

        <q-item>
          <q-item-section avatar>
            <q-icon color="primary" name="cell_wifi" />
          </q-item-section>
          <q-item-section>Custom colors (red, purple)</q-item-section>
        </q-item>
      </q-slide-item>

      <q-slide-item @left="onLeft" @right="onRight" left-color="amber" right-color="primary">
        <template v-slot:left>
          <div class="row items-center text-black">
            <q-icon left name="done" /> Left
          </div>
        </template>
        <template v-slot:right>
          <div class="row items-center">
            Right content.. long <q-icon right name="alarm" />
          </div>
        </template>

        <q-item class="bg-grey-9 text-white">
          <q-item-section avatar>
            <q-icon color="amber" name="event" />
          </q-item-section>
          <q-item-section>Custom colors 2</q-item-section>
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
