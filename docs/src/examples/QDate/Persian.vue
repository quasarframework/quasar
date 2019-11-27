<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-date
        v-model="date"
        calendar="persian"
        today-btn
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      date: '1397/08/12'
    }
  }
}
</script>
