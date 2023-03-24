<template>
  <q-intersection>
    <div class="row q-gutter-sm">
      <template v-for="(tierSponsors, tierName) in sponsors" :key="tierName">
        <template v-if="tierSponsors.length > 0">
          <sponsor-tile
            v-for="({src, name, href}, sponsorIndex) in tierSponsors"
            :key="`${tierName}-${sponsorIndex}`"
            :src="src"
            :name="name"
            :href="href"
          />
        </template>
      </template>
    </div>
  </q-intersection>
</template>

<script setup>
import SponsorTile from './SponsorTile.vue'
import { sponsors } from 'src/assets/sponsors'
</script>
