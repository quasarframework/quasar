<template>
  <div class="q-pa-md">
    <q-btn-toggle
      v-model="model"
      push
      glossy
      toggle-color="primary"
      :options="[
        {label: 'Cake', value: 'cake'},
        {label: 'Ice cream', value: 'ice-cream'}
      ]"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: 'cake'
    }
  }
}
</script>
