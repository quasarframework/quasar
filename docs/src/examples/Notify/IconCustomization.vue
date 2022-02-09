<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn color="purple" @click="showNotif1" label="Icon Color" />
    <q-btn color="purple" @click="showNotif2" label="Icon Size" />
    <q-btn color="purple" @click="showNotif3" label="Combined" />
  </div>
</template>

<script>
import { useQuasar } from 'quasar'

export default {
  setup () {
    const $q = useQuasar()

    return {
      showNotif1 () {
        $q.notify({
          message: 'Icon color: yellow.',
          color: 'purple',
          icon: 'map',
          iconColor: 'yellow-8'
        })
      },
      showNotif2 () {
        $q.notify({
          message: 'Icon size: xl.',
          color: 'purple',
          icon: 'map',
          iconSize: 'xl'
        })
      },
      showNotif3 () {
        $q.notify({
          message: 'iconColor=yellow, iconSize=xl.',
          color: 'purple',
          icon: 'map',
          iconColor: 'yellow',
          iconSize: 'lg'
        })
      }
    }
  }
}
</script>
