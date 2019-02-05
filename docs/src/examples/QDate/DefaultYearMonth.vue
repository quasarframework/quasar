<template>
  <div class="q-pa-md">
    <q-date
      v-model="date"
      default-year-month="1964/08"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      date: null
    }
  }
}
</script>
