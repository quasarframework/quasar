<template>
  <div class="q-pa-md">
    <q-chip square color="secondary" text-color="white">
      Model: {{ basicModel }} (0 to 10)
    </q-chip>
    <q-slider
      v-model="basicModel"
      markers
      :min="0"
      :max="10"
    />

    <q-chip square color="secondary" text-color="white">
      Model: {{ greenModel }} (0 to 10)
    </q-chip>
    <q-slider
      v-model="greenModel"
      color="green"
      markers
      :min="0"
      :max="10"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      basicModel: 2,
      greenModel: 0
    }
  }
}
</script>
