<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      :max="5"
      :direction-links="true"
      :boundary-links="true"
      :icon-first="laAngleDoubleLeftSolid"
      :icon-last="laAngleDoubleRightSolid"
      :icon-prev="lasAngleLeft"
      :icon-next="lasAngleRight"
    >
    </q-pagination>
  </div>
</template>

<script>
import {
  laAngleDoubleLeftSolid, laAngleDoubleRightSolid, lasAngleLeft, lasAngleRight
} from '@quasar/extras/line-awesome'

export default {
  data () {
    return {
      current: 3
    }
  },

  created () {
    // these icons to not need be Vue reactive
    this.laAngleDoubleLeftSolid = laAngleDoubleLeftSolid
    this.laAngleDoubleRightSolid = laAngleDoubleRightSolid
    this.lasAngleLeft = lasAngleLeft
    this.lasAngleRight = lasAngleRight
  }
}
</script>
