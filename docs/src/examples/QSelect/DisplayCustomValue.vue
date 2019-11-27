<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-badge color="secondary" multi-line>
        Model: "{{ model }}"
      </q-badge>

      <q-select
        filled
        v-model="model"
        :options="options"
        stack-label
        label="Standard"
        :display-value="`Company: ${model ? model : '*none*'}`"
      >
        <template v-slot:append>
          <q-icon
            v-if="model !== null"
            class="cursor-pointer"
            name="clear"
            @click.stop="model = null"
          />
        </template>
      </q-select>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: 'Twitter',
      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ]
    }
  }
}
</script>
