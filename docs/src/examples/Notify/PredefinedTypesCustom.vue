<template>
  <div class="q-pa-md">
    <div class="row q-gutter-sm">
      <q-btn no-caps color="brown" @click="triggerCustomRegisteredType1" label="Trigger 1" />
      <q-btn no-caps color="primary" @click="triggerCustomRegisteredType2" label="Trigger 2" />
    </div>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'

export default {
  setup () {
    const $q = useQuasar()

    /**
     * The reason we have this here
     * is that the type needs to be
     * registered before using it.
     *
     * The best place would be a boot file instead
     * of a .vue file, otherwise it'll keep on
     * registering it every time your component
     * gets to be used :)
     */

    $q.notify.registerType('my-notif', {
      icon: 'announcement',
      progress: true,
      color: 'brown',
      textColor: 'white',
      classes: 'glossy'
    })

    return {
      triggerCustomRegisteredType1 () {
        $q.notify({
          type: 'my-notif',
          message: 'This notification is using a custom type.'
        })
      },

      triggerCustomRegisteredType2 () {
        // this one overrides some of the original
        // options of the "my-notif" registered type
        $q.notify({
          type: 'my-notif',
          icon: 'contactless',
          message: 'This notification is using a custom type.',
          caption: 'It overrides the type\'s default icon and color.',
          color: 'primary'
        })
      }
    }
  }
}
</script>
