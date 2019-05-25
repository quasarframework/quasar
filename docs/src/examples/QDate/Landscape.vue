<template>
  <div class="q-pa-md">
    <q-date
      v-model="date"
      landscape
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
