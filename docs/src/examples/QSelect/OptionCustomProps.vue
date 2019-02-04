<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-badge color="secondary">Model: "{{ model }}"</q-badge>
      <q-select
        filled
        v-model="model"
        :options="options"
        option-value="id"
        option-label="desc"
        option-disable="inactive"
        emit-value
        map-options
      />

      <q-select
        filled
        v-model="model"
        :options="options"
        :option-value="opt => opt.id"
        :option-label="opt => opt.desc"
        :option-disable="opt => opt.inactive"
        emit-value
        map-options
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: null,
      options: [
        {
          id: 'goog',
          desc: 'Google'
        },
        {
          id: 'fb',
          desc: 'Facebook'
        },
        {
          id: 'twt',
          desc: 'Twitter'
        },
        {
          id: 'app',
          desc: 'Apple'
        },
        {
          id: 'ora',
          desc: 'Oracle',
          inactive: true
        }
      ]
    }
  }
}
</script>
