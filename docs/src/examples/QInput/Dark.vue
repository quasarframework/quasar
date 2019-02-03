<template>
  <div class="q-pa-md bg-grey-10 text-white">
    <div class="q-gutter-md column" style="max-width: 300px">
      <div>
        <q-toggle v-model="readonly" label="Readonly" dark />
        <q-toggle v-model="disable" label="Disable" dark />
      </div>

      <q-input dark v-model="text" :readonly="readonly" :disable="disable">
        <q-icon slot="prepend" name="event" />
      </q-input>

      <q-input dark filled v-model="text" :readonly="readonly" :disable="disable">
        <q-icon slot="prepend" name="event" />
      </q-input>

      <q-input dark outlined v-model="text" :readonly="readonly" :disable="disable">
        <q-avatar slot="append">
          <img src="https://cdn.quasar-framework.org/img/quasar-logo.png">
        </q-avatar>
      </q-input>

      <q-input dark standout bottom-slots v-model="text" label="Label" counter :readonly="readonly" :disable="disable">
        <q-icon slot="prepend" name="place" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />

        <div slot="hint">Field hint</div>
      </q-input>

      <q-input dark borderless v-model="text" :readonly="readonly" :disable="disable">
        <q-icon slot="append" name="search" />
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
