<template>
  <q-layout class="bg-grey-1">
    <q-header elevated class="text-white" style="background: #24292e" height-hint="61.59">
      <q-toolbar class="q-py-sm q-px-md">
        <q-btn round dense flat :ripple="false" :icon="fabGithub" size="19px" color="white" class="q-mr-sm" no-caps />

        <q-select
          ref="search" dark dense standout use-input hide-selected
          class="GL__toolbar-select"
          color="black" :stack-label="false" label="Search or jump to..."
          v-model="text" :options="filteredOptions" @filter="filter"
          style="width: 300px"
        >

          <template v-slot:append>
            <img src="https://cdn.quasar.dev/img/layout-gallery/img-github-search-key-slash.svg">
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
              class="GL__select-GL__menu-link"
            >
              <q-item-section side>
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

        <div v-if="$q.screen.gt.sm" class="GL__toolbar-link q-ml-xs q-gutter-md text-body2 text-weight-bold row items-center no-wrap">
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

        <div class="q-pl-sm q-gutter-sm row items-center no-wrap">
          <q-btn v-if="$q.screen.gt.xs" dense flat round size="sm" icon="notifications" />
          <q-btn v-if="$q.screen.gt.xs" dense flat>
            <div class="row items-center no-wrap">
              <q-icon name="add" size="20px" />
              <q-icon name="arrow_drop_down" size="16px" style="margin-left: -2px" />
            </div>
            <q-menu auto-close>
              <q-list dense style="min-width: 100px">
                <q-item clickable class="GL__menu-link">
                  <q-item-section>New repository</q-item-section>
                </q-item>
                <q-item clickable class="GL__menu-link">
                  <q-item-section>Import repository</q-item-section>
                </q-item>
                <q-item clickable class="GL__menu-link">
                  <q-item-section>New gist</q-item-section>
                </q-item>
                <q-item clickable class="GL__menu-link">
                  <q-item-section>New organization</q-item-section>
                </q-item>
                <q-separator />
                <q-item-label header>This repository</q-item-label>
                <q-item clickable class="GL__menu-link">
                  <q-item-section>New issue</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn dense flat no-wrap>
            <q-avatar rounded size="20px">
              <img src="https://cdn.quasar.dev/img/avatar3.jpg">
            </q-avatar>
            <q-icon name="arrow_drop_down" size="16px" />

            <q-menu auto-close>
              <q-list dense>
                <q-item class="GL__menu-link-signed-in">
                  <q-item-section>
                    <div>Signed in as <strong>Mary</strong></div>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable class="GL__menu-link-status">
                  <q-item-section>
                    <div>
                      <q-icon name="tag_faces" color="blue-9" size="18px" />
                      Set your status
                    </div>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable class="GL__menu-link">
                  <q-item-section>Your profile</q-item-section>
                </q-item>
                <q-item clickable class="GL__menu-link">
                  <q-item-section>Your repositories</q-item-section>
                </q-item>
                <q-item clickable class="GL__menu-link">
                  <q-item-section>Your projects</q-item-section>
                </q-item>
                <q-item clickable class="GL__menu-link">
                  <q-item-section>Your stars</q-item-section>
                </q-item>
                <q-item clickable class="GL__menu-link">
                  <q-item-section>Your gists</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable class="GL__menu-link">
                  <q-item-section>Help</q-item-section>
                </q-item>
                <q-item clickable class="GL__menu-link">
                  <q-item-section>Settings</q-item-section>
                </q-item>
                <q-item clickable class="GL__menu-link">
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
import { fabGithub } from '@quasar/extras/fontawesome-v5'

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
  },

  created () {
    this.fabGithub = fabGithub
  }
}
</script>

<style lang="sass">
.GL
  &__select-GL__menu-link
    .default-type
      visibility: hidden

    &:hover
      background: #0366d6
      color: white
      .q-item__section--side
        color: white
      .default-type
        visibility: visible

  &__toolbar-link
    a
      color: white
      text-decoration: none
      &:hover
        opacity: 0.7

  &__menu-link:hover
    background: #0366d6
    color: white

  &__menu-link-signed-in,
  &__menu-link-status
    &:hover
      & > div
        background: white !important

  &__menu-link-status
    color: $blue-grey-6
    &:hover
      color: $light-blue-9

  &__toolbar-select.q-field--focused
    width: 450px !important
    .q-field__append
      display: none
</style>
