<template>
  <div class="q-pa-md bg-grey-10 text-white">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <div>
        <q-toggle v-model="readonly" label="Readonly" dark />
        <q-toggle v-model="disable" label="Disable" dark />
      </div>

      <q-field dark :readonly="readonly" :disable="disable">
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" :tabindex="tabindex">{{text}}</div>
        </template>
      </q-field>

      <q-field dark filled :readonly="readonly" :disable="disable">
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" :tabindex="tabindex">{{text}}</div>
        </template>
      </q-field>

      <q-field dark outlined :readonly="readonly" :disable="disable">
        <template v-slot:control>
          <div class="self-center full-width no-outline" :tabindex="tabindex">{{text}}</div>
        </template>

        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-dark.svg">
          </q-avatar>
        </template>
      </q-field>

      <q-field dark standout bottom-slots :value="text" label="Label" stack-label counter :readonly="readonly" :disable="disable">
        <template v-slot:prepend>
          <q-icon name="place" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" :tabindex="tabindex">{{text}}</div>
        </template>

        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>
      </q-field>

      <q-field dark borderless :readonly="readonly" :disable="disable">
        <template v-slot:control>
          <div class="self-center full-width no-outline" :tabindex="tabindex">{{text}}</div>
        </template>

        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-field>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: 'Field content',

      readonly: false,
      disable: false
    }
  },

  computed: {
    tabindex () {
      return this.disable === true || this.readonly === true ? -1 : 0
    }
  }
}
</script>
