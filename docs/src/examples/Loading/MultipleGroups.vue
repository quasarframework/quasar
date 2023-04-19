<template>
  <div class="q-pa-md">
    <q-btn color="purple" @click="showMultipleGroups" label="Show Multiple Groups" />
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { onBeforeUnmount } from 'vue'

export default {
  setup () {
    const $q = useQuasar()
    let timer

    onBeforeUnmount(() => {
      if (timer !== void 0) {
        clearTimeout(timer)
        $q.loading.hide()
      }
    })

    return {
      showMultipleGroups () {
        const first = $q.loading.show({
          group: 'first',
          message: 'This is first group',
          spinnerColor: 'amber',
          messageColor: 'amber'
        })

        // hiding in 2s
        timer = setTimeout(() => {
          const second = $q.loading.show({
            group: 'second',
            message: 'This is second group'
          })

          timer = setTimeout(() => {
            // we hide second one (only); but we will still have the first one active
            second()

            // we update 'first' group message (just highlighting how it can be done);
            // note that updating here is not required to show the remaining 'first' group
            first({
              message: 'We hid the second group and updated the first group message'
            })

            timer = setTimeout(() => {
              // we hide all that may be showing
              $q.loading.hide()
              timer = void 0
            }, 2000)
          }, 2000)
        }, 1500)
      }
    }
  }
}
</script>
