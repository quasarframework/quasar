<template>
  <div class="q-layout-padding">
    <div>
      {{ modelXSimple }}
    </div>
    <q-slider
      v-model="modelXSimple"
      :min="0"
      :max="50"
      label
      @input="onXInput"
      @change="onXChange"
    />
    <q-slider
      :value="modelXSimple"
      :min="0"
      :max="50"
      label
      @change="val => { modelXSimple = val; onXChange(val) }"
    />
    <q-slider
      v-model="modelXSimple"
      :min="0"
      :max="50"
      label
      @change="onXChange"
    />
    <div>
      {{ modelX }}
    </div>
    <q-range
      v-model="modelX"
      :min="0"
      :max="50"
      label
      @input="onXInput"
      @change="onXChange"
    />
    <q-range
      :value="modelX"
      :min="0"
      :max="50"
      label
      @change="val => { modelX = val; onXChange(val) }"
    />
    <q-range
      v-model="modelX"
      :min="0"
      :max="50"
      label
      @change="onXChange"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      modelX: {
        min: 5,
        max: 25
      },

      modelXSimple: 5
    }
  },
  methods: {
    onXInput (val) {
      console.log('@input', val)
    },

    onXChange (val) {
      console.log('@change', val)
      this.$q.notify('@change ' + JSON.stringify(val))
    }
  }
}
</script>
