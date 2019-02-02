<template>
  <div class="q-pa-md">
    <div class="q-gutter-md column" style="max-width: 300px">
      <q-input rounded filled v-model="text">
        <q-icon slot="prepend" name="event" />
      </q-input>

      <q-input rounded outlined v-model="text">
        <q-avatar slot="append">
          <img src="https://cdn.quasar-framework.org/img/quasar-logo.png">
        </q-avatar>
      </q-input>

      <q-input rounded standout bottom-slots v-model="text" label="Label" counter>
        <q-icon slot="prepend" name="place" />
        <q-icon slot="append" name="close" @click="text = ''" class="cursor-pointer" />

        <div slot="hint">Field hint</div>
      </q-input>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: ''
    }
  }
}
</script>
