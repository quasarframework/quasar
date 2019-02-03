<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-input v-model="password" filled type="password" hint="Password" />

      <q-input v-model="password" filled :type="isPwd ? 'password' : 'text'" hint="Password with toggle">
        <q-icon
          slot="append"
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </q-input>

      <q-input v-model="number" filled type="number" hint="Number" />

      <q-input v-model="email" filled type="email" hint="Email" />

      <q-input v-model="search" filled type="search" hint="Search">
        <q-icon slot="append" name="search" />
      </q-input>

      <q-input v-model="tel" filled type="tel" hint="Telephone number" />

      <q-input v-model="url" filled type="url" hint="URL" />

      <q-input v-model="time" filled type="time" hint="Native time" />

      <q-input v-model="date" filled type="date" hint="Native date" />

      <q-input v-model="file" filled type="file" hint="Native file" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      password: '',
      isPwd: true,

      number: null,

      email: '',
      search: '',
      tel: '',
      url: '',
      time: '',
      date: '',

      file: null
    }
  }
}
</script>
