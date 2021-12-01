<template>
  <q-page class="text-white q-mx-lg">

    <div class="row flex-center q-my-xl">

      <div class="col-md-6 col-xs-12 column items-center text-center">
        <q-img src="~assets/landing-page/quasar-logo/logo-with-payoff.svg" width="250px" />

        <div class="q-py-lg text-lp-light text-size-20">
          The open source multi-platform development framework based on Vue.js
          with an enterprise vocation.
        </div>

        <q-btn
          color="lp-accent"
          label="Take a look across the stars"
          padding="md"
          class="text-size-14 text-bold shadow-bottom-small"
        />

        <div class="q-mt-lg">
          <q-btn
            flat
            round
            icon="arrow_downward"
            class="text-white"
            size="lg"
            padding="none"
          />
        </div>
      </div>
    </div>

    <div class="q-mt-sm sponsors">
      <div class="text-lp-primary text-center text-size-16 text-capitalize">
        Our platform sponsors
      </div>
      <div class="sponsors__logos row col-6 col-sm-4 justify-center">
        <template v-for="(src, index) in sponsorLogos.platinum" :key="index">
          <q-img :src="`sponsor-logos/${src}`" width="200px"/>
        </template>
      </div>
      <div class="row justify-center text-size-16">
        <q-btn
          flat
          padding="none"
          text-color="lp-light"
          no-caps
          label="Full sponsor's list"
          class="lp-btn-underline"
        />
      </div>
    </div>

    <div class="q-my-xl">
      <div class="lp-heading lp-heading--large q-mb-xl">
        Why should your team choose quasar?
      </div>

      <div class="row justify-center">
        <div class="col-10 col row">
          <div class="col">
            <div class="row q-col-gutter-md justify-center">
              <template v-for="({icon, title, body, btnLabel, btnLink}, i) in whyQuasar" :key="i">
                <div class="col-4 col-xs-12 col-md-4 col-sm-6" >
                  <why-quasar-card
                    :icon="icon"
                    :title="title"
                    :body="body"
                    :btn-label="btnLabel"
                    :btn-link="btnLink"
                  />
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="q-mt-xl column items-center">
        <div
          class="lp-heading lp-heading--medium">
          Still Doubtful?
        </div>

        <div class="lp-heading lp-heading--small">
          "This framework's got a few surprises left in it, sweetheart!"
        </div>

        <div>
          <q-btn
            color="lp-accent"
            class="shadow-bottom-small q-my-md"
            label="Find out more"
          />
        </div>
      </div>
    </div>

    <div class="advance-scaffolding row justify-center items-end lp-mb--large">
      <q-img height="100vh" src="~assets/landing-page/homepage-background-images/astronaut-on-moon.jpg"/>
      <div class="col-9 relative-position">
        <div class="column items-end absolute-bottom-right lp-mb--large">
          <div class="lp-heading lp-heading--large text-right">
            Advanced scaffolding
          </div>

          <div class="text-right lp-heading--small q-mb-md">
            Get all you need to setup your project basic
            <span class="block">features and save time</span>
          </div>
          <q class="lp-heading--quote">He who controls Scaffolding, controls the universe</q>
          <q-btn
            class="shadow-bottom-small q-mt-md"
            color="lp-accent"
            label="Consult pricing"
          />
        </div>
      </div>
    </div>

    <div class="window-height lp-mb--large">
      <div class="row justify-center">
        <div class="col-8 text-center col-xs-10">
          <q-icon
            size="xl"
            name="img:homepage-icons/astronaut.svg"
          />
          <div class="lp-heading lp-heading--large">
            What our community thinks of quasar
          </div>
          <div class="lp-heading lp-heading--small">
            "You've never heard of Quasar? It's the framework that made a mobile
            app, desktop app and browser extension altogether in less than 12 minutes."
          </div>
        </div>
      </div>
      <twitter-showcase-cards />
    </div>

    <div class="window-height">
      <div class="row justify-center">
        <div class="col-6 col-xs-10">
          <div class="lp-heading--large">
            Support quasar: Become sponsor!
          </div>

          <div class="lp-heading--small text-left support-quasar-caption-text">
            Working for a company or freelancer? You can contribute, ever a bit and getting something back.
          </div>

          <div class="q-my-md lp-heading--quote">
            <q>So, um, we think we should discuss the bonus situation</q>
          </div>

          <q-btn
            color="lp-accent"
            label="Consult tiers"
            padding="sm"
            class="text-size-14 text-bold shadow-bottom-small"
          />
        </div>
      </div>

      <div class="astronaut-hand">
        <q-img class="astronaut-hand--left" width="50%"  src="~assets/landing-page/homepage-background-images/astronaut-left-hand.png" />
        <q-img class="astronaut-hand--right" width="50%" src="~assets/landing-page/homepage-background-images/astronaut-right-hand.png" />
      </div>
    </div>

    <div class="text-center lp-mb--large">
      <q-icon size="xl" name="img:homepage-icons/medal.svg" />
      <div class="lp-heading lp-heading--large">Our Sponsors</div>
      <div class="lp-heading lp-heading--small">Every space odyssey has its patrons</div>
      <div class="row justify-center">
        <div class="col-8 text-size-12">
          <div class="q-my-md">Platinum Sponsors</div>
          <q-img :src="`sponsor-logos/${src}`" width="200px" v-for="(src, index) in sponsorLogos.platinum" :key="index"/>
          <div class="q-my-md">Gold Sponsors</div>
          <q-img :src="`sponsor-logos/${src}`" width="200px" v-for="(src, index) in sponsorLogos.gold" :key="index" />
          <div class="q-my-md">Silver Sponsors</div>
          <q-img :src="`sponsor-logos/${src}`" width="200px" v-for="(src, index) in sponsorLogos.silver" :key="index" />
        </div>
      </div>
    </div>

    <div class="text-center social-channels-call-to-action lp-mb--large">
      <q-img src="~assets/landing-page/homepage-background-images/planet.png" :height="$q.screen.gt.xs? 'auto':'500px'">
        <div class="bg-transparent absolute-bottom">
          <q-icon size="xl" name="img:homepage-icons/satellite.svg" />
          <div class="lp-heading lp-heading--large">Don't miss the news </div>
          <div class="lp-heading lp-heading--small">Follow our social pages to stay up to date</div>
          <div class="row justify-center q-mb-xl q-mt-md q-gutter-md">
            <q-btn label="Facebook" color="lp-accent" outline/>
            <q-btn label="Twitter" color="lp-accent" outline/>
            <q-btn label="Forum" color="lp-accent" outline/>
            <q-btn label="Discord" color="lp-accent" outline/>
          </div>
        </div>
      </q-img>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import WhyQuasarCard from 'src/components/landing-page/WhyQuasarCard.vue'
import { sponsorLogos, whyQuasar } from 'src/assets/landing-page/image-links.js'
import TwitterShowcaseCards from 'src/components/landing-page/TwitterShowcaseCards.vue'

export default defineComponent({
  name: 'Index',
  components: { TwitterShowcaseCards, WhyQuasarCard },
  setup () {
    return {
      whyQuasar,
      sponsorLogos
    }
  }
})
</script>

<style scoped lang="scss">
$undo-margin-from-qpage: 0 -24px 0 -24px;

.lp-btn-underline {
  border-bottom: 1px solid $lp-light;
}

.social-channels-call-to-action {
  margin: $undo-margin-from-qpage;
}

.astronaut-hand {
  margin: 0 -24px 0 -24px;

  &--right {
    margin-top: -100px;

    @media screen and (min-width: $breakpoint-md-min) {
      margin-top: -600px
    }
  }
}

.support-quasar-caption-text {
  width: 65%;
}

.advance-scaffolding {
  height: 100vh;
}
</style>
