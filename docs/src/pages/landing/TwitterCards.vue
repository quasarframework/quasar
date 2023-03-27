<template>
  <div class="twitter-cards row no-wrap relative-position">
    <div
      class="twitter-cards__content col row items-stretch no-wrap q-pa-xl"
      ref="contentRef"
      @scroll="updateArrows"
    >
      <q-card
        v-for="tweet in tweetsList"
        :key="tweet.id"
        class="twitter-cards__entry bg-white text-dark column q-ma-md"
      >
        <q-card-section class="row items-center no-wrap">
          <q-avatar class="q-mr-sm">
            <q-img :src="tweet.avatar" />
          </q-avatar>
          <div class="col">
            <div class="text-weight-bold">{{ tweet.author }}</div>
            <div class="twitter-cards__stamp text-grey-8">@{{ tweet.handle }}</div>
          </div>
          <q-icon :name="fabTwitter" size="24px" color="blue" class="float-right" />
        </q-card-section>

        <q-card-section class="q-py-none col">
          <div>{{ tweet.message }}</div>
          <div class="twitter-cards__stamp text-grey-8 q-pt-sm">{{ tweet.stamp }}</div>
        </q-card-section>

        <q-card-section>
          <q-btn
            class="twitter-cards__read-btn text-weight-bold full-width"
            :href="tweet.link"
            target="_blank"
            label="Read on Twitter"
            size="12px"
            padding=""
            no-caps
            flat
            color="blue-8"
          />
        </q-card-section>
      </q-card>

      <q-resize-observer @resize="updateArrows" debounce="0" />
    </div>

    <div
      class="twitter-cards__arrow twitter-cards__arrow--left cursor-pointer absolute-left row items-center"
      :class="leftArrowClass"
      @click="scrollToStart"
    >
      <q-icon
        :name="mdiChevronLeft"
        size="56px"
        color="brand-primary"
      />
    </div>

    <div
      class="twitter-cards__arrow twitter-cards__arrow--right cursor-pointer absolute-right row items-center"
      :class="rightArrowClass"
      @click="scrollToEnd"
    >
      <q-icon
        :name="mdiChevronRight"
        size="56px"
        color="brand-primary"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { fabTwitter } from '@quasar/extras/fontawesome-v5'
import { mdiChevronLeft, mdiChevronRight } from '@quasar/extras/mdi-v7'

const hiddenArrowClass = 'twitter-cards__arrow--hidden'

const contentRef = ref(null)
const leftArrowClass = ref(hiddenArrowClass)
const rightArrowClass = ref(null)

function scrollToStart () {
  scrollTo(-1)
}

function scrollToEnd () {
  scrollTo(1)
}

function scrollTo (direction) {
  const el = contentRef.value
  if (el) {
    const { scrollLeft, offsetWidth } = el
    const modulo = scrollLeft % 332

    const left = direction === -1 && modulo !== 0
      ? scrollLeft - modulo
      : (
          (scrollLeft - modulo) +
          direction * 332 * Math.max(1, Math.floor(offsetWidth / 332))
        )

    el.scrollTo({ left, behavior: 'smooth' })
  }
}

let arrowsTimer, lastTime = 0

const updateArrows = () => {
  clearTimeout(arrowsTimer)
  if (Date.now() - lastTime > 150) {
    localUpdateArrows()
  }
  else {
    arrowsTimer = setTimeout(localUpdateArrows, 50)
  }
}

function localUpdateArrows () {
  const el = contentRef.value
  if (el) {
    lastTime = Date.now()
    const { scrollLeft, offsetWidth, scrollWidth } = el
    leftArrowClass.value = scrollLeft <= 0 ? hiddenArrowClass : null
    rightArrowClass.value = scrollLeft + offsetWidth >= scrollWidth ? hiddenArrowClass : null
  }
}

const tweetsList = [
  {
    author: 'Alvaro Sabu',
    handle: 'alvarosabu',
    message: 'I must say Im quite surprise how complete @quasarframework is, been working on a really complex select component and it works like charm. Very well documented.',
    stamp: '6:39 PM · Oct 16, 2020 from Terrassa, España',
    avatar: 'NVIct2bL_x96.jpg',
    id: '1317128110509379585'
  },

  {
    author: 'Dale Zak',
    handle: 'dalezak',
    message: 'Ok, I’m really impressed with the @QuasarFramework, great documentation and powerful framework for building #iOS, #Android, #PWA and #SPA apps using #VueJS https://quasar.dev 🤩',
    stamp: '7:39 PM · May 7, 2020 from Saskatoon, Saskatchewan',
    avatar: 'gz0OLObO_x96.jpg',
    id: '1258436297087086594'
  },

  {
    author: 'Gregory Luneau',
    handle: 'LuneauGregory',
    message: 'Quasar is the best thing since sliced bread.',
    stamp: '6:51 PM · May 28, 2021',
    avatar: 'nCM554Ai_x96.jpg',
    id: '1398305954882543616'
  },

  {
    author: 'Tony OHagan',
    handle: 'tony_ohagan',
    message: 'Quasar listen .. I\'ve submitted several suggestions which they acted on (😍 QSplitter, line-awesome icons and Icon genie!).  Optimised rock solid components and best docs & examples in the business save me time and money every week. #QuasarLove #quasarframework',
    stamp: '12:59 PM · Jan 20, 2022',
    avatar: 'a8_JRn1d_x96.jpg',
    id: '1484118254193094656'
  },

  {
    author: 'Marco Ruiz',
    handle: 'estados',
    message: 'I love #quasarframework because I can make great web, mobile and desktop applications with a single code base. It\'s organized and clean, has an active community, and is at the forefront of innovation. #QuasarLove  ❤',
    stamp: '10:28 PM · Jan 19, 2022',
    avatar: 'ZSyt7Dpc_x96.jpg',
    id: '1483899151129751554'
  },

  {
    author: 'Navicstein',
    handle: 'NavicsteinR',
    message: 'Very very ahead, i wish there could be a world blaster to notify all Vue users that a framework like quasar exist!',
    stamp: '10:28 PM · Jan 19, 2022',
    avatar: 'uTY9chHX_x96.jpg',
    id: '1189641922182307840'
  },

  {
    author: 'programmerq.wallet',
    handle: 'Qoyyuum',
    message: 'I love how #quasarframework is so versatile. Easy copy and paste components and UI elements (especially for a crappy designer like me) and quick x-platform deploy is amazingly easy! #QuasarLove',
    stamp: '11:49 AM · Jan 19, 2022',
    avatar: 'ZgJxRWD9_x96.jpg',
    id: '1483738286128758785'
  },

  {
    author: 'Mauricio Etcheverry',
    handle: 'maurietchev',
    message: 'I\'m gonna marry @quasarframework. It was love at first sight ♥️♥️♥️',
    stamp: '4:25 PM · Dec 23, 2019',
    avatar: 'nZ2PbTV1_x96.jpg',
    id: '1209117858904629248'
  },

  {
    author: 'radioActive DROID',
    handle: 'gpproton',
    message: 'Quasar really save you from toiling away with third party dependencies #QuasarLove #quasarframework',
    stamp: '2:06 PM · Jan 19, 2022',
    avatar: 'wTSVDHBO_x96.jpg',
    id: '1483772969822343168'
  },

  {
    author: 'Ali Ataf',
    handle: 'AliAttaf1',
    message: 'There is no situation I needed to make an !important override to the Quasar framework. It\'s just there, everything you will face will already be in their consideration. #QuasarLove #quasarframework',
    stamp: '9:19 PM · Jan 22, 2022',
    avatar: 'jDxh4Bi5_x96.png',
    id: '1484969068218265611'
  },

  {
    author: 'Shawn Makinson',
    handle: 'smakinson',
    message: 'I\'ve used #quasarframework for websites, mobile & interactive touch via electron for museum & welcome center display. It\'s flexible, reliable, powerful and fast. Thank you Razvan & team as well as the community! #QuasarLove',
    stamp: '8:32 PM · Jan 20, 2022',
    avatar: 'Photo_9_x96.jpg',
    id: '1484232499136016392'
  },

  {
    author: 'Simon Swain',
    handle: 'simon_swain',
    message: 'Gotta throw some love out there for @quasarframework -- it really does make things stupidly easy and fast to build.',
    stamp: '9:23 AM · Sep 2, 2020',
    avatar: 'FhA-7oua_x96.jpeg',
    id: '1301043009987866624'
  },

  {
    author: 'hyranity',
    handle: 'hyranity',
    message: 'Code faster and smarter with the best Vue framework. Your brain will thank you. #quasarframework. #QuasarLove',
    stamp: '2:51 PM · Jan 19, 2022',
    avatar: 'R8iWV7es_x96.jpg',
    id: '1483784231017148420'
  }
].map(entry => ({
  ...entry,
  avatar: `https://cdn.quasar.dev/img/tweets/${ entry.avatar }`,
  link: `https://twitter.com/${ entry.handle }/status/${ entry.id }`
}))
</script>

<style lang="sass">
.twitter-cards
  margin-left: -24px
  margin-right: -24px

  &__content
    overflow: hidden

  &__entry
    border-radius: 14px
    box-shadow: 0 24px 24px 0 rgba(0,179,255,0.24)
    min-width: 300px
    width: 300px
    max-width: 80vw

  &__stamp
    font-size: .8em

  &__read-btn
    border-radius: 9999px
    border: 1px solid rgb(207, 217, 222) !important
    box-shadow: none !important

  &__arrow
    transition: opacity .5s ease-in-out
    &--left
      background: linear-gradient(to right, $dark-bg 0%, $dark-bg 5%, transparent 100%)
    &--right
      background: linear-gradient(to left, $dark-bg 0%, $dark-bg 5%, transparent 100%)
    &--hidden
      opacity: 0

body.mobile .twitter-cards__content
  overflow: auto
</style>
