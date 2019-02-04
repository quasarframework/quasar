<template>
  <div class="q-pa-md">
    <div class="q-pb-lg">
      <q-toggle v-model="dense" label="Dense QSelect" />
      <q-toggle v-model="denseOpts" label="Dense options" />
    </div>

    <div class="q-gutter-md" style="max-width: 300px">
      <q-select filled v-model="model" :options="options" label="Label (stacked)" stack-label :dense="dense" :options-dense="denseOpts" />

      <q-select outlined v-model="model" :options="options" :dense="dense" :options-dense="denseOpts">
        <q-icon slot="prepend" name="event" />
      </q-select>

      <q-select standout v-model="model" :options="options" :dense="dense" :options-dense="denseOpts">
        <q-avatar slot="append">
          <img src="https://cdn.quasar-framework.org/img/quasar-logo.png">
        </q-avatar>
      </q-select>

      <q-select filled bottom-slots v-model="model" :options="options" label="Label" counter :dense="dense" :options-dense="denseOpts">
        <q-icon slot="prepend" name="place" @click.stop />
        <q-icon slot="append" name="close" @click.stop="model = ''" class="cursor-pointer" />

        <div slot="hint">Field hint</div>
      </q-select>

      <q-select rounded outlined bottom-slots v-model="model" :options="options" label="Label" counter maxlength="12" :dense="dense" :options-dense="denseOpts">
        <q-icon slot="before" name="flight_takeoff" />

        <q-icon v-if="model !== ''" slot="append" name="close" @click.stop="model = ''" class="cursor-pointer" />
        <q-icon slot="append" name="search" @click.stop />

        <div slot="hint">Field hint</div>
      </q-select>

      <q-select filled bottom-slots v-model="model" :options="options" label="Label" counter maxlength="12" :dense="dense" :options-dense="denseOpts">
        <q-avatar slot="before">
          <img src="https://cdn.quasar-framework.org/img/avatar5.jpg">
        </q-avatar>

        <q-icon v-if="model !== ''" slot="append" name="close" @click.stop="model = ''" class="cursor-pointer" />
        <q-icon slot="append" name="schedule" @click.stop />

        <div slot="hint">Field hint</div>

        <q-btn slot="after" round dense flat icon="send" />
      </q-select>

      <q-select filled bottom-slots v-model="model" :options="options" label="Label" counter maxlength="12" :dense="dense" :options-dense="denseOpts">
        <q-icon slot="before" name="event" />

        <div slot="hint">Field hint</div>

        <q-btn slot="append" round dense flat icon="add" @click.stop />
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
      ],

      dense: false,
      denseOpts: false
    }
  }
}
</script>
