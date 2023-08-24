<template>
  <div class="q-layout-padding">
    <div>{{ n }} {{ typeof n }}</div>
    <q-input @update:model-value="onInput" type="number" v-model.number="n" input-class="text-right" class="q-ml-md col" />
    <q-input @update:model-value="onInput" type="number" v-model.number="n" input-class="text-right" class="q-ml-md col" />
    <q-input label="Debounced" @update:model-value="onInput" type="number" v-model.number="n" debounce="300" input-class="text-right" class="q-ml-md col" />

    <div class="q-mt-lg">
      Update if &lt; 4 and set on blur 1: {{ num1 }} {{ typeof num1 }}
    </div>
    <q-input type="number" :model-value="num1" @update:model-value="setNum1" @blur="num1 = 1" input-class="text-right" class="q-ml-md col" />

    <div class="q-mt-lg">
      Big debounce (3000): {{ num2 }} {{ typeof num2 }}
    </div>
    <q-input type="number" v-model.number="num2" :debounce="3000" input-class="text-right" class="q-ml-md col" />

    <div class="q-mt-lg">
      Big debounce (3000) and set on blur 1: {{ num3 }} {{ typeof num3 }}
    </div>
    <q-input type="number" v-model.number="num3" :debounce="3000" @blur="num3 = 1" input-class="text-right" class="q-ml-md col" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      n: null,
      num1: null,
      num2: null,
      num3: null
    }
  },
  methods: {
    onInput (val) {
      console.log(typeof val, val)
    },

    setNum1 (val) {
      const v = parseFloat(val)
      if (v < 4) {
        this.num1 = v
      }
    }
  }
}
</script>
