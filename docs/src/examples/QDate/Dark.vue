<template>
  <div class="q-pa-md bg-grey-10 text-white">
    <div class="row justify-center">
      <q-date
        v-model="date"
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
