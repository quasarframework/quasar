<template>
  <div class="q-pa-md">
    <div class="q-gutter-md column" style="max-width: 300px">
      <q-toggle v-model="dense" label="Dense QInput" :dense="dense" />

      <q-input standout v-model="text" :dense="dense" />

      <q-input standout v-model="text" label="Label (stacked)" stack-label :dense="dense" />

      <q-input standout v-model="text" label="Label" :dense="dense" />

      <q-input standout v-model="ph" label="Label" placeholder="Placeholder" hint="With placeholder" :dense="dense" />

      <q-input standout v-model="ph" placeholder="Placeholder" hint="With placeholder" :dense="dense" />

      <q-input standout v-model="text" :dense="dense">
        <q-icon slot="prepend" name="event" />
      </q-input>

      <q-input standout v-model="text" :dense="dense">
        <q-avatar slot="append">
          <img src="https://cdn.quasar-framework.org/img/quasar-logo.png">
        </q-avatar>
      </q-input>

      <q-input standout bottom-slots v-model="text" label="Label" counter :dense="dense">
        <q-icon slot="prepend" name="place" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />

        <div slot="hint">Field hint</div>
      </q-input>

      <q-input standout bottom-slots v-model="text" label="Label" counter maxlength="12" :dense="dense">
        <q-icon slot="before" name="flight_takeoff" />

        <q-icon v-if="text !== ''" slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="search" />

        <div slot="hint">Field hint</div>
      </q-input>

      <q-input standout bottom-slots v-model="text" label="Label" counter maxlength="12" :dense="dense">
        <q-avatar slot="before">
          <img src="https://cdn.quasar-framework.org/img/avatar5.jpg">
        </q-avatar>

        <q-icon v-if="text !== ''" slot="append" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon slot="append" name="schedule" />

        <div slot="hint">Field hint</div>

        <q-btn slot="after" round dense flat icon="send" />
      </q-input>

      <q-input standout bottom-slots v-model="text" label="Label" counter maxlength="12" :dense="dense">
        <q-icon slot="before" name="event" />

        <div slot="hint">Field hint</div>

        <q-btn slot="append" round dense flat icon="add" />
      </q-input>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '',
      ph: '',

      dense: false
    }
  }
}
</script>
