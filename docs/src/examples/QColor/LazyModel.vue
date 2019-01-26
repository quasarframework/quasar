<template>
  <div class="q-pa-md">
    <q-badge color="grey-3" text-color="black" class="q-mb-sm">
      {{ hex }}
    </q-badge>

    <q-color
      :value="hex"
      @change="val => { hex = val }"
      style="max-width: 250px"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      hex: '#112e1b'
    }
  }
}
</script>
