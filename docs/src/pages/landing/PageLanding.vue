<template>
  <div class="landing-page q-px-lg doc-brand">
    <doc-stars />

    <div>
      <div class="column items-center intro-section letter-spacing-300">
        <q-img src="https://cdn.quasar.dev/logo-v2/svg/logo-vertical-dark.svg" width="250px" height="255px" />

        <h1 class="letter-spacing-375 landing-my-large text-center text-white text-size-20 primary-line-height">
          The enterprise-ready cross-platform VueJs framework
        </h1>

        <q-btn
          label="Are you ready to lift off?"
          class="call-to-action-btn shadow-bottom-small"
          @click="scrollSectionIntoView.whyQuasar"
        />

        <q-btn
          flat
          round
          icon="arrow_downward"
          class="text-white q-mt-md"
          size="lg"
          padding="none"
          @click="scrollSectionIntoView.whyQuasar"
        />

        <div class="intro-section__sponsors-heading q-mt-xl text-weight-bold text-brand-primary text-size-16 text-capitalize">
          Our Platinum sponsors
        </div>
        <sponsor-tile
          v-for="({src, name, href}, platinumSponsorIndex) in sponsors.platinum"
          :key="platinumSponsorIndex"
          :src="src"
          :name="name"
          :href="href"
        />
        <q-btn
          flat
          padding="0 8px"
          text-color="white-54"
          no-caps
          label="Full sponsor's list"
          class="btn-underline text-size-16 letter-spacing-300"
          @click="scrollSectionIntoView.sponsors"
        />
      </div>

      <div class="q-my-xl" id="why-quasar-section">
        <h2 class="heading heading--large">Why should you choose Quasar?</h2>

        <div class="q-gutter-lg row justify-center">
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
          <q-icon size="xl" name="img:https://cdn.quasar.dev/img/custom-svg-icons/astronaut.svg" />
          <h2 class="heading heading--large q-my-lg">What our community thinks of Quasar</h2>
          <q class="heading heading--small">
            You've never heard of Quasar? It's the framework that made a mobile app,
            <br />desktop app and browser extension altogether in less than 12 minutes.
          </q>
        </div>

        <twitter-cards class="q-mt-xl" />
      </div>

      <div class="support-quasar-section q-px-lg row justify-center">
        <div class="support-quasar-section__content">
          <h2
            class="text-uppercase heading--large support-quasar-section__title"
          >SPONSOR QUASAR, HELP THE PROJECT GROW!</h2>

          <div class="heading--small">
            Working for a company? Are you a freelancer? You can contribute, even a bit,
            and even get something back in return.
          </div>

          <q
            class="q-my-md heading--quote primary-line-height landing-my-large"
          >So, um, we think we should discuss the bonus situation</q>

          <q-btn
            label="Consult tiers"
            class="call-to-action-btn shadow-bottom-small"
            href="https://donate.quasar.dev"
            target="_blank"
          />
        </div>
      </div>

      <div class="text-center sponsors-section" id="sponsors-section">
        <q-icon size="xl" name="img:https://cdn.quasar.dev/img/custom-svg-icons/medal.svg" />
        <h2 class="heading heading--large">Our Sponsors</h2>
        <div class="heading heading--small">Every space odyssey has its patrons</div>
        <div class="q-pt-lg">
          <sponsor-list />
        </div>
      </div>

      <div class="text-center social-channels-call-to-action">
        <q-img
          src="https://cdn.quasar.dev/img/landing-page/planet.png"
          height="600px"
        >
          <div class="bg-transparent absolute-bottom">
            <q-icon size="xl" name="img:https://cdn.quasar.dev/img/custom-svg-icons/satellite.svg" />
            <div class="heading heading--large">Don't miss the news</div>
            <div class="heading heading--small">Follow our social pages to stay up to date</div>
            <div class="landing-mb--large row reverse justify-center q-mt-md q-gutter-md">
              <q-btn
                v-for="(socialLink, linkIndex) in socialLinks.children.slice(1)"
                :key="linkIndex"
                :label="socialLink.name"
                class="call-to-action-btn no-border-radius"
                color="brand-accent"
                outline
                :href="socialLink.path"
                target="__blank"
              />
            </div>
          </div>
        </q-img>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMeta, scroll } from 'quasar'

import DocStars from 'src/components/DocStars.vue'
import SponsorList from './SponsorList.vue'
import TwitterCards from './TwitterCards.vue'
import WhyQuasarCard from './WhyQuasarCard.vue'
import SponsorTile from '../sponsors-and-backers/SponsorTile.vue'

import { socialLinks } from 'src/assets/links.social'
import { sponsors } from 'src/assets/sponsors'

useMeta({
  title: 'Quasar Framework',
  titleTemplate: ''
})

const whyQuasar = [
  {
    icon: 'img:https://cdn.quasar.dev/img/custom-svg-icons/components.svg',
    title: 'Top Class Components',
    body: 'A library of more than 70 high performance customizable Material Design web components for all your needs',
    btnLabel: 'Browse components',
    btnLink: '/components'
  },
  {
    icon: 'img:https://cdn.quasar.dev/img/custom-svg-icons/source.svg',
    title: 'One codebase many integrations',
    body: 'Keep your favorite technology, we provide all the needed integrations out of the box.',
    btnLabel: 'Discover Integrations',
    btnLink: '/integrations'
  },
  {
    icon: 'img:https://cdn.quasar.dev/img/custom-svg-icons/documentation.svg',
    title: 'Great documentation',
    body: 'All the details you deserve to start working properly. Every star-pilot needs a good manual.',
    btnLabel: 'Get Started',
    btnLink: '/start/quick-start'
  }
]

function goToSection (sectionId) {
  const el = document.getElementById(sectionId)
  el && scroll.setVerticalScrollPosition(window, el.offsetTop, 400)
}

const scrollSectionIntoView = {
  whyQuasar: () => goToSection('why-quasar-section'),
  sponsors: () => goToSection('sponsors-section')
}
</script>

<style lang="sass">
$support-quasar-background-padding: 35vw

.landing-page

  .btn-underline
    border-bottom: 1px solid rgba($color: white, $alpha: 0.54)

  .social-channels-call-to-action
    // undo margin from q-page
    margin: 0 -24px 0 -24px

  q
    display: block

  .sponsors
    margin-top: 80px
    margin-bottom: 208px

    &__list
      margin-bottom: 208px

  .showcase-section
    margin-top: 258px

  // The pseudo-element expands to the full height and width of the container,
  // the container padding is needed to allow to display the hands without cropping
  .support-quasar-section
    padding-top: 256px
    padding-bottom: $support-quasar-background-padding
    position: relative

    &:before
      background-image: url(https://cdn.quasar.dev/img/landing-page/astronaut-left-hand.png), url(https://cdn.quasar.dev/img/landing-page/astronaut-right-hand.png)
      background-size: 47%, 47%
      background-position: left bottom, calc(100% + 25px) calc(100% - #{$support-quasar-background-padding / 3})
      background-repeat: no-repeat, no-repeat
      bottom: 0px
      content: ''
      left: -24px
      position: absolute
      right: -24px
      top: 0px

    &__content
      width: 940px
      max-width: 90vw

  .sponsors-section
    margin-top: 200px

    @media screen and (min-width: $breakpoint-md-max)
      height: calc(100vh - $header-height)

  .intro-section
    margin-top: 60px
    margin-bottom: 208px

    @media screen and (min-height: 980px)
      margin-top: 100px

      &__sponsors-heading
        margin-top: 80px !important

  h2
    line-height: 1.5em

  // We need a thickness of 2px but the default is 1px, and there's no
  // prop to modify it from within quasar
  .q-btn--outline:before
    border: 2px solid $brand-accent
    box-shadow: 0 1px 1px 0 rgba(#000, 0.12)
</style>
