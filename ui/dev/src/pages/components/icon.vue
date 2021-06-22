<template>
  <div class="q-layout-padding">
    <div class="q-gutter-x-md">
      <q-toggle v-model="useMapFn" label="Use iconMapFn" />

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

      <q-icon name="android" size="5rem" />
    </div>

    <q-option-group
      type="radio"
      v-model="icon"
      inline
      :options="iconOptions"
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
      <q-icon name="img:https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
      <q-icon size="100px" name="img:https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
      <q-input v-model="text" clearable clear-icon="img:https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'

import matSet from 'quasar/icon-set/material-icons.js'
import matOutlinedSet from 'quasar/icon-set/material-icons-outlined.js'
import matRoundSet from 'quasar/icon-set/material-icons-round.js'
import matSharpSet from 'quasar/icon-set/material-icons-sharp.js'
import mdiSet from 'quasar/icon-set/mdi-v5.js'
import fontawesomeSet from 'quasar/icon-set/fontawesome-v5.js'
import ioniconsV4Set from 'quasar/icon-set/ionicons-v4.js'
import evaSet from 'quasar/icon-set/eva-icons.js'
import themifySet from 'quasar/icon-set/themify.js'
import lineawesomeSet from 'quasar/icon-set/line-awesome.js'
import bootstrapiconsSet from 'quasar/icon-set/bootstrap-icons.js'

import svgMatSet from 'quasar/icon-set/svg-material-icons.js'
import svgMatOutlinedSet from 'quasar/icon-set/svg-material-icons-outlined.js'
import svgMatRoundSet from 'quasar/icon-set/svg-material-icons-round.js'
import svgMatSharpSet from 'quasar/icon-set/svg-material-icons-sharp.js'
import svgMdiSet from 'quasar/icon-set/svg-mdi-v5.js'
import svgIoniconsV4Set from 'quasar/icon-set/svg-ionicons-v4.js'
import svgIoniconsSet from 'quasar/icon-set/svg-ionicons-v5.js'
import svgFontawesomeSet from 'quasar/icon-set/svg-fontawesome-v5.js'
import svgEvaSet from 'quasar/icon-set/svg-eva-icons.js'
import svgThemifySet from 'quasar/icon-set/svg-themify.js'
import svgLineawesomeSet from 'quasar/icon-set/svg-line-awesome.js'
import svgBootstrapiconsSet from 'quasar/icon-set/svg-bootstrap-icons.js'

import { matAddBox } from '@quasar/extras/material-icons'
import { mdiAirballoon } from '@quasar/extras/mdi-v5'
import { ionMdAirplane, ionIosAirplane } from '@quasar/extras/ionicons-v4'
import { ionAirplane } from '@quasar/extras/ionicons-v5'
import { fabGithub } from '@quasar/extras/fontawesome-v5'
import { evaPaperPlaneOutline } from '@quasar/extras/eva-icons'
import { tiFullscreen } from '@quasar/extras/themify'
import { laAtomSolid } from '@quasar/extras/line-awesome'
import { biBugFill } from '@quasar/extras/bootstrap-icons'

const TOP_ICON = 'add_box'

function parseSet (setName, set) {
  const icons = []
  Object.keys(set).forEach(key => {
    const prop = set[ key ]
    Object.keys(prop).forEach(name => {
      const val = prop[ name ]
      if (typeof val === 'string') {
        icons.push({ name: `${ key }/${ name }`, val })
      }
    })
  })
  return {
    setName,
    icons
  }
}

function customIconMapFn (iconName) {
  if (iconName === TOP_ICON) {
    return {
      cls: 'material-icons',
      content: 'map'
    }
  }
}

export default {
  setup () {
    const useMapFn = ref(false)
    const icon = ref(TOP_ICON)

    const $q = useQuasar()

    watch(useMapFn, val => {
      if (val === true) {
        icon.value = TOP_ICON
        // Quasar.iconSet.iconMapFn = customIconMapFn
        $q.iconMapFn = customIconMapFn
      }
      else {
        // Quasar.iconSet.iconMapFn = null
        $q.iconMapFn = null
      }
    })

    return {
      useMapFn,
      icon,
      text: ref('gigi'),
      matAddBox,
      mdiAirballoon,
      ionMdAirplane,
      ionIosAirplane,
      fabGithub,
      evaPaperPlaneOutline,
      tiFullscreen,
      laAtomSolid,
      biBugFill,

      iconOptions: [
        { value: '', label: 'Empty name' },
        { value: TOP_ICON, label: 'A Material icon' },
        { value: matAddBox, label: 'A Material SVG icon' },
        { value: 'o_add_box', label: 'A Material Outlined icon' },
        { value: 'r_add_box', label: 'A Material Round icon' },
        { value: 's_add_box', label: 'A Material Sharp icon' },
        { value: 'mdi-airballoon', label: 'A MDI v5 icon' },
        { value: mdiAirballoon, label: 'A MDI v5 SVG icon' },
        { value: 'fab fa-github', label: 'A Fontawesome icon' },
        { value: fabGithub, label: 'A Fontawesome SVG icon' },
        { value: ionAirplane, label: 'A SVG Ionicon v5' },
        { value: 'ion-airplane', label: 'A Ionicon v4 (platform dependent)' },
        { value: 'ion-md-airplane', label: 'A Ionicon v4 (md)' },
        { value: 'ion-ios-airplane', label: 'A Ionicon v4 (ios)' },
        { value: ionMdAirplane, label: 'A SVG Ionicon v4 (md)' },
        { value: ionIosAirplane, label: 'A SVG Ionicon v4 (ios)' },
        { value: 'eva-paper-plane-outline', label: 'A Eva icon' },
        { value: evaPaperPlaneOutline, label: 'A Eva SVG icon' },
        { value: 'ti-fullscreen', label: 'A Themify icon' },
        { value: tiFullscreen, label: 'A Themify SVG icon' },
        { value: 'las la-atom', label: 'A Line Awesome icon' },
        { value: laAtomSolid, label: 'A Line Awesome SVG icon' },
        { value: 'bi-bug', label: 'A Bootstrap Icons icon' },
        { value: biBugFill, label: 'A Bootstrap Icons SVG icon' }
      ],

      sets: [
        matSet, matOutlinedSet, matRoundSet, matSharpSet,
        mdiSet, fontawesomeSet, ioniconsV4Set, evaSet, themifySet,
        lineawesomeSet, bootstrapiconsSet,
        svgMatSet, svgMatOutlinedSet, svgMatRoundSet, svgMatSharpSet,
        svgMdiSet, svgIoniconsV4Set, svgIoniconsSet, svgFontawesomeSet,
        svgEvaSet, svgThemifySet, svgLineawesomeSet, svgBootstrapiconsSet
      ].map(({ name, ...set }) => parseSet(name, set)),

      clicked () {
        console.log('clicked')
      }
    }
  }
}
</script>
