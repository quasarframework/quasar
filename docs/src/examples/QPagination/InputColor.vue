<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      :max="5"
      :input="true"
      :input-class="inputClass"
    >
    </q-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      current: 3,
      inputClass: 'text-orange-10'
    }
  }
}
</script>
