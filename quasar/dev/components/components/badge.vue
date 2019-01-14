<template>
  <div class="q-layout-padding bg-grey-3" style="min-height: 100vh">
    <div style="max-width: 500px">

      <div>Some text <q-badge>100</q-badge></div>
      <div>Some text <q-badge color="orange">100</q-badge></div>
      <div>Some text <q-badge color="yellow" text-color="black">100</q-badge></div>

      <q-btn color="primary" label="Button">
        <q-badge color="orange" floating>100+</q-badge>
      </q-btn>

      <h2>
        Some title
        <q-badge align="top">1.0.0+</q-badge>
      </h2>

      <h2>
        Some title
        <q-badge>1.0.0+</q-badge>
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dense: false
    }
  }
}
</script>
