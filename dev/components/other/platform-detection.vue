<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        Based on the device you are using to view this, Quasar detects the following:
      </p>

      <table class="q-table striped">
        <thead>
          <tr>
            <th class="text-left">Property</th>
            <th class="text-left">Value</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(value, prop) in platform">
            <td>{{ prop }}</td>
            <td>{{ value }}</td>
          </tr>
        </tbody>
      </table>

      <p class="caption">
        Your device <strong>{{ touch }}</strong> touch capability.
      </p>
    </div>
  </div>
</template>

<script>
import { Platform } from 'quasar'

export default {
  data () {
    return {
      platform: Platform.is
    }
  },
  computed: {
    touch () {
      return Platform.has.touch ? 'has' : 'does not have'
    }
  }
}
</script>
