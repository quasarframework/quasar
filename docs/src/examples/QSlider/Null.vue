<template>
  <div class="q-pa-md">
    <q-badge color="primary" class="q-mb-lg">
      Model: {{ getNullLabel(basicModel) }} (step 1)
    </q-badge>

    <q-slider
      v-model="basicModel"
    />

    <q-badge color="secondary" class="q-mb-lg">
      Model: {{ getNullLabel(limitModel) }} (20 to 50, step 1)
    </q-badge>

    <q-slider
      v-model="limitModel"
      color="secondary"
      :min="20"
      :max="50"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      basicModel: null,
      limitModel: null
    }
  },

  methods: {
    getNullLabel (val) {
      return val === null ? 'null' : val
    }
  }
}
</script>
