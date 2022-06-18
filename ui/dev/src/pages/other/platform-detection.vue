<template>
  <div>
    <div class="q-layout-padding">
      <p class="caption">
        Based on the device you are using to view this, Quasar detects the following:
      </p>

      <p>
        User agent: "<strong>{{ $q.platform.userAgent }}</strong>"
      </p>

      <q-markup-table bordered flat>
        <thead>
          <tr>
            <th class="text-left">
              Property
            </th>
            <th class="text-left">
              Value
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(value, prop) in $q.platform.is" :key="prop">
            <td>{{ prop }}</td>
            <td>{{ value }}</td>
          </tr>
        </tbody>
      </q-markup-table>

      <p class="caption">
        Your device <strong>{{ touch }}</strong> touch capability.
      </p>

      <p class="caption">
        Body classes: "{{ bodyClasses }}"
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      bodyClasses: ''
    }
  },

  computed: {
    touch () {
      return this.$q.platform.has.touch ? 'has' : 'does not have'
    }
  },

  mounted () {
    this.bodyClasses = document.body.classList.value
  }
}
</script>
