<template>
  <div class="q-pa-md">
    <div class="q-mb-md">
      Browser User Agent: "<strong>{{ $q.platform.userAgent }}</strong>"
    </div>

    <q-markup-table flat bordered>
      <thead>
        <tr>
          <th class="text-left">Property</th>
          <th class="text-left">Value</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(value, prop) in $q.platform.is" :key="prop">
          <td>{{ prop }}</td>
          <td>{{ value }}</td>
        </tr>
      </tbody>
    </q-markup-table>

    <div class="q-mt-md">
      The device which you are using to view this website <strong>{{ touch }}</strong> touch capability.
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    touch () {
      return this.$q.platform.has.touch ? 'has' : 'does not have'
    }
  }
}
</script>
