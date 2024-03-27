<template>
  <q-card class="q-ma-md" :style="{ maxWidth: width + 'px' }">
    <q-list>
      <q-item tag="label" dark class="bg-black" dense v-ripple no-refocus>
        <q-item-section>
          <q-item-label>Width</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-input dark dense borderless input-class="text-right" v-model.number="width" type="number" :min="300" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item dark class="bg-purple" dense v-ripple clickable @click="outsideArrows = outsideArrows === false">
        <q-item-section>
          <q-item-label>{{ outsideArrows === true ? 'Arrows outside (change to inside)' : 'Arrows inside (change to outside)'}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item dark class="bg-purple" dense v-ripple clickable @click="mobileArrows = mobileArrows === false">
        <q-item-section>
          <q-item-label>{{ mobileArrows === true ? 'Arrows visible on mobile (change to invisible)' : 'Arrows invisible on mobile (change to visible)'}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item dark class="bg-primary" dense v-ripple clickable @click="toggleAll">
        <q-item-section>
          <q-item-label>Toggle all</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-for="item in allTabs" :key="item.tab.name" tag="label" dense v-ripple>
        <q-item-section side>
          <q-checkbox :model-value="item.selected" @update:model-value="status => { setTabSelected(item.tab, status) }" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ item.tab.label }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon :name="item.tab.icon" />
        </q-item-section>
      </q-item>
    </q-list>

    <q-card-actions class="bg-black">
      <q-toolbar class="bg-purple text-white">
        <q-btn flat label="Homepage" />
        <q-space />

        <!--
          notice shrink property since we are placing it
          as child of QToolbar
        -->
        <q-tabs
          v-model="tab"
          inline-label
          shrink
          stretch
          :outside-arrows="outsideArrows"
          :mobile-arrows="mobileArrows"
        >
          <q-tab v-for="t in tabs" :key="t.name" v-bind="t" />
        </q-tabs>
      </q-toolbar>
    </q-card-actions>

    <q-card-actions class="bg-black">
      <q-tabs
        class="bg-primary text-white full-width"
        v-model="tab"
        inline-label
        shrink
        stretch
        :outside-arrows="outsideArrows"
        :mobile-arrows="mobileArrows"
      >
        <q-tab v-for="t in tabs" :key="t.name" v-bind="t" />
      </q-tabs>
    </q-card-actions>
  </q-card>
</template>

<script>
const allTabs = [
  { name: 'mails', icon: 'mail', label: 'Mails' },
  { name: 'alarms', icon: 'alarm', label: 'Alarms' },
  { name: 'movies', icon: 'movie', label: 'Movies' },
  { name: 'photos', icon: 'photo', label: 'Photos' },
  { name: 'videos', icon: 'slow_motion_video', label: 'Videos' },
  { name: 'addressbook', icon: 'people', label: 'Address Book' }
]

export default {
  data () {
    return {
      tab: 'mails',
      width: 300,
      mobileArrows: false,
      outsideArrows: false,
      tabs: allTabs.slice(0, 1)
    }
  },

  computed: {
    allTabs () {
      return allTabs.map(tab => ({
        tab,
        selected: this.tabs.indexOf(tab) > -1
      }))
    }
  },

  methods: {
    setTabSelected (tab, status) {
      if (status === true) {
        this.tabs.push(tab)
      }
      else {
        const index = this.tabs.indexOf(tab)

        if (index > -1) {
          this.tabs.splice(index, 1)
        }
      }
    },

    toggleAll () {
      if (this.tabs.length > 0) {
        this.tabs = []
      }
      else {
        this.tabs = this.allTabs.map(t => t.tab)
      }
    }
  }
}
</script>
