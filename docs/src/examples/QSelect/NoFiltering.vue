<template>
  <div class="q-pa-md">
    <q-select
      filled
      v-model="model"
      use-input
      use-chips
      multiple
      input-debounce="0"
      @new-value="createValue"
      style="width: 250px"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: null
    }
  },

  methods: {
    createValue (val, done) {
      if (val.length > 0) {
        done(val)
      }
    }
  }
}
</script>
