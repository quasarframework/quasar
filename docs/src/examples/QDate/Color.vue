<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-date
        v-model="date"
        color="secondary"
      />
    </div>
    <div class="row justify-center">
      <q-date
        v-model="date"
        color="orange-7"
      />
    </div>
    <div class="row justify-center">
      <q-date
        v-model="date"
        color="blue-grey-7"
      />
    </div>
    <div class="row justify-center">
      <q-date
        v-model="date"
        color="purple-3"
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
