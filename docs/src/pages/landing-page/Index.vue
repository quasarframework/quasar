<template>
  <q-page class="text-white q-mx-lg">

    <div class="row flex-center lp-mt--large">

      <div class="col-md-6 col-xs-12 column items-center text-center">
        <q-img src="~assets/landing-page/quasar-logo/logo-with-payoff.svg" width="250px" />

        <div class="lp-my--medium text-lp-light text-size-20">
          The open source multi-platform development framework based on Vue.js
          with an enterprise vocation.
        </div>

        <q-btn
          color="lp-accent"
          label="Take a look across the stars"
          padding="md"
          class="call-to-action-btn shadow-bottom-small"
        />

        <div class="q-mt-lg">
          <q-btn
            flat
            round
            icon="arrow_downward"
            class="text-white"
            size="lg"
            padding="none"
            @click="scrollSectionIntoView('why_quasar_section')"
          />
        </div>
      </div>
    </div>

    <div class="sponsors">
      <div class="text-lp-primary text-center text-size-16 text-capitalize">
        Our platform sponsors
      </div>
      <div class="sponsors__logos row col-6 col-sm-4 justify-center lp-my--medium">
        <template v-for="(src, index) in sponsorLogos.platinum" :key="index">
          <q-img :src="`sponsor-logos/${src}`" width="200px"/>
        </template>
      </div>
      <div class="row justify-center lp-mt--medium">
        <q-btn
          flat
          padding="none"
          text-color="lp-light"
          no-caps
          label="Full sponsor's list"
          class="lp-btn-underline sponsors__list"
          size="16px"
          @click="scrollSectionIntoView('sponsors_section')"
        />
      </div>
    </div>

    <div class="q-my-xl" id="why_quasar_section">
      <div class="lp-heading lp-heading--large q-mb-xl">
        Why should your team choose quasar?
      </div>

      <div class="row justify-center">
        <div class="col-10 col row">
          <div class="col">
            <div class="row q-col-gutter-lg justify-center">
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

      <div class="lp-mt--large column items-center">
        <div
          class="lp-heading lp-heading--medium">
          Still Doubtful?
        </div>

        <div class="lp-heading lp-heading--small q-my-lg">
          "This framework's got a few surprises left in it, sweetheart!"
        </div>

        <div>
          <q-btn
            color="lp-accent"
            class="call-to-action-btn shadow-bottom-small"
            label="Find out more"
          />
        </div>
      </div>
    </div>

    <div class="advance-scaffolding row justify-center items-end">
      <q-img height="100vh" src="~assets/landing-page/homepage-background-images/astronaut-on-moon.jpg"/>
      <div class="col-9 relative-position">
        <div class="column items-end absolute-bottom-right lp-mb--large">
          <div class="lp-heading lp-heading--large text-right">
            Advanced scaffolding
          </div>

          <div class="text-right lp-heading--small lp-my--medium">
            Get all you need to setup your project basic
            <span class="block">features and save time</span>
          </div>
          <q class="lp-heading--quote">He who controls Scaffolding, controls the universe</q>
          <q-btn
            class="call-to-action-btn lp-mt--medium shadow-bottom-small"
            color="lp-accent"
            label="Consult pricing"
          />
        </div>
      </div>
    </div>

    <div class="window-height lp-mb--large showcase-section">
      <div class="row justify-center">
        <div class="col-8 text-center col-xs-10">
          <q-icon
            size="xl"
            name="img:homepage-icons/astronaut.svg"
          />
          <div class="lp-heading lp-heading--large q-my-lg">
            What our community thinks of quasar
          </div>
          <div class="lp-heading lp-heading--small q-mb-xl">
            "You've never heard of Quasar? It's the framework that made a mobile
            app, desktop app and browser extension altogether in less than 12 minutes."
          </div>
        </div>
      </div>
      <twitter-showcase-cards />
    </div>

    <div class="window-height support-quasar-section">
      <div class="row justify-center">
        <div class="col-6 col-xs-10">
          <div class="lp-heading--large support-quasar-section__title">
            Support quasar: Become sponsor!
          </div>

          <div class="lp-heading--small text-left support-quasar-caption-text">
            Working for a company or freelancer? You can contribute, ever a bit and getting something back.
          </div>

          <div class="q-my-md lp-heading--quote lp-my--medium">
            <q>So, um, we think we should discuss the bonus situation</q>
          </div>

          <q-btn
            color="lp-accent"
            label="Consult tiers"
            padding="sm"
            class="call-to-action-btn shadow-bottom-small"
          />
        </div>
      </div>

      <div class="astronaut-hand">
        <q-img class="astronaut-hand--left" width="50%"  src="~assets/landing-page/homepage-background-images/astronaut-left-hand.png" />
        <q-img class="astronaut-hand--right" width="50%" :img-style="{ width: '102%' }" src="~assets/landing-page/homepage-background-images/astronaut-right-hand.png" />
      </div>
    </div>

    <div class="text-center lp-mb--large sponsors-section" id="sponsors_section">
      <q-icon size="xl" name="img:homepage-icons/medal.svg" />
      <div class="lp-heading lp-heading--large">Our Sponsors</div>
      <div class="lp-heading lp-heading--small">Every space odyssey has its patrons</div>
      <div class="row justify-center">
        <div class="col-8 text-size-12">
          <div class="q-my-md">Platinum Sponsors</div>
          <q-img :src="`sponsor-logos/${src}`" width="200px" v-for="(src, index) in sponsorLogos.platinum" :key="index"/>
          <div class="q-my-md">Silver Sponsors</div>
          <q-img :src="`sponsor-logos/${src}`" width="200px" v-for="(src, index) in sponsorLogos.silver" :key="index" />
        </div>
      </div>
    </div>

    <div class="text-center social-channels-call-to-action lp-mb--large">
      <q-img src="~assets/landing-page/homepage-background-images/planet.png" height="1080">
        <div class="bg-transparent absolute-bottom">
          <q-icon size="xl" name="img:homepage-icons/satellite.svg" />
          <div class="lp-heading lp-heading--large">Don't miss the news </div>
          <div class="lp-heading lp-heading--small">Follow our social pages to stay up to date</div>
          <div class="row reverse justify-center q-mb-xl q-mt-md q-gutter-md">
            <template v-for="(socialLink, linkIndex) in socialLinks.slice(1)" :key="linkIndex">
              <q-btn :label="socialLink.name" class="call-to-action-btn" color="lp-accent" outline type="a" :href="socialLink.href" target="__blank"/>
            </template>
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
import { socialLinks } from 'assets/landing-page/social-links.js'
import { scroll } from 'quasar'

const { getScrollTarget, setVerticalScrollPosition } = scroll
function scrollToElement (el) {
  const target = getScrollTarget(el)
  const offset = el.offsetTop
  const duration = 1000
  setVerticalScrollPosition(target, offset, duration)
}

export default defineComponent({
  name: 'Index',
  components: { TwitterShowcaseCards, WhyQuasarCard },
  setup () {
    function scrollSectionIntoView (idOfTarget) {
      const el = document.getElementById(idOfTarget)
      scrollToElement(el)
    }

    return {
      whyQuasar,
      sponsorLogos,
      socialLinks,
      scrollSectionIntoView
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
      margin-top: -600px;
    }
  }
}

.support-quasar-caption-text {
  @media screen and (min-width: $breakpoint-sm-min) {
    width: 65%;
  }
}

.advance-scaffolding {
  height: 100vh;
  margin-bottom: 256px;
}

.sponsors {
  margin-top: 80px;

  &__list {
    margin-bottom: 208px;
  }
}

.showcase-section {
  margin-top: 258px;
}

.support-quasar-section {
  &__title {
    margin-top: 256px;
  }
}
.sponsors-section {
  height: 12vh;
  margin-top: 400px;
}
</style>
