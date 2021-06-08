<template>
  <div class="q-pa-md bg-grey-10 text-white">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <div>
        <q-toggle v-model="readonly" label="Readonly" dark />
        <q-toggle v-model="disable" label="Disable" dark />
      </div>

      <q-input dark v-model="text" :readonly="readonly" :disable="disable">
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>
      </q-input>

      <q-input dark filled v-model="text" :readonly="readonly" :disable="disable">
        <template v-slot:prepend>
          <q-icon name="event" />
          </template>
      </q-input>

      <q-input dark outlined v-model="text" :readonly="readonly" :disable="disable">
        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-dark.svg">
          </q-avatar>
        </template>
      </q-input>

      <q-input dark standout bottom-slots v-model="text" label="Label" counter :readonly="readonly" :disable="disable">
        <template v-slot:prepend>
          <q-icon name="place" />
        </template>
        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>
      </q-input>

      <q-input dark borderless v-model="text" :readonly="readonly" :disable="disable">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '',

      readonly: false,
      disable: false
    }
  }
}
</script>
