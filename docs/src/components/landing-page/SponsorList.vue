<template>
  <q-intersection once>
    <div class="text-center">
      <template v-for="(tierSponsors, tierName) in sponsors" :key="tierName">
        <template v-if="tierSponsors.length > 0">
          <div class="q-my-md text-capitalize text-size-16 text-weight-bold">{{tierName}} Sponsors</div>
          <div class="row justify-center logos-container">
            <sponsor-tile
              v-for="({src, name, href, cdn}, sponsorIndex) in tierSponsors"
              :key="`${tierName}-${sponsorIndex}`"
              :src="src"
              :name="name"
              :href="href"
              :cdn="cdn || false"
            />
          </div>
        </template>
      </template>
    </div>
  </q-intersection>
</template>

<script>
import SponsorTile from 'components/page-parts/sponsors-and-backers/SponsorTile.vue'
import { sponsors } from 'src/assets/sponsors.js'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SponsorList',
  components: { SponsorTile },
  setup () {
    return { sponsors }
  }
})
</script>

<style lang="scss">
.logos-container {
  max-width: 1000px;
  margin: auto;
}
</style>
