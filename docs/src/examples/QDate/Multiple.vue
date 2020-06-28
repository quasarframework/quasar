<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-date
        v-model="dates"
        multiple
        :range="range"
      />
      <q-toggle label="Range" v-model="range" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      range: false,
      dates: [ '2012/06/18', '2015/04/10' ]
    }
  }
}
</script>
