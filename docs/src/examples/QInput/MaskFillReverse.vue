<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-input
        filled
        v-model="price"
        label="Price with 2 decimals"
        mask="#.##"
        fill-mask="0"
        reverse-fill-mask
        hint="Mask: #.##"
        input-class="text-right"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      price: null
    }
  }
}
</script>
