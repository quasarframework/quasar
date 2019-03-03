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

      <q-select color="lime-11" bg-color="green" filled v-model="model" :options="options" label="Label">
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>
      </q-select>

      <q-select color="teal" outlined v-model="model" :options="options" label="Label">
        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar-framework.org/img/quasar-logo.png">
          </q-avatar>
        </template>
      </q-select>

      <q-select color="orange" standout bottom-slots v-model="model" :options="options" label="Label" counter>
        <template v-slot:prepend>
          <q-icon name="place" />
        </template>
        <template v-slot:append>
          <q-icon name="close" @click="model = ''" class="cursor-pointer" />
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
