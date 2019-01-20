<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <q-color
        v-model="color"
        disable
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
