<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <div class="col-12">
        <q-badge color="secondary" multi-line>
          Model: "{{ model }}"
        </q-badge>
      </div>

      <q-select
        filled
        v-model="model"
        :options="options"
        option-value="id"
        option-label="desc"
        option-disable="inactive"
        emit-value
        map-options
        style="min-width: 250px; max-width: 300px"
      />

      <q-select
        filled
        v-model="model"
        :options="options"
        :option-value="opt => opt === null ? null : opt.id"
        :option-label="opt => opt === null ? '- Null -' : opt.desc"
        :option-disable="opt => opt === null ? true : opt.inactive"
        emit-value
        map-options
        style="min-width: 250px; max-width: 300px"
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
