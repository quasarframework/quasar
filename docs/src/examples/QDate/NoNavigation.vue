<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-date v-model="date" no-navigation />

      <q-date v-model="date" landscape no-navigation />

      <q-date
        v-model="date"
        minimal
        no-navigation
      />
    </div>
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
