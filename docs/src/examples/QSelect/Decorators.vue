<template>
  <div class="q-pa-md">
    <div class="q-pb-lg">
      <q-toggle v-model="dense" label="Dense QSelect" />
      <q-toggle v-model="denseOpts" label="Dense options" />
    </div>

    <div class="q-gutter-md" style="max-width: 300px">
      <q-select filled v-model="model" :options="options" label="Label (stacked)" stack-label :dense="dense" :options-dense="denseOpts" />

      <q-select outlined v-model="model" :options="options" :dense="dense" :options-dense="denseOpts">
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>
      </q-select>

      <q-select standout v-model="model" :options="options" :dense="dense" :options-dense="denseOpts">
        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
          </q-avatar>
        </template>
      </q-select>

      <q-select filled bottom-slots v-model="model" :options="options" label="Label" counter :dense="dense" :options-dense="denseOpts">
        <template v-slot:prepend>
          <q-icon name="place" @click.stop.prevent />
        </template>
        <template v-slot:append>
          <q-icon name="close" @click.stop.prevent="model = ''" class="cursor-pointer" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>
      </q-select>

      <q-select rounded outlined bottom-slots v-model="model" :options="options" label="Label" counter maxlength="12" :dense="dense" :options-dense="denseOpts">
        <template v-slot:before>
          <q-icon name="flight_takeoff" />
        </template>

        <template v-slot:append>
          <q-icon v-if="model !== ''" name="close" @click.stop.prevent="model = ''" class="cursor-pointer" />
          <q-icon name="search" @click.stop.prevent />
        </template>

        <template v-slot:hint>
          Field hint
        </template>
      </q-select>

      <q-select filled bottom-slots v-model="model" :options="options" label="Label" counter maxlength="12" :dense="dense" :options-dense="denseOpts">
        <template v-slot:before>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar5.jpg">
          </q-avatar>
        </template>

        <template v-slot:append>
          <q-icon v-if="model !== ''" name="close" @click.stop.prevent="model = ''" class="cursor-pointer" />
          <q-icon name="schedule" @click.stop.prevent />
        </template>

        <template v-slot:hint>
          Field hint
        </template>

        <template v-slot:after>
          <q-btn round dense flat icon="send" />
        </template>
      </q-select>

      <q-select filled bottom-slots v-model="model" :options="options" label="Label" counter maxlength="12" :dense="dense" :options-dense="denseOpts">
        <template v-slot:before>
          <q-icon name="event" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>

        <template v-slot:append>
          <q-btn round dense flat icon="add" @click.stop.prevent />
        </template>
      </q-select>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref(null),

      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ],

      dense: ref(false),
      denseOpts: ref(false)
    }
  }
}
</script>
