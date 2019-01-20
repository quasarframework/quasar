<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      :max="10"
      :maxPages="5"
      :ellipses="false"
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
