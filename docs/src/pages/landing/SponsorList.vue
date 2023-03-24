<template>
  <q-intersection once>
    <div class="text-center">
      <template v-for="(tierSponsors, tierName) in sponsors" :key="tierName">
        <template v-if="tierSponsors.length > 0">
          <div class="q-my-md text-capitalize text-size-16 text-weight-bold">{{tierName}} Sponsors</div>
          <div class="row justify-center logos-container">
            <sponsor-tile
              v-for="({src, name, href}, sponsorIndex) in tierSponsors"
              :key="`${tierName}-${sponsorIndex}`"
              :src="src"
              :name="name"
              :href="href"
            />
          </div>
        </template>
      </template>
    </div>
  </q-intersection>
</template>

<script setup>
import SponsorTile from '../sponsors-and-backers/SponsorTile.vue'
import { sponsors } from 'src/assets/sponsors.js'
</script>

<style lang="sass">
.logos-container
  max-width: 1000px
  margin: auto
</style>
