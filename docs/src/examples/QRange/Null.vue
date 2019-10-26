<template>
  <div class="q-pa-md">
    <q-badge color="primary" class="q-mb-lg">
      Model: {{ getNullLabel(bothNull.min) }} to {{ getNullLabel(bothNull.max) }} (0 to 50, step 1)
    </q-badge>

    <q-range
      v-model="bothNull"
      color="primary"
      :min="0"
      :max="50"
    />

    <q-badge color="secondary" class="q-mb-lg">
      Model: {{ getNullLabel(minNull.min) }} to {{ getNullLabel(minNull.max) }} (0 to 50, step 1)
    </q-badge>

    <q-range
      v-model="minNull"
      color="secondary"
      :min="0"
      :max="50"
    />

    <q-badge color="accent" class="q-mb-lg">
      Model: {{ getNullLabel(maxNull.min) }} to {{ getNullLabel(maxNull.max) }} (0 to 50, step 1)
    </q-badge>

    <q-range
      v-model="maxNull"
      color="accent"
      :min="0"
      :max="50"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      bothNull: {
        min: null,
        max: null
      },

      minNull: {
        min: null,
        max: 40
      },

      maxNull: {
        min: 20,
        max: null
      }
    }
  },

  methods: {
    getNullLabel (val) {
      return val === null ? 'null' : val
    }
  }
}
</script>
