<template>
  <q-page class="text-white">

    <div class="row flex-center q-my-xl">
      <div class="col-6 column items-center text-center about">
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
        <template v-for="(src, i) in sponsorLogos" :key="i">
          <q-img :src="src" width="200px"/>
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
      <div class="lp-heading lp-heading-large q-mb-xl">
        Why should your team choose quasar?
      </div>

      <div class="row justify-center">
        <div class="col-8 row">
          <div class="col">
            <div class="row q-col-gutter-md">
              <template v-for="({icon, title, body, btnLabel, btnLink}, i) in whyQuasar" :key="i">
                <div class="col-4" >
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
          class="lp-heading lp-heading-medium">
          Still Doubtful?
        </div>

        <div class="lp-heading lp-heading-small">
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

    <div class="window-height row justify-center items-end">
      <div class="col-9 relative-position">
        <q-img src="~assets\landing-page\homepage-background-images\astronaut-on-moon.jpg" />
        <div class="column items-end absolute-bottom-right">
          <div class="lp-heading lp-heading-large text-right">
            Advanced scaffolding
          </div>

          <div class="text-right lp-heading-small q-mb-md">
            Get all you need to setup your project basic
            <span class="block">features and save time</span>
          </div>

          <div class="lp-heading-quote">
            <q>He who controls Scaffolding, controls the universe</q>
          </div>

          <div>
            <q-btn
              class="shadow-bottom-small lg-mb-large q-mt-md"
              color="lp-accent"
              label="Consult pricing"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="community window-height">
      <div class="row justify-center">
        <div class="col-8 text-center">
          <q-icon
            size="xl"
            name="img:homepage-icons/astronaut.svg"
          />
          <div class="lp-heading lp-heading-large">
            What our community thinks of quasar
          </div>
          <div class="text-size-20 text-lp-light text-weight-medium">
            "You've never heard of Quasar? It's the framework that made a mobile
            app, desktop app and browser extension altogether in less than
            12minutes."
          </div>
        </div>
      </div>
    </div>

    <div class="support row justify-center relative-position" >
      <div class="col-8">
        <div class="lp-heading-large">
          Support quasar: Become sponsor!
        </div>

        <div class="lp-heading-small text-left">
          Working for a company or freelancer? You can contribute, ever a bit and getting something back.
        </div>

        <div class="q-my-md lp-heading-quote">
          <q>So, um, we think we should discuss the bonus situation</q>
        </div>

        <q-btn
          color="lp-accent"
          label="Consult tiers"
          padding="sm"
          class="text-size-14 text-bold shadow-bottom-small"
        />
      </div>

      <q-img class="absolute-bottom" width="50%" src="~assets/landing-page/homepage-background-images/astronaut-left-hand.png" />
      <q-img width="50%" class="absolute-top-right" src="~assets/landing-page/homepage-background-images/astronaut-right-hand.png" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import WhyQuasarCard from 'src/components/landing-page/WhyQuasarCard'
import { sponsorLogos, whyQuasar } from '../../assets/landing-page/image-links.ts'

export default defineComponent({
  name: 'Index',
  components: { WhyQuasarCard },
  setup () {
    return {
      whyQuasar,
      sponsorLogos
    }
  }
})
</script>

<style scoped lang="scss">
.lp-btn-underline {
  border-bottom: 1px solid $lp-light;
}

.support {
  height: 100vh;
}
</style>
