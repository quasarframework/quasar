<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <q-list>
        <q-item
          v-for="item in allTabs"
          :key="item.tab.name"
          tag="label"
          dense
          v-ripple
        >
          <q-item-section side>
            <q-checkbox
              :model-value="item.selected"
              @update:model-value="
                status => {
                  setTabSelected(item.tab, status)
                }
              "
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ item.tab.label }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon :name="item.tab.icon" />
          </q-item-section>
        </q-item>
      </q-list>

      <q-toolbar class="bg-purple text-white shadow-2 rounded-borders">
        <q-btn flat label="Homepage" />
        <q-space />

        <!--
          notice shrink property since we are placing it
          as child of QToolbar
        -->
        <q-tabs v-model="tab" inline-label shrink stretch>
          <q-tab v-for="tab in tabs" :key="tab.name" v-bind="tab" />
        </q-tabs>
      </q-toolbar>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const tabsDefinition = [
  // #region
  { name: 'mails', icon: 'mail', label: 'Mails' },
  { name: 'alarms', icon: 'alarm', label: 'Alarms' },
  { name: 'movies', icon: 'movie', label: 'Movies' },
  { name: 'photos', icon: 'photo', label: 'Photos' },
  { name: 'videos', icon: 'slow_motion_video', label: 'Videos' },
  { name: 'addressbook', icon: 'people', label: 'Address Book' }
  // #endregion
]

const tab = ref('mails')
const tabs = ref(tabsDefinition.slice(0, 1))

const allTabs = computed(() =>
  tabsDefinition.map(tabItem => ({
    tab: tabItem,
    selected: tabs.value.includes(tabItem)
  }))
)

function setTabSelected(tabItem, status) {
  if (status) {
    tabs.value.push(tabItem)
  } else {
    const index = tabs.value.indexOf(tabItem)

    if (index !== -1) {
      tabs.value.splice(index, 1)
    }
  }
}
</script>
