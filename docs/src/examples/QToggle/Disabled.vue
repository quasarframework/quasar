<template>
  <div class="q-pa-md">
    <q-toggle
      v-model="value"
      color="primary"
      disable
    />

    <q-toggle
      v-model="value"
      color="green"
      disable
    />

    <q-toggle
      v-model="value"
      color="yellow"
      disable
    />

    <q-toggle
      v-model="value"
      color="red"
      disable
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
