<template>
  <div class="q-layout-padding">
    <div class="q-gutter-x-md">
      <q-icon :name="icon" class="gigi" @click="clicked" size="5rem" />

      <span>text</span>

      <q-icon :name="icon" class="gigi" color="primary" size="5rem">
        <q-tooltip>{{ icon }}</q-tooltip>
      </q-icon>

      <q-icon color="accent" size="5rem">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>
        </svg>
      </q-icon>
    </div>

    <q-option-group
      type="radio"
      v-model="icon"
      inline
      :options="[
        {value: '', label: 'Empty name'},
        {value: 'add_box', label: 'A Material icon'},
        {value: matAddBox, label: 'A Material SVG icon'},
        {value: 'o_add_box', label: 'A Material Outlined icon'},
        {value: 'r_add_box', label: 'A Material Round icon'},
        {value: 's_add_box', label: 'A Material Sharp icon'},
        {value: 'mdi-airballoon', label: 'A MDI v4 icon'},
        {value: mdiAirballoon, label: 'A MDI v4 SVG icon'},
        {value: 'fab fa-github', label: 'A Fontawesome icon'},
        {value: fabGithub, label: 'A Fontawesome SVG icon'},
        {value: 'ion-airplane', label: 'A Ionicon (platform dependent)'},
        {value: 'ion-md-airplane', label: 'A Ionicon (md)'},
        {value: 'ion-ios-airplane', label: 'A Ionicon (ios)'},
        {value: ionMdAirplane, label: 'A SVG Ionicon (md)'},
        {value: ionIosAirplane, label: 'A SVG Ionicon (ios)'},
        {value: 'eva-paper-plane-outline', label: 'A Eva icon'},
        {value: evaPaperPlaneOutline, label: 'A Eva SVG icon'},
        {value: 'ti-fullscreen', label: 'A Themify icon'},
        {value: tiFullscreen, label: 'A Themify SVG icon'}
      ]"
      style="margin-top: 25px"
    />

    <div class="q-mt-xl">
      <div v-for="set in sets" :key="set.setName">
        <h3>{{ set.setName }}</h3>
        <div>
          <q-chip class="q-ma-xs" v-for="theIcon in set.icons" :key="set.setName + theIcon.name + theIcon.val">
            <q-avatar :icon="theIcon.val" color="primary" text-color="white" />
            {{ theIcon.name }}
          </q-chip>
        </div>
      </div>
    </div>

    <div class="q-mt-xl">
      <q-icon name="img:https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
      <q-icon size="100px" name="img:https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
      <q-input v-model="text" clearable clear-icon="img:https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
    </div>
  </div>
</template>

<script>
import matSet from '../../../icon-set/material-icons.js'
import matOutlinedSet from '../../../icon-set/material-icons-outlined.js'
import matRoundSet from '../../../icon-set/material-icons-round.js'
import matSharpSet from '../../../icon-set/material-icons-sharp.js'
import mdiSet from '../../../icon-set/mdi-v4.js'
import fontawesomeSet from '../../../icon-set/fontawesome-v5.js'
import ioniconsSet from '../../../icon-set/ionicons-v4.js'
import evaSet from '../../../icon-set/eva-icons.js'
import themifySet from '../../../icon-set/themify.js'

import svgMatSet from '../../../icon-set/svg-material-icons.js'
import svgMdiSet from '../../../icon-set/svg-mdi-v4.js'
import svgIoniconsSet from '../../../icon-set/svg-ionicons-v4.js'
import svgFontawesomeSet from '../../../icon-set/svg-fontawesome-v5.js'
import svgEvaSet from '../../../icon-set/svg-eva-icons.js'
import svgThemifySet from '../../../icon-set/svg-themify.js'

import { matAddBox } from '@quasar/extras/material-icons'
import { mdiAirballoon } from '@quasar/extras/mdi-v4'
import { ionMdAirplane, ionIosAirplane } from '@quasar/extras/ionicons-v4'
import { fabGithub } from '@quasar/extras/fontawesome-v5'
import { evaPaperPlaneOutline } from '@quasar/extras/eva-icons'
import { tiFullscreen } from '@quasar/extras/themify'

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
      icon: 'add_box',
      text: 'gigi',
      matAddBox,
      mdiAirballoon,
      ionMdAirplane,
      ionIosAirplane,
      fabGithub,
      evaPaperPlaneOutline,
      tiFullscreen
    }
  },
  computed: {
    sets () {
      return [
        matSet, matOutlinedSet, matRoundSet, matSharpSet,
        mdiSet, fontawesomeSet, ioniconsSet, evaSet, themifySet,
        svgMatSet, svgMdiSet, svgIoniconsSet, svgFontawesomeSet, svgEvaSet, svgThemifySet
      ].map(({ name, ...set }) => parseSet(name, set))
    }
  },
  methods: {
    clicked () {
      console.log('clicked')
    }
  }
}
</script>
