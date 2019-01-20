<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <q-color
        v-model="nullModel"
        default-value="#c0c0c0"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      nullModel: null
    }
  }
}
</script>
