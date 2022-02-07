<template>
  <div>
    <div class="q-layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{ model }}</em></span>
      </div>
      <p class="caption">
        Default (@update:model-value, @change)
      </p>
      <q-toggle v-model="disabled" />
      <div class="q-gutter-sm">
        <q-knob
          v-model="model"
          :disable="disabled"
          :max="10"
          :step="1"
          color="primary"
          track-color="grey-3"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: 5,
      modelZero: 20.03,
      modelSmall: 1.1,
      min: 0,
      max: 50,
      maxSmall: 2,
      disabled: false
    }
  },
  watch: {
    model (val, old) {
      console.log(`Changed from ${ JSON.stringify(old) } to ${ JSON.stringify(val) }`)
    }
  },
  methods: {
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    },
    onInput (val) {
      console.log('@update:model-value', JSON.stringify(val))
    }
  }
}
</script>
