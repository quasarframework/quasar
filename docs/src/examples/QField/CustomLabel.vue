<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-field filled :value="email" suffix="@gmail.com" label-slot>
        <template v-slot:label>
          <div class="row items-center all-pointer-events">
            <q-icon class="q-mr-xs" color="deep-orange" size="24px" name="mail" />
            Email (hover for more info)

            <q-tooltip content-class="bg-grey-8" anchor="top left" self="bottom left" :offset="[0, 8]">Email address</q-tooltip>
          </div>
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline text-right" tabindex="0">{{email}}</div>
        </template>
      </q-field>

      <q-field outlined :value="number" prefix="$" label-slot>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{number}}</div>
        </template>

        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
          </q-avatar>
        </template>

        <template v-slot:label>
          <strong class="text-deep-orange">You</strong>
          can customize the <em class="q-px-sm bg-deep-orange text-white rounded-borders">label</em>
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
