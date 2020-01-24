<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-toggle indeterminate-value="maybe" v-model="theModel2" label="Did you eat lunch today?" />
    </div>

    <div class="q-px-sm">
      The model data: <strong>{{ JSON.stringify(theModel2) }}</strong>
    </div>

    <div class="q-gutter-sm">
      <q-toggle toggle-indeterminate v-model="theModel" label="Did you eat lunch today?" />
    </div>

    <div class="q-px-sm row no-wrap items-center">
      <div class="col">
        The model data: <strong>{{ JSON.stringify(theModel) }}</strong>
      </div>
      <q-btn color="primary" label="Reset" @click="reset" class="q-ml-md" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      theModel: null,
      theModel2: 'maybe'
    }
  },

  methods: {
    reset () {
      this.theModel = null
      this.theModel2 = 'maybe'
    }
  }
}
</script>
