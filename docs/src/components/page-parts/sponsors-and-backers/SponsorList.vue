<template lang="pug">
//- TODO: must align to use sponsors list into assets folder, check out landing SponsorList
//- we would need a light and dark version of every logo
q-intersection(once)
  .row.q-gutter-sm.justify-center
    sponsor-tile(src="mio-ab.svg" name="Mio AB" href="https://mio.se/")
    sponsor-tile(src="dreamonkey.png" name="Dreamonkey Srl" href="https://dreamonkey.com/")
    sponsor-tile(src="hapag-lloyd.png" name="Hapag-LLoyd" href="https://www.hapag-lloyd.com/en/landingpage/quasar.html")
    sponsor-tile(src="campus-cloud-services.png" name="Campus Cloud Services" href="http://campuscloudservices.com/")
    sponsor-tile(src="platform-purple.png" name="Platform Purple" href="https://platformpurple.com/")
    sponsor-tile(src="irewind.png" name="iRewind" href="https://irewind.com/")
    sponsor-tile(src="truelogic.png" name="Truelogic" href="https://truelogic.com/")
    sponsor-tile(src="juggle-street.png" name="Juggle Street" href="https://www.jugglestreet.com.au/")
    sponsor-tile(src="digitalocean.svg" name="DigitalOcean" href="https://digitalocean.com/")
    sponsor-tile(src="com-com-services.png" name="Com Com Services" href="https://comcomservices.com/")
    sponsor-tile(src="kalisio.png" name="Kalisio" href="https://kalisio.com/")
    sponsor-tile(src="letsbutterfly.png" name="LetsButterfly" href="https://www.letsbutterfly.com/")
    sponsor-tile(src="project-finance.png" name="Project Finance" href="https://www.projectfinance.io/")
    sponsor-tile(src="ib-langenthal.svg" name="IB Langenthal AG" href="https://ib-langenthal.ch/")
    sponsor-tile(src="debricked.png" name="Debricked AB" href="https://debricked.com/")
    sponsor-tile(src="qintil.png" name="Qintil Technology Ltd" href="https://qintil.com/")
    sponsor-tile(src="synestia.svg" name="Synestia" href="https://synestia.pl/")

</template>

<script>
import SponsorTile from 'components/page-parts/sponsors-and-backers/SponsorTile.vue'

export default {
  name: 'SponsorList',
  components: { SponsorTile }
}
</script>
