<template>
  <q-page class="text-white q-mx-lg">
    <div class="column items-center intro-section letter-spacing-300">
      <q-img src="~assets/landing-page/quasar-logo/logo-with-payoff.svg" width="250px" />

      <h1
        :class="$q.screen.gt.md? 'letter-spacing-375':'letter-spacing-300'"
        class="lp-my--medium text-center text-white-54 text-size-20 primary-line-height"
      >
        The enterprise-ready cross-platform VueJs framework
      </h1>

      <q-btn
        color="lp-accent"
        label="Are you ready to lift off?"
        class="call-to-action-btn shadow-bottom-small"
        @click="scrollSectionIntoView('why-quasar-section')"
      />

      <q-btn
        flat
        round
        icon="arrow_downward"
        class="text-white q-mt-md"
        size="lg"
        padding="none"
        @click="scrollSectionIntoView('why-quasar-section')"
      />

      <div class="intro-section__sponsors-heading q-mt-xl text-weight-bold text-lp-primary text-size-16 text-capitalize">Our Platinum sponsors</div>
      <sponsor-link
        v-for="({src, href}, platinumSponsorIndex) in sponsorLogos.platinum"
        :key="platinumSponsorIndex"
        :href="href"
        :src="src"
      />
      <q-btn
        flat
        padding="none"
        text-color="white-54"
        no-caps
        label="Full sponsor's list"
        class="lp-btn-underline text-size-16 letter-spacing-300"
        @click="scrollSectionIntoView('sponsors-section')"
      />
    </div>

    <div class="q-my-xl" id="why-quasar-section">
      <h2 class="lp-heading lp-heading--large">Why should you choose quasar?</h2>

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
      <div class="column items-center">
        <div class="support-quasar-section__container">
          <h2
            class="text-uppercase lp-heading--large support-quasar-section__title"
          >SPONSOR QUASAR, HELP THE PROJECT GROW!</h2>

          <div
            class="lp-heading--small text-left"
          >Working for a company? Are you a freelancer? You can contribute, even a bit, <br> and even get something back in return.</div>

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
          :img-style="{ width: '102%' }"
          class="astronaut-hand--right"
          width="50%"
          src="~assets/landing-page/homepage-background-images/astronaut-right-hand.png"
        />
      </div>
    </div>

    <div class="text-center sponsors-section" id="sponsors-section">
      <q-icon size="xl" name="img:homepage-icons/medal.svg" />
      <h2 class="lp-heading lp-heading--large">Our Sponsors</h2>
      <div class="lp-heading lp-heading--small">Every space odyssey has its patrons</div>
      <div class="row justify-center text-size-16 text-weight-bold">
        <div class="sponsors-section__logos">
          <div class="q-mt-xl q-mb-md letter-spacing-300">Platinum Sponsors</div>
          <sponsor-link
            v-for="({src, href}, platinumSponsorIndex) in sponsorLogos.platinum"
            :key="platinumSponsorIndex"
            :href="`https://${href}`"
            :src="src"
          />
          <div class="q-my-md letter-spacing-300">Silver Sponsors</div>
          <sponsor-link
            v-for="({src, href}, silverSponsorIndex) in sponsorLogos.silver"
            :key="silverSponsorIndex"
            :href="`https://${href}`"
            :src="src"
          />
        </div>
      </div>
    </div>

    <div class="text-center social-channels-call-to-action lp-mb--large">
      <q-img
        src="~assets/landing-page/homepage-background-images/planet.png"
        :height="$q.screen.lt.md ? '80vh' : ''"
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
              class="call-to-action-btn no-border-radius"
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
import { scroll, useMeta } from 'quasar'
import SponsorLink from 'components/landing-page/SponsorLink'

const { getScrollTarget, setVerticalScrollPosition } = scroll
function scrollToElement (el) {
  const target = getScrollTarget(el)
  const offset = el.offsetTop
  const duration = 400
  setVerticalScrollPosition(target, offset, duration)
}

export default defineComponent({
  name: 'Index',
  components: { SponsorLink, TwitterShowcaseCards, WhyQuasarCard },
  setup () {
    useMeta({
      title: 'Quasar Framework',
      titleTemplate: ''
    })
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
      margin-top: -400px;
    }
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
  &__container {
    margin: 0 24px 0 24px;
  }
  &__title {
    margin-top: 256px;
  }
}
.sponsors-section {
  margin-top: 200px;

  @media screen and (min-width: $breakpoint-md-max) {
    // 100vh - header height
    height: calc(100vh - 156px);
    margin-top: 400px;
  }

  &__logos {
    @media screen and (min-width: $breakpoint-md-min) {
      // we want to have about 4 logos per row
      width: calc(100vw/1.5);
    }
  }
}

.intro-section {
  margin-top: 60px;
  margin-bottom: 208px;

  @media screen and (min-height: 980px) {
    margin-top: 100px;

    &__sponsors-heading {
      margin-top: 80px !important;
    }
  }
}

// We need a thickness of 2px but the default is 1px, and there's no
// prop to modify it from within quasar
:deep(.q-btn--outline:before) {
  border: 2px solid $lp-accent;
  box-shadow: 0 1px 1px 0 rgba($black, 0.12);
}
</style>
