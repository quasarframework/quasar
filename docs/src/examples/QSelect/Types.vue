<template>
  <div class="q-pa-md q-gutter-sm">
    <q-select
        :options="selectOptions"
        filled
        label="Filled"
        v-model="select"
    />

    <q-select
        :options="selectOptions"
        label="Outlined"
        outlined
        v-model="select"
    />

    <q-select
        :options="selectOptions"
        label="Standout"
        standout
        v-model="select"
    />

    <q-select
        :options="selectOptions"
        label="Standard"
        standard
        v-model="select"
    />

    <q-select
        :options="selectOptions"
        borderless
        label="Borderless"
        v-model="select"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectOptions: [
        {
          label: 'Google',
          value: 'goog'
        },
        {
          label: 'Facebook',
          value: 'fb'
        }
      ],
      select: null
    }
  }
}
</script>
