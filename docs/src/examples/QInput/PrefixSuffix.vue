<template>
  <div class="q-pa-md">
    <div class="q-gutter-md column" style="max-width: 300px">
      <q-input filled v-model="email" type="email" suffix="@gmail.com">
        <q-icon slot="before" name="mail" />
      </q-input>

      <q-input outlined v-model="number" type="number" prefix="$">
        <q-avatar slot="append">
          <img src="https://cdn.quasar-framework.org/img/quasar-logo.png">
        </q-avatar>
      </q-input>

      <q-input standout v-model="email" type="email" prefix="Email:" suffix="@gmail.com">
        <q-icon slot="prepend" name="mail" />
      </q-input>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      number: null,
      text: ''
    }
  }
}
</script>
