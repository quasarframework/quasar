<template>
  <div class="q-pa-md row justify-center">
    <div style="width: 320px; max-width: 90vw;">

      <q-toolbar class="bg-primary text-white shadow-2">
        <q-toolbar-title >
          Contacts
        </q-toolbar-title>
      </q-toolbar>

      <q-list bordered dark>

        <q-item v-for="contact in contacts" :key="contact.id" class="q-my-sm" clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">{{ initial(contact.firstName) }}</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ full_name(contact.firstName, contact.lastName) }}</q-item-label>
            <q-item-label caption>{{ contact.email }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

    </div>
  </div>
</template>

<script>
const data = [{
  id: 1,
  firstName: 'Ruddy',
  lastName: 'Jedrzej',
  email: 'rjedrzej0@discuz.net'
}, {
  id: 2,
  firstName: 'Mallorie',
  lastName: 'Alessandrini',
  email: 'malessandrini1@marketwatch.com'
}, {
  id: 3,
  firstName: 'Elisabetta',
  lastName: 'Wicklen',
  email: 'ewicklen2@microsoft.com'
}, {
  id: 4,
  firstName: 'Seka',
  lastName: 'Fawdrey',
  email: 'sfawdrey3@wired.com'
}, {
  id: 5,
  firstName: 'Brunhilde',
  lastName: 'Panswick',
  email: 'bpanswick4@csmonitor.com'
}, {
  id: 6,
  firstName: 'Winfield',
  lastName: 'Stapforth',
  email: 'wstapforth5@pcworld.com'
}]

export default {
  data () {
    return {
      dark: true,
      contacts: data
    }
  },
  methods: {
    full_name (firstName, lastName) {
      return firstName + ' ' + lastName
    },
    initial (firstName) {
      return firstName.substring(0, 1)
    }
  }
}
</script>
