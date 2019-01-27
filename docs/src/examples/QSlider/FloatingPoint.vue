<template>
  <div class="q-pa-md">
    <q-chip square color="secondary" text-color="white">
      Model: {{ smallStep }} (0.1 to 1.5, step 0.1)
    </q-chip>
    <q-slider
      v-model="smallStep"
      :min="0.1"
      :max="1.5"
      :step="0.1"
    />
    <q-chip square color="secondary" text-color="white">
      Model: {{ zeroStep }} (0.0 to 1.5, step 0)
    </q-chip>
    <q-slider
      v-model="zeroStep"
      :min="0.0"
      :max="1.5"
      :step="0"
      color="green"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      smallStep: 0.3,
      zeroStep: 0.5
    }
  }
}
</script>
