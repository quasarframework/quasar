<template>
  <div class="q-pa-md">
    <q-date
      v-model="date"
      navigation-min-year-month="2020/07"
      navigation-max-year-month="2020/09"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      date: '2020/07/04'
    }
  }
}
</script>
