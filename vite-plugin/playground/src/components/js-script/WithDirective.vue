<template>
  <h6>With Directive (click on icon)</h6>

  <div>
    <q-icon v-ripple name="map" size="50px" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WithDirective'
})
</script>
