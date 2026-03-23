<template>
  <div class="q-pa-md">
    <div class="q-mb-md">
      Browser User Agent: "<strong>{{ $q.platform.userAgent }}</strong
      >"
    </div>

    <q-markup-table flat bordered dense>
      <thead>
        <tr>
          <th class="text-left">Property</th>
          <th class="text-left">Value</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(value, prop) in $q.platform.is"
          :key="prop"
          :class="
            value ? 'text-weight-bold platform-detection--row-highlight' : ''
          "
        >
          <td>{{ prop }}</td>
          <td>{{ value }}</td>
        </tr>
      </tbody>
    </q-markup-table>

    <div class="q-mt-md">
      The device which you are using to view this website
      <strong>{{ touch }}</strong> touch capability.
    </div>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { computed } from 'vue'

export default {
  setup() {
    const $q = useQuasar()

    return {
      touch: computed(() => ($q.platform.has.touch ? 'has' : 'does not have'))
    }
  }
}
</script>

<style lang="sass">
body
  &.body--light
    .platform-detection--row-highlight
      background-color: rgba(0,0,0,.05)
  &.body--dark
    .platform-detection--row-highlight
      background-color: rgba(255,255,255,.05)
</style>
