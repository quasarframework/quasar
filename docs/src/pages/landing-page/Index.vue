<template>
  <q-page class="text-white">
    <div class="row justify-end q-pa-md">
      <q-btn :icon="fabGithub" flat color="lp-primary" round size="md" />
      <q-btn color="lp-primary" flat icon="message" round size="md" />
      <q-btn color="lp-primary" flat icon="forum" round size="md" />
      <q-btn :icon="fabTwitter" color="lp-primary" flat round size="md" />
      <q-btn
        :icon="fabFacebookSquare"
        color="lp-primary"
        flat
        round
        size="md"
      />
    </div>

    <div class="row flex-center q-my-xl">
      <div class="col-6 column items-center text-center about">
        <div class="about-img">
          <div style="height: 250px; width: 250px;">
            <q-img
              src="~assets/landing-page/quasar-logo/QUASAR_logo_with_payoff_dark_background_RGB.svg"
            />
          </div>
        </div>

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

    <div class="q-mt-sm">
      <div class="text-lp-primary text-center text-size-16 text-capitalize">
        Our platform sponsors
      </div>
      <div class="sponsors row justify-center">
        <div class="col-8 column items-center">
          <div class="row items-center justify-center q-py-md">
            <div style="width: 200px;">
              <q-img
                src="~assets/landing-page/sponsor-logo/Quasar_sponsor_logos_dreamonkey_RGB_EX.png"
              />
            </div>
            <div style="width: 200px;">
              <q-img
                src="~assets\landing-page\sponsor-logo\Quasar_sponsor_logos_comcomservices_RGB_EX.png"
              />
            </div>
            <div style="width: 200px;">
              <q-img
                src="~assets\landing-page\sponsor-logo\Quasar_sponsor_logos_projectFinance_RGB_EX.png"
              />
            </div>
            <div style="width: 200px;">
              <q-img
                src="~assets\landing-page\sponsor-logo\Quasar_sponsor_logos_Debricked_RGB_EX.png"
              />
            </div>
            <div style="width: 200px;">
              <q-img
                src="~assets\landing-page\sponsor-logo\Quasar_sponsor_logos_digitalOcean_RGB_EX.png"
              />
            </div>
          </div>
          <q-btn
            flat
            padding="none"
            text-color="lp-light"
            no-caps
            label="Full sponsor's list"
            class="text-size-16 lp-btn-underline"
          />
        </div>
      </div>
    </div>

    <div class="why-us q-my-xl q-py-xl">
      <div class="text-uppercase text-lp-primary text-size-36 text-weight-bold text-center q-pb-xl">
        Why should your team choose quasar?
      </div>

      <div class="row justify-center">
        <div class="col-8 row">
          <div class="col">
            <div class="row q-col-gutter-md">
              <div class="col-4">
                <q-card class="q-pa-lg text-center column justify-between items-center full-height shadow-bottom-large">
                  <q-card-section class="q-pa-none">
                    <q-icon size="xl" name="img:homepage-icons/QUASAR_icons_components_RGB_EX.svg"/>
                    <div class="text-uppercase text-bold text-lp-primary text-size-24 q-py-md">
                      Top class components
                    </div>
                    <div class="text-lp-light text-size-16 text-weight-medium q-pb-md">
                      A library of more than 70 high performance customizable
                      Material Design web components for all your needs
                    </div>
                  </q-card-section>

                  <q-card-section class="q-pa-none">
                    <q-btn
                      outline
                      class="text-size-14"
                      color="lp-accent"
                      label="Consult library"
                    />
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-4">
                <q-card
                  class="full-height q-pa-lg text-center column justify-between items-center shadow-bottom-large"
                >
                  <q-card-section class="q-pa-none">
                    <q-icon
                      size="xl"
                      name="img:homepage-icons/QUASAR_icons_components_RGB_EX.svg"
                    />

                    <div
                      class="text-uppercase text-bold text-lp-primary text-size-24 q-py-md"
                    >
                      One codebase many interactions
                    </div>

                    <div
                      class="text-lp-light text-size-16 text-weight-medium q-pb-md"
                    >
                      Keep your favorite technology, we provide all the needed
                      integrations out of the box.
                    </div>
                  </q-card-section>

                  <q-card-section class="q-pa-none">
                    <q-btn
                      outline
                      class="text-size-14"
                      color="lp-accent"
                      label="Consult library"
                    />
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-4">
                <q-card
                  class="full-height q-pa-lg text-center column justify-between items-center shadow-bottom-large"
                >
                  <q-card-section class="q-pa-none">
                    <q-icon
                      size="xl"
                      name="img:homepage-icons/QUASAR_icons_documentation_RGB_EX.svg"
                    />

                    <div
                      class="text-uppercase text-bold text-lp-primary text-size-24 q-py-md"
                    >
                      Great documentation
                    </div>

                    <div
                      class="text-lp-light text-size-16 text-weight-medium q-pb-md"
                    >
                      All the details you deserve to start working properly.
                      Every star-pilot needs a good manual.
                    </div>
                  </q-card-section>

                  <q-card-section class="q-pa-none">
                    <q-btn
                      outline
                      class="text-size-14"
                      color="lp-accent"
                      label="Consult library"
                    />
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="q-mt-xl column items-center">
        <div
          class="text-center text-size-24 text-uppercase text-lp-primary text-weight-bold"
        >
          Still Doubtful?
        </div>

        <div
          class="text-center text-size-20 text-lp-light text-weight-medium q-pb-md"
        >
          "This framework's got a few surprises left in it, sweetheart!"
        </div>

        <div>
          <q-btn
            color="lp-accent"
            class="shadow-bottom-small"
            label="Find out more"
          />
        </div>
      </div>
    </div>

    <div class="window-height row justify-center items-end"  style="padding-bottom: 120px;">
      <div class="col-9 relative-position" style="padding-bottom: 120px;">
        <q-img
          src="~assets\landing-page\homepage-background-images\QUASAR_astronaut_AdobeStock_409184273_EX.jpg"
        />
        <div
          class="column items-end"
          style="position: absolute; bottom: 0; right: 0;"
        >
          <div
            class="text-right text-size-36 text-lp-primary text-uppercase text-weight-bold"
          >
            Advanced scaffolding
          </div>

          <div class="text-right text-size-20 text-lp-light text-weight-medium">
            Get all you need to setup your project basic
            <span style="display: block;">features and save time</span>
          </div>

          <div class="text-size-16 text-lp-primary q-pb-lg q-pt-sm">
            <q>He who controls Scaffolding, controls the universe</q>
          </div>

          <div>
            <q-btn
              class="shadow-bottom-small q-mb-xl"
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
          <div class="q-pb-lg">
            <q-icon
              size="xl"
              name="img:homepage-icons/QUASAR_icons_astronaut_RGB_EX.svg"
            />
          </div>
          <div
            class="text-center text-size-36 text-lp-primary text-uppercase text-weight-bold"
          >
            What our community thinks of quasar
          </div>
          <div class="text-size-20 text-lp-light text-weight-medium q-py-lg">
            "You've never heard of Quasar? It's the framework that made a mobile
            app, desktop app and browser extension altogether in less than
            12minutes."
          </div>
        </div>
      </div>

<!--      twitter card carousel here -->
    </div>

    <div class="support row justify-center relative-position" style="height: 120vh">
      <div class="col-8 q-pt-xl">
        <div class="text-size-36 text-lp-primary text-uppercase text-weight-bold">
          Support quasar: Become sponsor!
        </div>

        <div class="q-py-lg text-size-20 text-lp-light text-weight-medium">
          Working for a company or freelancer? You can contribute, ever a bit and getting something back.
        </div>

        <div class="q-pb-lg text-lp-primary">
          <q>So, um, we think we should discuss the bonus situation</q>
        </div>

        <q-btn
          color="lp-accent"
          label="Consult tiers"
          padding="sm"
          class="text-size-14 text-bold shadow-bottom-small"
        />
      </div>

      <div style="width: 50%; position: absolute; left: 0; bottom: 0">
        <q-img src="~assets/landing-page/homepage-background-images/QUASAR_astronaut_left_hand_AdobeStock_136022359_EX.png" />
      </div>
      <div style="width: 50%; position: absolute; right: 0; top: 0">
        <q-img src="~assets/landing-page/homepage-background-images/QUASAR_astronaut_right_hand_AdobeStock_136022359_EX.png" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import {
  fabGithub,
  fabTwitter,
  fabFacebookSquare
} from '@quasar/extras/fontawesome-v5'

export default defineComponent({
  name: 'Index',
  setup () {
    return {
      fabGithub,
      fabTwitter,
      fabFacebookSquare
    }
  }
})
</script>

<style scoped lang="scss">
.lp-btn-underline {
  border-bottom: 1px solid $lp-light;
}
</style>
