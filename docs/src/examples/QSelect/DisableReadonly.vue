<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-select
        disable
        filled
        v-model="model"
        :options="options"
        hint="Disable"
        style="width: 250px"
      />

      <q-select
        readonly
        filled
        v-model="model"
        :options="options"
        hint="Readonly"
        style="width: 250px"
      />

      <q-select
        disable
        readonly
        filled
        v-model="model"
        :options="options"
        hint="Disable and readonly"
        style="width: 250px"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: 'Google',

      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ]
    }
  }
}
</script>
