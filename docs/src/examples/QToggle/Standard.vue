<template>
  <div class="q-pa-md">
    <q-toggle v-model="value" />

    <q-toggle
      v-model="value"
      color="green"
    />

    <q-toggle
      v-model="value"
      color="yellow"
    />

    <q-toggle
      v-model="value"
      color="red"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: true
    }
  }
}
</script>
