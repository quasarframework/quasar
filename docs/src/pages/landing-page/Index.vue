<template>
  <q-page class="text-white q-mx-lg">
    <div class="row flex-center lp-mt--large">
      <div class="col-md-6 col-xs-12 column items-center text-center">
        <q-img src="~assets/landing-page/quasar-logo/logo-with-payoff.svg" width="250px" />

        <h1 class="lp-my--medium text-white-54 text-size-20 letter-spacing-375 primary-line-height">
          The open source multi-platform development framework based on Vue.js
          with an enterprise vocation.
        </h1>

        <q-btn
          color="lp-accent"
          label="Take a look across the stars"
          class="call-to-action-btn shadow-bottom-small"
          @click="scrollSectionIntoView('why-quasar-section')"
        />

        <div class="q-mt-lg">
          <q-btn
            flat
            round
            icon="arrow_downward"
            class="text-white"
            size="lg"
            padding="none"
            @click="scrollSectionIntoView('why-quasar-section')"
          />
        </div>
      </div>
    </div>

    <div class="sponsors letter-spacing-300">
      <div
        class="text-weight-bold text-lp-primary text-center text-size-16 text-capitalize"
      >Our Platinum sponsors</div>
      <div class="sponsors__logos row col-6 col-sm-4 justify-center lp-my--medium">
        <q-img
          v-for="(src, index) in sponsorLogos.platinum"
          :key="index"
          :src="`sponsor-logos/${src}`"
          width="200px"
        />
      </div>
      <div class="row justify-center lp-mt--medium">
        <q-btn
          flat
          padding="none"
          text-color="white-54"
          no-caps
          label="Full sponsor's list"
          class="lp-btn-underline text-size-16 letter-spacing-300"
          @click="scrollSectionIntoView('sponsors_section')"
        />
      </div>
    </div>

    <div class="q-my-xl" id="why-quasar-section">
      <h2 class="lp-heading lp-heading--large">Why should your team choose quasar?</h2>

      <div class="why-quasar__grid justify-center">
        <why-quasar-card
          v-for="({ icon, title, body, btnLabel, btnLink }, whyQuasarCardIndex) in whyQuasar"
          :key="whyQuasarCardIndex"
          :icon="icon"
          :title="title"
          :body="body"
          :btn-label="btnLabel"
          :btn-link="btnLink"
        />
      </div>
    </div>

    <div class="showcase-section">
      <div class="column items-center">
        <q-icon size="xl" name="img:homepage-icons/astronaut.svg" />
        <h2 class="lp-heading lp-heading--large q-my-lg">What our community thinks of quasar</h2>
        <q
          class="lp-heading lp-heading--small"
        >You've never heard of Quasar? It's the framework that made a mobile app,<br/>desktop app and browser extension altogether in less than 12 minutes.</q>
      </div>
      <twitter-showcase-cards />
    </div>

    <div class="window-height support-quasar-section">
      <div class="row justify-center">
        <div class="col-6 col-xs-10">
          <h2
            class="text-uppercase lp-heading--large support-quasar-section__title"
          >Support quasar: Become sponsor!</h2>

          <div
            class="lp-heading--small text-left support-quasar-caption-text"
          >Working for a company or freelancer? You can contribute, ever a bit and getting something back.</div>

          <q
            class="q-my-md lp-heading--quote primary-line-height lp-my--medium"
          >So, um, we think we should discuss the bonus situation</q>

          <q-btn
            color="lp-accent"
            label="Consult tiers"
            class="call-to-action-btn shadow-bottom-small"
            href="https://github.com/sponsors/rstoenescu"
            target="_blank"
          />
        </div>
      </div>

      <div class="astronaut-hand">
        <q-img
          class="astronaut-hand--left"
          width="50%"
          src="~assets/landing-page/homepage-background-images/astronaut-left-hand.png"
        />
        <q-img
          class="astronaut-hand--right"
          width="50%"
          :img-style="{ width: '102%' }"
          src="~assets/landing-page/homepage-background-images/astronaut-right-hand.png"
        />
      </div>
    </div>

    <div class="text-center sponsors-section" id="sponsors_section">
      <q-icon size="xl" name="img:homepage-icons/medal.svg" />
      <h2 class="lp-heading lp-heading--large">Our Sponsors</h2>
      <div class="lp-heading lp-heading--small">Every space odyssey has its patrons</div>
      <div class="row justify-center">
        <div class="col-8 text-size-16 text-weight-bold">
          <div class="q-my-md letter-spacing-300">Platinum Sponsors</div>
          <q-img
            :src="`sponsor-logos/${src}`"
            width="200px"
            v-for="(src, index) in sponsorLogos.platinum"
            :key="index"
          />
          <div class="q-my-md letter-spacing-300">Silver Sponsors</div>
          <q-img
            :src="`sponsor-logos/${src}`"
            width="200px"
            v-for="(src, index) in sponsorLogos.silver"
            :key="index"
          />
        </div>
      </div>
    </div>

    <div class="text-center social-channels-call-to-action lp-mb--large">
      <q-img
        src="~assets/landing-page/homepage-background-images/planet.png"
        :height="$q.screen.lt.md ? '80vh' : '1080'"
      >
        <div class="bg-transparent absolute-bottom">
          <q-icon size="xl" name="img:homepage-icons/satellite.svg" />
          <div class="lp-heading lp-heading--large">Don't miss the news</div>
          <div class="lp-heading lp-heading--small">Follow our social pages to stay up to date</div>
          <div class="row reverse justify-center q-mb-xl q-mt-md q-gutter-md">
            <q-btn
              v-for="(socialLink, linkIndex) in socialLinks.slice(1)"
              :key="linkIndex"
              :label="socialLink.name"
              class="call-to-action-btn"
              color="lp-accent"
              outline
              type="a"
              :href="socialLink.href"
              target="__blank"
            />
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
$why-quasar-card-side: 400px;

.lp-btn-underline {
  border-bottom: 1px solid rgba($color: white, $alpha: 0.54);
}

.social-channels-call-to-action {
  margin: $undo-margin-from-qpage;
}

q {
  display: block
}

.why-quasar__grid {
  display: grid;
  gap: 24px;
  grid-template-columns: $why-quasar-card-side;
  justify-items: center;

  @media screen and (min-width: $breakpoint-md-min) and (max-width: $breakpoint-md-max) {
    grid-template-columns: repeat(2, $why-quasar-card-side);

    > :last-of-type {
      grid-column: span 2;
    }
  }

  @media screen and (min-width: $breakpoint-lg-min) {
    grid-template-columns: repeat(3, $why-quasar-card-side);
  }
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
  margin-bottom: 208px;

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
  margin-top: 200px;

  @media screen and (min-width: $breakpoint-md-max) {
    height: 18vh;
    margin-top: 400px;
  }
}
</style>
