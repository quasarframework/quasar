<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-toggle v-model="dense" label="Dense QInput" />

      <q-field v-model="text" :dense="dense" />

      <q-field v-model="text" label="Label (stacked)" stack-label :dense="dense" />

      <q-field v-model="text" label="Label" :dense="dense" />

      <q-field v-model="ph" label="Label" placeholder="Placeholder" hint="With placeholder" :dense="dense" />

      <q-field v-model="ph" placeholder="Placeholder" hint="With placeholder" :dense="dense" />

      <q-field square v-model="text" hint="With perfect square borders" :dense="dense" />

      <q-field v-model="text" :dense="dense">
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>
      </q-field>

      <q-field v-model="text" :dense="dense">
        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar-framework.org/logo/svg/quasar-logo.svg">
          </q-avatar>
        </template>
      </q-field>

      <q-field bottom-slots v-model="text" label="Label" counter :dense="dense">
        <template v-slot:prepend>
          <q-icon name="place" />
        </template>
        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>
      </q-field>

      <q-field bottom-slots v-model="text" label="Label" counter maxlength="12" :dense="dense">
        <template v-slot:before>
          <q-icon name="flight_takeoff" />
        </template>

        <template v-slot:append>
          <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="search" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>
      </q-field>

      <q-field bottom-slots v-model="text" label="Label" counter maxlength="12" :dense="dense">
        <template v-slot:before>
          <q-avatar>
            <img src="https://cdn.quasar-framework.org/img/avatar5.jpg">
          </q-avatar>
        </template>

        <template v-slot:append>
          <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="schedule" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>

        <template v-slot:after>
          <q-btn round dense flat icon="send" />
        </template>
      </q-field>

      <q-field bottom-slots v-model="text" label="Label" counter maxlength="12" :dense="dense">
        <template v-slot:before>
          <q-icon name="event" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>

        <template v-slot:append>
          <q-btn round dense flat icon="add" />
        </template>
      </q-field>

      <q-field v-model="text" hint="Disable" :dense="dense" disable />

      <q-field v-model="text" hint="Readonly" :dense="dense" readonly />

      <q-field v-model="text" hint="Disable and readonly" :dense="dense" disable readonly />
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
