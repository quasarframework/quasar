<template>
  <div class="q-pa-md">
    <p>
      Switch to another browser tab or app then come back here to see some changes.
    </p>

    <q-markup-table v-if="eventList.length > 0">
      <tbody>
        <tr v-for="evt in eventList" :key="evt.timestamp">
          <td>{{ evt.timestamp }}</td>
          <td>{{ evt.label }}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script>
function pad (number) {
  return (number < 10 ? '0' : '') + number
}

export default {
  data () {
    return {
      eventList: []
    }
  },

  watch: {
    '$q.appVisible' (state) {
      const date = new Date()
      this.eventList.unshift({
        timestamp: pad(date.getHours()) + ':' +
            pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + '.' +
            date.getMilliseconds(),
        label: `App became ${state ? 'visible' : 'hidden'}`
      })
    }
  }
}
</script>
