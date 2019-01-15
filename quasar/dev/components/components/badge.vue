<template>
  <div class="q-layout-padding bg-grey-3" style="min-height: 100vh">
    <div class="q-gutter-y-md" style="max-width: 500px">

      <div>Some text <q-badge>100</q-badge></div>
      <div>Some text <q-badge color="orange">100</q-badge></div>
      <div>Some text <q-badge color="yellow" text-color="black">100</q-badge></div>

      <q-btn color="primary" label="Button">
        <q-badge color="orange" floating>100+</q-badge>
      </q-btn>
      <q-btn size="sm" color="primary" label="Button" class="q-ml-md">
        <q-badge color="orange" floating>100+</q-badge>
      </q-btn>
      <q-btn size="lg" dense color="primary" label="Button" class="q-ml-md">
        <q-badge color="orange" floating>4</q-badge>
      </q-btn>
      <q-btn color="primary" icon="map" round class="q-ml-md">
        <q-badge color="orange" floating>2</q-badge>
      </q-btn>
      <q-btn dense color="primary" icon="map" round class="q-ml-md">
        <q-badge color="orange" floating>2</q-badge>
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
