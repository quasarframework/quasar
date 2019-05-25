<template>
  <div class="q-pa-md">
    <q-date
      v-model="date"
      today-btn
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
