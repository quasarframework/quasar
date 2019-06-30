<template>
  <q-layout view="hHh LpR fFf" class="bg-grey-3">
    <q-header class="bg-grey-3 text-grey-9" reveal>
      <q-toolbar style="max-height: 60px;" class="text-grey-6">
        <q-btn
          v-if="this.$q.platform.is.mobile || !leftDrawerOpen"
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        />

        <div class="q-px-lg">
          <img src="https://cdn.quasar.dev/img/layout-gallery/logo-google-play.png" style="width:183px;height:39px">
        </div>

        <div class="row no-wrap" style="min-width: 100px; width: 35%">
          <q-input dense outlined square v-model="search" placeholder="Search" class="bg-white col" />
          <q-btn color="primary" icon="search" unelevated style="border-radius: 0; max-width: 60px; width: 100%;"/>
        </div>

        <q-space />

        <div class="q-pa-md q-gutter-sm row no-wrap items-center">
          <q-btn round dense flat color="grey-8" size="14px" icon="apps">
            <q-tooltip>Google Apps</q-tooltip>
          </q-btn>

          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              2
            </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>

          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-3 text-grey-7"
      :width="200"
    >
      <q-list>

        <q-item clickable class="bg-grey-10 text-grey-3">
          <q-item-section avatar class="apps-icon adjust-icon text-grey-1">
            <q-icon name="weekend" />
          </q-item-section>
          <q-item-section class="text-grey-3 adjust-text">
            <q-item-label>Entertainment</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable class="apps">
          <q-item-section avatar class="apps-icon bg-green-7 text-grey-1 text-center adjust-icon">
            <q-icon name="android" />
          </q-item-section>
          <q-item-section class="apps-text adjust-text">
            <q-item-label>Apps</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable class="movies">
          <q-item-section avatar class="movies-icon bg-red-7 text-grey-1 text-center adjust-icon">
            <q-icon name="local_movies" />
          </q-item-section>
          <q-item-section class="movies-text adjust-text">
            <q-item-label>Movies & TV</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable class="music">
          <q-item-section avatar class="music-icon bg-orange-7 text-grey-1 text-center adjust-icon">
            <q-avatar size="22px" color="white" text-color="orange-7" icon="music_note" />
          </q-item-section>
          <q-item-section class="music-text adjust-text">
            <q-item-label>Music</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable class="books">
          <q-item-section avatar class="books-icon bg-blue-7 text-grey-1 text-center adjust-icon">
            <q-icon name="book" />
          </q-item-section>
          <q-item-section class="books-text adjust-text">
            <q-item-label>Books</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable class="devices">
          <q-item-section avatar class="devices-icon bg-blue-grey-7 text-grey-1 text-center adjust-icon">
            <q-icon name="devices" />
          </q-item-section>
          <q-item-section class="devices-text adjust-text">
            <q-item-label>Devices</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-mb-md" />

        <q-item v-for="link in links1" :key="link.text" dense clickable style="padding: 6px 12px 6px 23px">
          <q-item-section class="text-grey-8">
            <q-item-label>{{ link.text }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />

      <q-page-sticky expand position="top">
        <q-toolbar class="bg-white q-px-xl" style="min-height: 49px; border-bottom: 1px solid rgba(0,0,0,0.12)">
          <q-space />

          <q-btn icon="help" dense flat size="12px" style="border: 1px solid #ccc; padding-left: 8px; padding-right: 8px;" />
          <q-btn icon="settings" dense flat class="q-ml-md" size="12px" style="padding-left: 17px; padding-right: 17px; border: 1px solid #ccc" />
        </q-toolbar>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MyLayout',

  data () {
    return {
      leftDrawerOpen: true,
      search: '',
      storage: 0.26,
      links1: [
        { text: 'Account' },
        { text: 'Payment methods' },
        { text: 'My subscriptions' },
        { text: 'Redeem' },
        { text: 'Buy gift card' },
        { text: 'My wishlist' },
        { text: 'My Play activity' },
        { text: 'Parent guide' }
      ]
    }
  }
}
</script>

<style>
.adjust-icon {
  margin: -8px 0 -8px -16px;
  padding: 8px 0 8px 16px;
}
.adjust-text {
  margin: -8px -16px -8px 0;
  padding: 8px 16px 8px 2px;
  font-size: 18px;
  font-weight: 300;
}

.adjust-text > .q-item__label {
  padding-left: 14px;
}

.apps, .movies, .music, .books, .devices {
  background: #f5f5f5!important;
}
.apps:hover, .movies:hover, .music:hover, .books:hover, .devices:hover {
  color: #eee !important;
}
.apps:hover {
  background: #43a047!important;
}
.movies:hover {
  background: #e53935!important;
}
.music:hover {
  background: #fb8c00!important;
}
.books:hover {
  background: #1e88e5!important;
}
.devices:hover {
  background: #546e7a!important;
}
</style>
