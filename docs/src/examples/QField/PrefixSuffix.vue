<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-field filled :value="email" suffix="@gmail.com">
        <template v-slot:before>
          <q-icon name="mail" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline text-right" tabindex="0">{{email}}</div>
        </template>
      </q-field>

      <q-field outlined :value="number" prefix="$">
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{number}}</div>
        </template>

        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
          </q-avatar>
        </template>
      </q-field>

      <q-field standout :value="email" prefix="Email:" suffix="@gmail.com">
        <template v-slot:prepend>
          <q-icon name="mail" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline text-right" tabindex="0">{{email}}</div>
        </template>
      </q-field>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      email: 'john.doe',
      number: 123
    }
  }
}
</script>
