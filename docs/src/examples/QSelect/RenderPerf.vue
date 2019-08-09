<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-select
        filled
        v-model="model"
        multiple
        :options="options"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    const options = []
    for (let i = 0; i <= 100000; i++) {
      options.push('Opt ' + i)
    }

    return {
      model: null,

      options: Object.freeze(options)
    }
  }
}
</script>
