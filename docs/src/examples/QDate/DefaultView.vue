<template>
  <div class="q-pa-md">
    <q-date
      v-model="date"
      default-view="Years"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      date: null
    }
  }
}
</script>
