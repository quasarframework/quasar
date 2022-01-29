<template>
  <div class="q-pa-md">
    <q-checkbox
      v-model="val"
      checked-icon="star"
      unchecked-icon="star_border"
      indeterminate-icon="help"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      val: true
    }
  }
}
</script>
