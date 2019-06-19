<template>
  <div class="q-layout-padding">
    <div>{{ n }} {{ typeof n }}</div>
    <q-input @input="onInput" type="number" v-model.number="n" input-class="text-right" class="q-ml-md col" />
    <q-input @input="onInput" type="number" v-model.number="n" input-class="text-right" class="q-ml-md col" />
    <q-input label="Debounced" @input="onInput" type="number" v-model.number="n" debounce="300" input-class="text-right" class="q-ml-md col" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      n: null
    }
  },
  methods: {
    onInput (val) {
      console.log(typeof val, val)
    }
  }
}
</script>
