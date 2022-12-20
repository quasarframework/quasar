<template>
  <div class="twitter-cards row no-wrap relative-position">
    <div
      class="col overflow-hidden row items-center no-wrap q-pa-xl"
      ref="contentRef"
      @scroll="onScroll"
    >
      <q-card
        v-for="tweet in tweetsList"
        :key="tweet.id"
        class="twitter-cards__entry bg-white text-dark column q-ma-md"
      >
        <q-card-section class="row no-wrap">
          <div class="col">
            <div class="text-weight-bold">{{ tweet.author }}</div>
            <div class="text-grey">@{{ tweet.handle }}</div>
          </div>
          <q-icon :name="fabTwitter" size="24px" color="blue" class="float-right" />
        </q-card-section>

        <q-card-section class="q-py-none">
          {{ tweet.message }}
        </q-card-section>

        <q-card-section class="row justify-center">
          <q-btn
            :href="tweet.link"
            target="_blank"
            label="Read on Twitter"
            no-caps
            flat
            color="blue"
          />
        </q-card-section>
      </q-card>
    </div>

    <div
      class="twitter-cards__left-arrow cursor-pointer absolute-left row items-center"
      @mousedown.passive="scrollToStart"
      @touchstart.passive="scrollToStart"
      @mouseup.passive="stopAnimScroll"
      @mouseleave.passive="stopAnimScroll"
      @touchend.passive="stopAnimScroll"
    >
      <q-icon
        :name="mdiChevronLeft"
        size="56px"
        color="brand-primary"
      />
    </div>

    <div
      class="twitter-cards__right-arrow cursor-pointer absolute-right row items-center"
      @mousedown.passive="scrollToEnd"
      @touchstart.passive="scrollToEnd"
      @mouseup.passive="stopAnimScroll"
      @mouseleave.passive="stopAnimScroll"
      @touchend.passive="stopAnimScroll"
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

let scrollTimer
const contentRef = ref(null)

function animScrollTo (value) {
  stopAnimScroll()
  scrollTimer = setInterval(() => {
    if (scrollTowards(value) === true) {
      stopAnimScroll()
    }
  }, 5)
}

function scrollToStart () {
  animScrollTo(0)
}

function scrollToEnd () {
  animScrollTo(Number.MAX_SAFE_INTEGER)
}

function scrollTowards (value) {
  const content = contentRef.value

  let
    done = false,
    pos = content.scrollLeft

  const direction = value < pos ? -1 : 1

  pos += direction * 5

  if (pos < 0) {
    done = true
    pos = 0
  }
  else if (
    (direction === -1 && pos <= value) ||
    (direction === 1 && pos >= value)
  ) {
    done = true
    pos = value
  }

  content.scrollLeft = pos
  return done
}

function stopAnimScroll () {
  clearInterval(scrollTimer)
}

function onScroll () {
  //
}

const tweetsList = [
  {
    author: 'Alvaro Sabu',
    handle: 'alvarosabu',
    message: 'I must say Im quite surprise how complete @quasarframework is, been working on a really complex select component and it works like charm. Very well documented.',
    id: '1317128110509379585'
  },

  {
    author: 'Dale Zak',
    handle: 'dalezak',
    message: 'Ok, I’m really impressed with the @QuasarFramework, great documentation and powerful framework for building #iOS, #Android, #PWA and #SPA apps using #VueJS https://quasar.dev 🤩',
    id: '1258436297087086594'
  },

  {
    author: 'Gregory Luneau',
    handle: 'LuneauGregory',
    message: 'Quasar is the best thing since sliced bread.',
    id: '1398305954882543616'
  },

  {
    author: 'Tony OHagan',
    handle: 'tony_ohagan',
    message: 'Quasar listen .. I\'ve submitted several suggestions which they acted on (😍 QSplitter, line-awesome icons and Icon genie!).  Optimised rock solid components and best docs & examples in the business save me time and money every week. #QuasarLove #quasarframework',
    id: '1484118254193094656'
  },

  {
    author: 'Marco Ruiz',
    handle: 'estados',
    message: 'I love #quasarframework because I can make great web, mobile and desktop applications with a single code base. It\'s organized and clean, has an active community, and is at the forefront of innovation. #QuasarLove  ❤',
    id: '1483899151129751554'
  },

  {
    author: 'Navicstein',
    handle: 'NavicsteinR',
    message: 'Very very ahead, i wish there could be a world blaster to notify all Vue users that a framework like quasar exist!',
    id: '1189641922182307840'
  },

  {
    author: 'programmerq.wallet',
    handle: 'Qoyyuum',
    message: 'I love how #quasarframework is so versatile. Easy copy and paste components and UI elements (especially for a crappy designer like me) and quick x-platform deploy is amazingly easy! #QuasarLove',
    id: '1483738286128758785'
  },

  {
    author: 'Mauricio Etcheverry',
    handle: 'maurietchev',
    message: 'I\'m gonna marry @quasarframework. It was love at first sight ♥️♥️♥️',
    id: '1209117858904629248'
  },

  {
    author: 'radioActive DROID',
    handle: 'gpproton',
    message: 'Quasar really save you from toiling away with third party dependencies #QuasarLove #quasarframework',
    id: '1483772969822343168'
  },

  {
    author: 'Ali Ataf',
    handle: 'AliAttaf1',
    message: 'There is no situation I needed to make an !important override to the Quasar framework. It\'s just there, everything you will face will already be in their consideration. #QuasarLove #quasarframework',
    id: '1484969068218265611'
  },

  {
    author: 'Shawn Makinson',
    handle: 'smakinson',
    message: 'I\'ve used #quasarframework for websites, mobile & interactive touch via electron for museum & welcome center display. It\'s flexible, reliable, powerful and fast. Thank you Razvan & team as well as the community! #QuasarLove',
    id: '1484232499136016392'
  },

  {
    author: 'Simon Swain',
    handle: 'simon_swain',
    message: 'Gotta throw some love out there for @quasarframework -- it really does make things stupidly easy and fast to build.',
    id: '1301043009987866624'
  },

  {
    author: 'hyranity',
    handle: 'hyranity',
    message: 'Code faster and smarter with the best Vue framework. Your brain will thank you. #quasarframework. #QuasarLove',
    id: '1483784231017148420'
  }
].map(entry => ({
  ...entry,
  link: `https://twitter.com/${ entry.handle }/status/${ entry.id }`
}))
</script>

<style lang="sass">
.twitter-cards
  margin-left: -24px
  margin-right: -24px

  &__entry
    border-radius: 14px
    box-shadow: 0 24px 24px 0 rgba(0,179,255,0.24)
    min-width: 300px
    width: 300px
    max-width: 80vw

  &__left-arrow
    background: linear-gradient(to right, $dark-bg 0%, $dark-bg 5%, transparent 100%)

  &__right-arrow
    background: linear-gradient(to left, $dark-bg 0%, $dark-bg 5%, transparent 100%)
</style>
