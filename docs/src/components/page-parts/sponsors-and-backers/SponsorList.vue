<template lang="pug">
  .row.q-gutter-sm
    sponsor(img="campus-cloud-services.png" name="Campus Cloud Services" url="http://campuscloudservices.com/")
    sponsor(img="platform-purple.png" name="Platform Purple" url="https://platformpurple.com/")
    sponsor(img="truelogic.png" name="Truelogic" url="https://truelogic.com/")
    sponsor(img="juggle-street.png" name="Juggle Street" url="https://www.jugglestreet.com.au/")
    sponsor(img="com-com-services.png" name="Com Com Services" url="http://comcomservices.com/")
    sponsor(img="kalisio.png" name="Kalisio" url="https://kalisio.com/")
    sponsor(img="bgasoft.png" name="BGASoft" url="https://www.bgasoft.com/")
    sponsor(img="letsbutterfly.png" name="LetsButterfly" url="https://www.letsbutterfly.com/")
    sponsor(img="project-finance.png" name="Project Finance" url="https://www.projectfinance.io/")
    sponsor(img="dreamonkey.png" name="Dreamonkey" url="https://dreamonkey.com/")
    sponsor(img="ib-langenthal.svg" name="IB Langenthal AG" url="https://ib-langenthal.ch/")
</template>

<script>
import Sponsor from 'components/page-parts/sponsors-and-backers/Sponsor'

export default {
  name: 'SponsorList',

  components: {
    Sponsor
  }
}
</script>
