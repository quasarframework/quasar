<template>
  <div class="q-pa-md q-gutter-sm">
    <q-select
        :options="selectOptions"
        filled
        label="Readonly"
        readonly
        v-model="select"
    />
    <q-select
        :options="selectOptions"
        disable
        filled
        label="Disable"
        v-model="select"
    />
    <q-select
        :options="selectOptions"
        dense
        filled
        label="Dense with dense options"
        options-dense
        v-model="select"
    />
    <q-select
        :options="selectOptions"
        expand-besides
        filled
        label="Expand besides"
        v-model="select"
    />
    <q-select
        :options="selectOptions"
        dark
        filled
        label="Dark with dark options"
        options-dark
        v-model="select"
    />
    <q-select
        :options="selectOptions"
        filled
        label="Different transitions"
        expand-besides
        transition-show="rotate"
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
