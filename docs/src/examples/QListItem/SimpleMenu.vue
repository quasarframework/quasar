<template>
  <div class="q-pa-md row justify-center">
    <div style="width: 460px; max-width: 90vw;">
      <q-layout view="hHh LpR fFf" container style="height: 500px; width: 100%" class="shadow-2">

        <q-header class="bg-black shadow-2">
          <q-toolbar>
            <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
            <q-toolbar-title>Email</q-toolbar-title>
            <q-btn flat round dense icon="more_vert" />
          </q-toolbar>
        </q-header>

        <q-drawer v-model="drawer" bordered :width="200" :breakpoint="300">

          <q-list v-for="menuItem in menuList" :key="menuItem.id">

            <q-item
              :to="routePath(menuItem.to)"
              :clickable="menuItem.disabled"
              :active-class="menuItem.activeClass"
             >
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>{{ menuItem.description }}</q-item-section>
            </q-item>

           <q-separator v-if="menuItem.separator" />

          </q-list>
        </q-drawer>

      </q-layout>
    </div>
  </div>
</template>

<script>
const data = [{
  id: 1,
  icon: 'inbox',
  to: 'active',
  description: 'Inbox',
  activeClass: 'my-link',
  separator: true
},
{
  id: 2,
  icon: 'send',
  to: '/',
  description: 'Outbox',
  activeClass: '',
  separator: false
},
{
  id: 3,
  icon: 'delete',
  to: '/',
  description: 'Trash',
  activeClass: '',
  separator: false
},
{
  id: 4,
  icon: 'error',
  description: 'Spam',
  activeClass: '',
  separator: true
},
{
  id: 5,
  icon: 'settings',
  to: '/',
  description: 'Settings',
  activeClass: '',
  separator: false
},
{
  id: 6,
  icon: 'feedback',
  to: '/',
  description: 'Send Feedback',
  activeClass: '',
  separator: false
},
{
  id: 7,
  icon: 'help',
  to: '/',
  description: 'Help',
  activeClass: '',
  separator: false
}]

export default {
  data () {
    return {
      drawer: true,
      menuList: data
    }
  },
  methods: {
    routePath (route) {
      return route === 'active' ? this.$route.path : route
    }
  }
}
</script>

<style lang="stylus">
@import '~quasar-variables'

.my-link
  color white
  background $warning
</style>
