<template lang="pug">
.row.q-col-gutter-md
  q-select.col-12.col-lg-4(v-model="model" :options="options" label="Standard")
  q-select.col-12.col-lg-4(filled v-model="model" :options="options" label="Filled")
  q-select.col-12.col-lg-4(outlined v-model="model" :options="options" label="Outlined")
  q-select.col-12.col-lg-4(standout v-model="model" :options="options" label="Standout")
  q-select.col-12.col-lg-4(borderless v-model="model" :options="options" label="Borderless")
  q-select.col-12.col-lg-4(v-model="model" :options="options" label="With error" :error="true" error-message="Error message")
</template>

<script>

export default {
  data () {
    return {
      model: null,
      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ]
    }
  }
}

</script>
