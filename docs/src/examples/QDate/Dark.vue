<template>
  <div class="q-pa-md bg-grey-10 text-white">
    <div class="q-gutter-md">
      <q-date
        v-model="date"
        dark
      />

      <q-date
        v-model="date"
        color="orange"
        text-color="black"
        dark
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
