<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-input filled v-model="email" type="email" suffix="@gmail.com">
        <template v-slot:before>
          <q-icon name="mail" />
        </template>
      </q-input>

      <q-input outlined v-model="number" type="number" prefix="$">
        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
          </q-avatar>
        </template>
      </q-input>

      <q-input standout v-model="email" type="email" prefix="Email:" suffix="@gmail.com">
        <template v-slot:prepend>
          <q-icon name="mail" />
        </template>
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
