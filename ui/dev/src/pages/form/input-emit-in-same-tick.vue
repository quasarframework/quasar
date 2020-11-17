<template>
  <div class="q-layout-padding row items-start q-gutter-xl">
    <div class="col-6 column no-wrap q-gutter-y-lg" style="max-width: 300px">
      <q-input
        :value="tInput"
        label="Text - value/input"
        clearable
        @input="v => handlerSetLog('tInput', v)"
        @clear="() => handlerSetLog('tInput', void 0)"
      />

      <q-input
        type="number"
        :value="nInput"
        label="Number - value/input"
        clearable
        @input="v => handlerSetLog('nInput', v)"
        @clear="() => handlerSetLog('nInput', void 0)"
      />

      <q-input
        v-model="tModel"
        label="Text - v-model"
        clearable
        @input="v => handlerLog('tModel', v)"
        @clear="() => handlerSetLog('tModel', void 0)"
      />

      <q-input
        type="number"
        v-model="nModel"
        label="Number - v-model"
        clearable
        @input="v => handlerLog('nModel', v)"
        @clear="() => handlerSetLog('nModel', void 0)"
      />
    </div>

    <pre class="bg-grey-2 rounded-borders q-pa-md">{{ log }}</pre>
  </div>
</template>

<script>

export default {
  data () {
    return {
      tInput: void 0,
      nInput: void 0,
      tModel: void 0,
      nModel: void 0,
      log: ''
    }
  },

  methods: {
    handlerSetLog (key, val) {
      this.log += `${performance.now()}\t[${key}] = ${JSON.stringify(val)}\n`

      this[key] = val

      const x = document.activeElement
      x.blur()
      x.focus()
    },

    handlerLog (key, val) {
      this.log += `${performance.now()}\t[${key}] = ${JSON.stringify(val)}\n`

      const x = document.activeElement
      x.blur()
      x.focus()
    }
  }
}
</script>
