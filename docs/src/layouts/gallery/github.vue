<template>
  <q-layout style="min-width: 1012px">
    <q-header elevated class="text-white" style="background: #24292e">
      <q-toolbar class="q-py-sm q-px-md">
        <q-btn round dense flat :ripple="false" icon="fab fa-github" size="19px" color="white" class="icon q-mr-sm" no-caps />

        <q-select ref="search" dark dense standout use-input hide-selected
          color="black" :stack-label="false" label="Search or jump to..."
          v-model="text" :options="filteredOptions" @filter="filter"
          style="width: 300px">

          <template v-slot:append>
            <img src="https://github.githubassets.com/images/search-key-slash.svg">
          </template>

          <template v-slot:no-option>
            <q-item>
              <q-item-section>
                <div class="text-center">
                  <q-spinner-pie
                    color="grey-5"
                    size="24px"
                  />
                </div>
              </q-item-section>
            </q-item>
          </template>

          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
              class="search-menu-link"
            >
              <q-item-section side class="search-menu-icon">
                <q-icon name="collections_bookmark" />
              </q-item-section>
              <q-item-section>
                <q-item-label v-html="scope.opt.label" />
              </q-item-section>
              <q-item-section side :class="{ 'default-type': !scope.opt.type }">
                <q-btn outline dense no-caps text-color="blue-grey-5" size="12px" class="bg-grey-1 q-px-sm">
                  {{ scope.opt.type || 'Jump to' }}
                  <q-icon name="subdirectory_arrow_left" size="14px" />
                </q-btn>
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <div class="nav-items q-ml-xs q-gutter-md text-body2 text-weight-bold row items-center no-wrap">
          <a href="javascript:void(0)" class="text-white">
            Pull requests
          </a>
          <a href="javascript:void(0)" class="text-white">
            Issues
          </a>
          <a href="javascript:void(0)" class="text-white">
            Marketplace
          </a>
          <a href="javascript:void(0)" class="text-white">
            Explore
          </a>
        </div>

        <q-space />

        <div class="q-pa-xs q-gutter-sm row items-center no-wrap">
          <q-btn dense round size="sm" icon="notifications" />
          <q-btn dense flat>
            <div class="row items-center no-wrap">
              <q-icon name="add" size="20px" />
              <q-icon name="arrow_drop_down" size="16px" style="margin-left: -2px" />
            </div>
            <q-menu auto-close>
              <q-list dense style="min-width: 100px">
                <q-item clickable class="menu-link">
                  <q-item-section>New repository</q-item-section>
                </q-item>
                <q-item clickable class="menu-link">
                  <q-item-section>Import repository</q-item-section>
                </q-item>
                <q-item clickable class="menu-link">
                  <q-item-section>New gist</q-item-section>
                </q-item>
                <q-item clickable class="menu-link">
                  <q-item-section>New organization</q-item-section>
                </q-item>
                <q-separator />
                <q-item-label header>This repository</q-item-label>
                <q-item clickable class="menu-link">
                  <q-item-section>New issue</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn dense flat>
            <q-avatar rounded size="20px">
              <img src="https://cdn.quasar.dev/img/guy-avatar.png">
            </q-avatar>
            <q-icon name="arrow_drop_down" size="16px" />

            <q-menu auto-close>
              <q-list dense>
                <q-item clickable class="signed-in-menu-link">
                  <q-item-section>
                    <div>Signed in as <strong>Jeff</strong></div>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable class="set-status-menu-link">
                  <q-item-section>
                    <div>
                      <q-icon name="tag_faces" color="blue-9" size="18px" />
                      Set your status
                    </div>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable class="menu-link">
                  <q-item-section>Your profile</q-item-section>
                </q-item>
                <q-item clickable class="menu-link">
                  <q-item-section>Your repositories</q-item-section>
                </q-item>
                <q-item clickable class="menu-link">
                  <q-item-section>Your projects</q-item-section>
                </q-item>
                <q-item clickable class="menu-link">
                  <q-item-section>Your stars</q-item-section>
                </q-item>
                <q-item clickable class="menu-link">
                  <q-item-section>Your gists</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable class="menu-link">
                  <q-item-section>Help</q-item-section>
                </q-item>
                <q-item clickable class="menu-link">
                  <q-item-section>Settings</q-item-section>
                </q-item>
                <q-item clickable class="menu-link">
                  <q-item-section>Sign out</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
const stringOptions = [
  'quasarframework/quasar',
  'quasarframework/quasar-awesome'
]

export default {
  name: 'MyLayout',

  data () {
    return {
      text: '',
      options: null,
      filteredOptions: []
    }
  },

  methods: {
    filter (val, update) {
      if (this.options === null) {
        // load data
        setTimeout(() => {
          this.options = stringOptions
          this.$refs.search.filter('')
        }, 2000)
        update()
        return
      }

      if (val === '') {
        update(() => {
          this.filteredOptions = this.options.map(op => ({ label: op }))
        })
        return
      }

      update(() => {
        this.filteredOptions = [
          {
            label: val,
            type: 'In this repository'
          },
          {
            label: val,
            type: 'All GitHub'
          },
          ...this.options
            .filter(op => op.toLowerCase().includes(val.toLowerCase()))
            .map(op => ({ label: op }))
        ]
      })
    }
  }
}
</script>

<style lang="stylus">
.icon
  background #24292e

.search-menu-link
  .default-type
    visibility hidden

.search-menu-link:hover
  background #0366d6
  color white
  .search-menu-icon
    color white
  .default-type
    visibility visible

.nav-items
  a
    color white
    text-decoration none
    &:hover
      opacity 0.7

.menu-link:hover
  background #0366d6
  color white

.signed-in-menu-link
.set-status-menu-link
  &:hover
    & > div
      background white !important

.set-status-menu-link
  color $blue-grey-6
  &:hover
    color $light-blue-9

.q-field--focused
  width 450px !important
  .q-field__append
    display none
</style>
