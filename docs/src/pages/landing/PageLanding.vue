<template>
  <div class="landing-page q-px-lg doc-brand">
    <DocStars />

    <div>
      <div class="column items-center intro-section letter-spacing-300">
        <q-img
          :src="`/logo/logo-vertical${$q.dark.isActive ? '-dark' : ''}.svg`"
          alt="Quasar logo"
          loading="eager"
          width="250px"
          height="255px"
        />

        <h1
          class="letter-spacing-375 landing-my-large text-center text-size-20 primary-line-height"
        >
          <span class="block">Enterprise-ready. AI-ready.</span>
          <span class="block">The cross-platform Vue.js framework.</span>
        </h1>

        <div
          class="intro-section__command row no-wrap items-center call-to-action-btn shadow-bottom-small rounded-borders"
        >
          <code class="col text-size-12">{{ createCommand }}</code>
          <q-btn
            flat
            round
            dense
            :icon="copied ? 'check' : 'content_copy'"
            :aria-label="copied ? 'Copied' : 'Copy the command'"
            @click="copyCommand"
          />
        </div>

        <q-btn
          flat
          round
          icon="arrow_downward"
          class="q-mt-md"
          size="lg"
          padding="none"
          aria-label="Scroll to the next section"
          @click="scrollSectionIntoView.whyQuasar"
        />

        <h2
          class="intro-section__sponsors-heading q-mt-xl q-mb-none text-weight-bold text-brand-primary text-size-16 text-capitalize"
        >
          Our Platinum sponsor
        </h2>
        <div class="row justify-center full-width">
          <SponsorTile
            v-for="(
              { src, name, href }, platinumSponsorIndex
            ) in sponsors.platinum"
            :key="platinumSponsorIndex"
            :src="src"
            :name="name"
            :href="href"
          />
        </div>
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

        <div class="why-quasar-cards">
          <why-quasar-card
            v-for="(
              { icon, title, body, btnLabel, btnLink }, whyQuasarCardIndex
            ) in whyQuasar"
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
          <q-icon size="xl" name="img:/svg/astronaut.svg" />
          <h2 class="heading heading--large q-my-lg"
            >What our community thinks of Quasar</h2
          >
          <q class="heading heading--small">
            You've never heard of Quasar? It's the framework that made a mobile
            app,
            <br />desktop app and browser extension altogether in less than 12
            minutes.
          </q>
        </div>

        <twitter-cards class="q-mt-xl" />
      </div>

      <div class="support-quasar-section q-px-lg row justify-center">
        <div class="support-quasar-section__content">
          <h2
            class="text-uppercase heading--large support-quasar-section__title"
            >SPONSOR QUASAR, HELP THE PROJECT GROW!</h2
          >

          <div class="heading--small">
            Working for a company? Are you a freelancer? You can contribute,
            even a bit, and even get something back in return.
          </div>

          <q class="q-my-md heading--quote primary-line-height landing-my-large"
            >So, um, we think we should discuss the bonus situation</q
          >

          <q-btn
            label="Consult tiers"
            class="call-to-action-btn shadow-bottom-small"
            href="https://donate.quasar.dev"
            target="_blank"
          />
        </div>
      </div>

      <div class="text-center sponsors-section" id="sponsors-section">
        <q-icon size="xl" name="img:/svg/medal.svg" />
        <h2 class="heading heading--large">Our Sponsors</h2>
        <div class="heading heading--small"
          >Every space odyssey has its patrons</div
        >
        <div class="q-pt-lg">
          <SponsorList />
        </div>
      </div>

      <div class="text-center social-channels-call-to-action">
        <q-img src="/landing/planet.png" height="600px">
          <div class="bg-transparent absolute-bottom">
            <q-icon size="xl" name="img:/svg/satellite.svg" />
            <h2 class="heading heading--large">Don't miss the news</h2>
            <div class="heading heading--small"
              >Follow our social pages to stay up to date</div
            >
            <div
              class="landing-mb--large row reverse justify-center q-mt-md q-gutter-md"
            >
              <q-btn
                v-for="(socialLink, linkIndex) in socialLinks.children.slice(1)"
                :key="linkIndex"
                :label="socialLink.name"
                class="call-to-action-btn no-border-radius"
                color="brand-accent"
                outline
                :href="socialLink.path"
                target="_blank"
              />
            </div>
          </div>
        </q-img>
      </div>
    </div>
  </div>
</template>

<script setup>
import { copyToClipboard, scroll, useMeta } from 'quasar'
import { ref } from 'vue'

import DocStars from '@/components/DocStars.vue'
import SponsorList from './SponsorList.vue'
import TwitterCards from './TwitterCards.vue'
import WhyQuasarCard from './WhyQuasarCard.vue'
import SponsorTile from '../sponsors-and-backers/SponsorTile.vue'

import { socialLinks } from '@/assets/links.social.js'
import { sponsors } from '@/assets/sponsors.js'

import { useDocStore } from '@/layouts/doc-layout/store/index.js'

const docStore = useDocStore()
docStore.setToc()

useMeta({
  title: 'Quasar Framework',
  titleTemplate: ''
})

const whyQuasar = [
  {
    icon: 'img:/svg/source.svg',
    title: 'All platforms, one codebase',
    body: 'SPA, SSR, SSG, PWA, browser extension, mobile and desktop apps from the same code, with a CLI that ties the build modes together.',
    btnLabel: 'Start with the CLI',
    btnLink: '/start/quasar-cli'
  },
  {
    icon: 'img:/svg/components.svg',
    title: 'Accessible components',
    body: 'More than 120 fast Vue.js components with WAI-ARIA semantics, keyboard navigation and focus management built in.',
    btnLabel: 'Browse components',
    btnLink: '/components'
  },
  {
    icon: 'img:/svg/satellite.svg',
    title: 'Built for AI agents',
    body: 'The docs and API ship inside the packages: an MCP server hands your coding agent the exact versions your project runs, offline.',
    btnLabel: 'Set up your agent',
    btnLink: '/start/ai-agents'
  },
  {
    icon: 'img:/svg/documentation.svg',
    title: 'Great documentation',
    body: 'Live examples and a full API for every component, plugin and build mode, kept in step with each release. Every star-pilot needs a good manual.',
    btnLabel: 'Get started',
    btnLink: '/start/quick-start'
  }
]

function goToSection(sectionId) {
  const el = document.getElementById(sectionId)
  if (el) scroll.setVerticalScrollPosition(window, el.offsetTop, 400)
}

const createCommand = 'pnpm create quasar@latest'
const copied = ref(false)
let copiedTimer = null

function copyCommand() {
  copyToClipboard(createCommand).then(() => {
    copied.value = true
    clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}

const scrollSectionIntoView = {
  whyQuasar: () => goToSection('why-quasar-section'),
  sponsors: () => goToSection('sponsors-section')
}
</script>

<style lang="sass">
@use 'sass:math'

$support-quasar-background-padding: 35vw

.landing-page
  color: #000

  .btn-underline
    border-bottom: 1px solid rgba(#fff, 0.54)

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
      background-image: url(/landing/astronaut-left-hand.png), url(/landing/astronaut-right-hand.png)
      background-size: 47%, 47%
      background-position: left bottom, calc(100% + 25px) calc(100% - #{math.div($support-quasar-background-padding, 3)})
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

  .intro-section
    margin-top: 60px
    margin-bottom: 208px

    &__command
      max-width: 100%
      margin-bottom: 32px
      padding: 4px 4px 4px 14px

      code
        font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace
        padding-right: 12px

  // four cards in a row where they fit, two by two below that, then a column
  .why-quasar-cards
    display: flex
    flex-wrap: wrap
    justify-content: center
    gap: 24px
    margin: 0 auto
    max-width: 1352px // 4 cards + 3 gaps

    @media (max-width: 1420px)
      max-width: 664px // 2 cards + 1 gap

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

body.body--dark .landing-page
  color: #fff
</style>
