<template>
  <div class="q-pa-md">
    <div class="q-pb-sm">
      Model: {{ model }}
    </div>

    <q-date v-model="model" range />
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: { from: '2020/07/08', to: '2020/07/17' }
    }
  }
}
</script>
