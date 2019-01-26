<template>
  <div class="q-pa-md">
    <q-chip square color="secondary" text-color="white">
      Model: {{ value }} (-20 to 20, step 4)
    </q-chip>
    <q-slider
      v-model="value"
      :min="-20"
      :max="20"
      :step="4"
      dark
      label
      label-always
      color="light-green"
    />
    <q-chip square color="secondary" text-color="white">
      Model: {{ value }} (-20 to 20, step 4)
    </q-chip>
    <q-slider
      v-model="value"
      :min="-20"
      :max="20"
      :step="4"
      dark
      label
      label-always
      color="red"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: 0
    }
  }
}
</script>
