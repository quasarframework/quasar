<template>
  <div class="q-pa-md bg-grey-10 text-white">
    <q-toggle
      color="blue"
      dark
      v-model="blue"
    />

    <q-toggle
      color="green"
      dark
      v-model="green"
    />

    <q-toggle
      color="yellow"
      dark
      v-model="yellow"
    />

    <q-toggle
      color="red"
      dark
      v-model="red"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      blue: false,
      green: true,
      yellow: true,
      red: false
    }
  }
}
</script>
