<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-select
        filled
        v-model="model"
        :options="options"
        label="No options"
      >
        <q-item slot="no-option">
          <q-item-section>
            No options slot
          </q-item-section>
        </q-item>
      </q-select>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: null,
      options: []
    }
  }
}
</script>
