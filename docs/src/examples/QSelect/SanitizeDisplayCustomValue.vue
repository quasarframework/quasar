<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <div>Model: {{ model || 'empty' }}</div>

      <q-toggle v-model="displayValueSanitize" label="Sanitize display value" />

      <q-select
        filled
        v-model="model"
        :options="options"
        stack-label
        label="Standard"
        :display-value="`Company: ${model ? model.label : '*none*'}`"
        :display-value-sanitize="displayValueSanitize"
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
const options = [
  {
    label: '<span class="text-primary">G</span>oogle',
    value: 'Google'
  },
  {
    label: '<span class="text-red">Face</span>book',
    value: 'Facebook'
  }
]

export default {
  data () {
    return {
      model: options[0],
      displayValueSanitize: false,
      options
    }
  }
}
</script>
