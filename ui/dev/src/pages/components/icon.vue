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
      <!-- This is the raw SVG -->
      <q-icon color="secondary" size="5rem">
        <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(3 4)">
            <path d="m3.5 10.5-1-.0345601c-1.10193561-.0037085-2-.93261826-2-2.03456011v-5.9654399c0-1.1045695.8954305-2 2-2l10-.00245977c1.1045695 0 2 .8954305 2 2v6.00245977c0 1.1045695-.8954305 2.00000001-2 2.00000001-.0014957 0-.3348291.01234-1 .0370199"/>
            <path d="m7.5 12.5-3-3h6z" transform="matrix(1 0 0 -1 0 22)"/>
          </g>
        </svg>
      </q-icon>

      <q-icon :name="suiAirplay" size="5rem" color="secondary" />

      <!-- This one has special hand-added handling to make it work -->
      <q-icon :name="suiAirplay2" size="5rem" color="secondary" />

      <!-- Testing for 'M.' -->
      <q-icon :name="oiBatteryEmpty" size="5rem" color="secondary" />

      <q-btn id="showInfoBtn" no-caps class="q-ml-sm">
        <q-icon size="2em" name="img:https://www.gfbr.global/wp-content/uploads/2015/10/TwitterLogo_55acee-49x49.png" />
      </q-btn>

      <q-space />

      <q-expansion-item
        class="bg-white"
        style="width: 300px; z-index: 1; border: 2px solid #ccc"
        label="RE tests for SVG"
        :caption="`${testSvgReTexts.filter(t => t.status === 'OK').length} / ${testSvgReTexts.length} OK`"
      >
        <div v-for="test in testSvgReTexts" :key="test.text" class="q-px-md row no-wrap items-center justify-between">
          <div>{{test.text}}</div>
          <div :class="test.class">{{test.status}}</div>
        </div>
      </q-expansion-item>
    <div>

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

import matSet from 'quasar/icon-set/material-icons'
import matOutlinedSet from 'quasar/icon-set/material-icons-outlined'
import matRoundSet from 'quasar/icon-set/material-icons-round'
import matSharpSet from 'quasar/icon-set/material-icons-sharp'
import symOutlinedSet from 'quasar/icon-set/material-symbols-outlined'
import symRoundedSet from 'quasar/icon-set/material-symbols-rounded'
import symSharpSet from 'quasar/icon-set/material-symbols-sharp'
import mdiSet from 'quasar/icon-set/mdi-v6'
import fontawesomeSet from 'quasar/icon-set/fontawesome-v6'
import ioniconsV4Set from 'quasar/icon-set/ionicons-v4'
import evaSet from 'quasar/icon-set/eva-icons'
import themifySet from 'quasar/icon-set/themify'
import lineawesomeSet from 'quasar/icon-set/line-awesome'
import bootstrapiconsSet from 'quasar/icon-set/bootstrap-icons'

import svgMatSet from 'quasar/icon-set/svg-material-icons'
import svgMatOutlinedSet from 'quasar/icon-set/svg-material-icons-outlined'
import svgMatRoundSet from 'quasar/icon-set/svg-material-icons-round'
import svgMatSharpSet from 'quasar/icon-set/svg-material-icons-sharp'
import svgSymOutlinedSet from 'quasar/icon-set/svg-material-symbols-outlined'
import svgSymRoundedSet from 'quasar/icon-set/svg-material-symbols-rounded'
import svgSymSharpSet from 'quasar/icon-set/svg-material-symbols-sharp'
import svgMdiSet from 'quasar/icon-set/svg-mdi-v6'
import svgIoniconsV4Set from 'quasar/icon-set/svg-ionicons-v4'
import svgIoniconsV5Set from 'quasar/icon-set/svg-ionicons-v5'
import svgIoniconsV6Set from 'quasar/icon-set/svg-ionicons-v6'
import svgFontawesomeV5Set from 'quasar/icon-set/svg-fontawesome-v5'
import svgFontawesomeV6Set from 'quasar/icon-set/svg-fontawesome-v6'
import svgEvaSet from 'quasar/icon-set/svg-eva-icons'
import svgThemifySet from 'quasar/icon-set/svg-themify'
import svgLineawesomeSet from 'quasar/icon-set/svg-line-awesome'
import svgBootstrapiconsSet from 'quasar/icon-set/svg-bootstrap-icons'

import { matAddBox } from '@quasar/extras/material-icons'
import { mdiAirballoon } from '@quasar/extras/mdi-v6'
import { ionMdAirplane, ionIosAirplane } from '@quasar/extras/ionicons-v4'
import { ionCarOutline } from '@quasar/extras/ionicons-v6'
import { ionAirplane } from '@quasar/extras/ionicons-v5'
import { fabGithub } from '@quasar/extras/fontawesome-v6'
import { evaPaperPlaneOutline } from '@quasar/extras/eva-icons'
import { tiFullscreen } from '@quasar/extras/themify'
import { laAtomSolid } from '@quasar/extras/line-awesome'
import { biBugFill } from '@quasar/extras/bootstrap-icons'

// currently does not work with QIcon because it only look for capital 'M'
const suiAirplay = 'm3.5 10.5-1-.0345601c-1.10193561-.0037085-2-.93261826-2-2.03456011v-5.9654399c0-1.1045695.8954305-2 2-2l10-.00245977c1.1045695 0 2 .8954305 2 2v6.00245977c0 1.1045695-.8954305 2.00000001-2 2.00000001-.0014957 0-.3348291.01234-1 .0370199@@fill:none;fill-rule:evenodd;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;@@translate(3 4)&&m7.5 12.5-3-3h6z@@fill:none;fill-rule:evenodd;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;@@matrix(1 0 0 -1 3 26)|0 0 21 21'

// This only works if you add the '@@fill:none;stroke:none;&&' at the start, but this breaks other icon sets
const suiAirplay2 = 'M0 0z@@fill:none;stroke:none;&&m3.5 10.5-1-.0345601c-1.10193561-.0037085-2-.93261826-2-2.03456011v-5.9654399c0-1.1045695.8954305-2 2-2l10-.00245977c1.1045695 0 2 .8954305 2 2v6.00245977c0 1.1045695-.8954305 2.00000001-2 2.00000001-.0014957 0-.3348291.01234-1 .0370199@@fill:none;fill-rule:evenodd;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;@@translate(3 4)&&M0 0zm7.5 12.5-3-3h6z@@fill:none;fill-rule:evenodd;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;@@matrix(1 0 0 -1 3 26)|0 0 21 21'

// test for 'M.'
const oiBatteryEmpty = 'M.09 0c-.06 0-.09.04-.09.09v5.81c0 .05.04.09.09.09h6.81c.05 0 .09-.04.09-.09v-1.91h1v-2h-1v-1.91c0-.06-.04-.09-.09-.09h-6.81zm.91 1h5v4h-5v-4z@@@@translate(0 1)|0 0 8 8'

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

const testSvgReFill = (groups, texts) => {
  if (groups.length === 0) {
    return texts
  }

  const [ curGroup, ...restGroups ] = groups
  const curTexts = []
  const srcTexts = Array.isArray(texts) !== true || texts.length === 0 ? [ '' ] : texts

  srcTexts.forEach(text => {
    curGroup.forEach(char => {
      curTexts.push(`${ text }${ char }`)
    })
  })

  return testSvgReFill(restGroups, curTexts)
}

const testSvgReGroups = [
  [ 'm', 'M' ],
  [ '', ' ' ],
  [ '', '+', '-' ],
  [ '', '.' ],
  [ '0', '9' ]
]
const testSvgReTexts = testSvgReFill(testSvgReGroups)

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

    const mRE = /^[Mm]\s?[-+]?\.?\d/

    return {
      testSvgReTexts: testSvgReTexts.map(text => ({
        text,
        ...(mRE.test(text) ? { status: 'OK', class: 'text-positive' } : { status: 'BAD', class: 'text-negative' })
      })),
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
      suiAirplay,
      suiAirplay2,
      oiBatteryEmpty,

      iconOptions: [
        { value: '', label: 'Empty name' },
        { value: TOP_ICON, label: 'A Material icon' },
        { value: matAddBox, label: 'A Material SVG icon' },
        { value: 'o_add_box', label: 'A Material Outlined icon' },
        { value: 'r_add_box', label: 'A Material Round icon' },
        { value: 's_add_box', label: 'A Material Sharp icon' },
        { value: 'sym_o_search', label: 'A Material Symbols Outlined icon' },
        { value: 'sym_r_search', label: 'A Material Symbols Rounded icon' },
        { value: 'sym_s_search', label: 'A Material Symbols Sharp icon' },
        { value: 'mdi-airballoon', label: 'A MDI v6 icon' },
        { value: mdiAirballoon, label: 'A MDI v6 SVG icon' },
        { value: 'fab fa-github', label: 'A Fontawesome v6 icon' },
        { value: 'fa-brands fa-twitter', label: 'A Fontawesome v6 icon' },
        { value: fabGithub, label: 'A Fontawesome SVG v6 icon' },
        { value: ionCarOutline, label: 'A SVG Ionicon v6' },
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
        symOutlinedSet, symRoundedSet, symSharpSet,
        mdiSet, fontawesomeSet, ioniconsV4Set, evaSet, themifySet,
        lineawesomeSet, bootstrapiconsSet,
        svgMatSet, svgMatOutlinedSet, svgMatRoundSet, svgMatSharpSet,
        svgSymOutlinedSet, svgSymRoundedSet, svgSymSharpSet,
        svgMdiSet, svgIoniconsV4Set, svgIoniconsV5Set, svgIoniconsV6Set,
        svgFontawesomeV5Set, svgFontawesomeV6Set,
        svgEvaSet, svgThemifySet, svgLineawesomeSet, svgBootstrapiconsSet
      ].map(({ name, ...set }) => parseSet(name, set)),

      clicked () {
        console.log('clicked')
      }
    }
  }
}
</script>

<style>
#showInfoBtn {
  position: absolute;
  right: 10px;
  z-index: 3;
  width: 36px;
  height: 36px;
}
</style>
