<template>
  <div class="q-pa-md">
    <div class="row q-gutter-sm">
      <q-btn no-caps color="teal" @click="triggerTwice" label="Trigger twice" />
      <q-btn no-caps color="teal" @click="triggerNoGroupingTwice" label="Trigger twice (no grouping)" />
      <q-btn no-caps color="teal" @click="triggerTwiceCustomGroup" label="Trigger twice (custom group)" />
    </div>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'

export default {
  setup () {
    const $q = useQuasar()

    return {
      triggerTwice () {
        $q.notify({
          message: 'Jim pinged you.',
          color: 'purple'
        })

        $q.notify({
          message: 'Jim pinged you.',
          color: 'purple'
        })
      },

      triggerNoGroupingTwice () {
        $q.notify({
          group: false,
          message: 'Jim pinged you.',
          color: 'purple'
        })

        $q.notify({
          group: false,
          message: 'Jim pinged you.',
          color: 'purple'
        })
      },

      triggerTwiceCustomGroup () {
        $q.notify({
          group: 'my-group',
          message: 'Jim pinged you.',
          color: 'purple'
        })

        // same group as the previous one,
        // so it will replace it and
        // increment the badge number:
        $q.notify({
          group: 'my-group',
          message: 'Jack has messaged you.',
          color: 'primary'
        })
      }
    }
  }
}
</script>
