<template>
  <div class="q-pa-md">
    <q-date
      v-model="date"
      first-day-of-week="1"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      date: '2019/02/01'
    }
  }
}
</script>
