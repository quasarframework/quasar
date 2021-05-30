<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-select color="purple-12" v-model="model" :options="options" label="Label">
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>
      </q-select>

      <q-select color="teal" filled v-model="model" :options="options" label="Label">
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>
      </q-select>

      <q-select color="grey-3" outlined label-color="orange" v-model="model" :options="options" label="Label">
        <template v-slot:append>
          <q-icon name="event" color="orange" />
        </template>
      </q-select>

      <q-select color="lime-11" bg-color="green" filled v-model="model" :options="options" label="Label">
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>
      </q-select>

      <q-select color="teal" outlined v-model="model" :options="options" label="Label">
        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
          </q-avatar>
        </template>
      </q-select>

      <q-select clearable color="orange" standout bottom-slots v-model="model" :options="options" label="Label" counter>
        <template v-slot:prepend>
          <q-icon name="place" />
        </template>
        <template v-slot:append>
          <q-icon name="favorite" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>
      </q-select>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: null,

      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ]
    }
  }
}
</script>
