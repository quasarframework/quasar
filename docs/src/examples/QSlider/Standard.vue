<template>
  <div class="q-pa-md">

    <q-chip square color="secondary" text-color="white">
      Model: {{ standard }} (0 to 50)
    </q-chip>

    <q-slider v-model="standard" :min="0" :max="50"/>
    <q-slider v-model="standard" :min="0" :max="50" color="green"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      standard: 2
    }
  }
}
</script>
