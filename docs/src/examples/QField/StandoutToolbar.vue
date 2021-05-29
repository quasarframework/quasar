<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="width: 300px; max-width: 100%">
      <q-toolbar class="bg-primary text-white rounded-borders">
        <q-btn round dense flat icon="menu" class="q-mr-xs" />
        <q-avatar class="gt-xs">
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
        </q-avatar>

        <q-space />
        <q-field dark dense standout>
          <template v-slot:control>
            <div class="self-center no-outline" tabindex="0">Time is {{value}}</div>
          </template>
          <template v-slot:append>
            <q-btn color="white" flat round dense :disable="value < 10" icon="replay_10" @click.stop="value -= 10" />
            <q-btn color="white" flat round dense :disable="value > 90" icon="forward_10" @click.stop="value += 10" />
          </template>
        </q-field>
      </q-toolbar>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: 50
    }
  }
}
</script>
