<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-date
        v-model="date"
        default-year-month="1964/08"
      />
    </div>
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
