<template>
  <div class="layout-padding">
    <div>
      <q-icon :name="icon" class="gigi" style="font-size: 5rem;" @click="clicked" />
      <span style="margin: 0 15px;">{{ icon }}</span>
      <q-icon :name="icon" class="gigi" style="font-size: 5rem;">
        <q-tooltip>{{ icon }}</q-tooltip>
      </q-icon>
    </div>
    <q-option-group
      type="radio"
      v-model="icon"
      :options="[
        {value: 'cloud', label: 'A Material icon'},
        {value: 'mdi-airballoon', label: 'A MDI icon'},
        {value: 'fab fa-github', label: 'A Font Awesome icon'},
        {value: 'ion-airplane', label: 'A Ionicon (platform dependent)'},
        {value: 'ion-md-airplane', label: 'A Ionicon (md)'},
        {value: 'ion-ios-airplane', label: 'A Ionicon (ios)'}
      ]"
      style="margin-top: 25px"
    />

    <div class="q-mt-xl">
      <div v-for="set in sets" :key="set.setName">
        <h3>{{ set.setName }}</h3>
        <div>
          <q-chip class="q-ma-xs" v-for="icon in set.icons" :key="set.setName + icon.name + icon.val">
            <q-avatar :icon="icon.val" color="primary" text-color="white" />
            {{ icon.name }}
          </q-chip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import matSet from '../../../icons/material-icons.js'
import mdiSet from '../../../icons/mdi.js'
import fontawesomeSet from '../../../icons/fontawesome.js'
import ioniconsSet from '../../../icons/ionicons.js'

function parseSet (setName, set) {
  const icons = []
  Object.keys(set).forEach(key => {
    const prop = set[key]
    Object.keys(prop).forEach(name => {
      const val = prop[name]
      if (typeof val === 'string') {
        icons.push({ name: `${key}/${name}`, val })
      }
    })
  })
  return {
    setName,
    icons
  }
}

export default {
  data () {
    return {
      icon: 'cloud'
    }
  },
  computed: {
    sets () {
      return [matSet, mdiSet, fontawesomeSet, ioniconsSet]
        .map(({ name, ...set }) => parseSet(name, set))
    }
  },
  methods: {
    clicked () {
      console.log('clicked')
    }
  }
}
</script>
