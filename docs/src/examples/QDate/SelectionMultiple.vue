<template>
  <div class="q-pa-md">
    <div class="q-pb-sm">
      Model: {{ days }}
    </div>

    <q-date v-model="days" multiple />
  </div>
</template>

<script>
export default {
  data () {
    return {
      days: [ '2019/02/01', '2019/02/10' ]
    }
  }
}
</script>
