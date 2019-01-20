<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <q-color
        v-model="color"
        inline
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      color: '#ff00ff'
    }
  }
}
</script>
