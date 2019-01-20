<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      :max="10"
      :maxPages="6"
      :boundaryNumbers="false"
    >
    </q-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      current: 5
    }
  }
}
</script>
