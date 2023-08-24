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
        :option-value="opt => Object(opt) === opt && 'id' in opt ? opt.id : null"
        :option-label="opt => Object(opt) === opt && 'desc' in opt ? opt.desc : '- Null -'"
        :option-disable="opt => Object(opt) === opt ? opt.inactive === true : true"
        emit-value
        map-options
        style="min-width: 250px; max-width: 300px"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref(null),

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
