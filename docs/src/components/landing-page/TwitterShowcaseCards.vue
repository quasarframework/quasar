<template>
  <q-carousel
    v-model="slide"
    transition-prev="scale"
    transition-next="scale"
    swipeable
    animated
    navigation
    padding
    arrows
    height="400px"
    class="bg-transparent rounded-borders"
    keep-alive
    @transition="loadTweets"
  >
    <template v-slot:navigation-icon="{ active, btnProps, onClick }">
      <q-btn
        v-if="active"
        size="xs"
        :icon="btnProps.icon"
        color="lp-primary"
        flat
        round
        dense
        @click="onClick"
      />
      <q-btn
        v-else
        size="xs"
        :icon="btnProps.icon"
        color="grey-8"
        flat
        round
        dense
        @click="onClick"
      />
    </template>
    <q-carousel-slide :name="slideIndex" class="showcase-cards text-size-10" v-for="(tweetGroup, slideIndex) in tweetGroups" :key="`slide-${slideIndex}`">
      <div class="carousel-grid">
        <div v-for="(tweetId, cardIndex) in tweetGroup" :key="`twitter-card-${cardIndex}`" class="tweeter-tweet">
          <div :id="`tweet-container-${tweetId}`"></div>
        </div>
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'

const scriptElement = document.createElement('script')
scriptElement.setAttribute('src', 'https://platform.twitter.com/widgets.js')
scriptElement.setAttribute('charset', 'utf-8')
document.head.appendChild(scriptElement)

const INITIAL_TWEET_GROUP_INDEX = 0

async function getTwitterInstance () {
  return new Promise(resolve => {
    scriptElement.onload = () => {
      resolve(window.twttr)
    }
  })
}

export default defineComponent({
  name: 'TwitterShowcaseCards',
  setup () {
    const slide = ref(INITIAL_TWEET_GROUP_INDEX)
    let twitterInstance = null
    const alreadyDisplayedTweetGroupsIndexes = []

    const tweetGroups = [
      [
        '1453670879825629189',
        '1429853761422364681'
      ],
      [
        '1419939610067623937'
      ]
    ]

    function createTweetCard (twitterInstance, tweetId, tweetContainerId) {
      twitterInstance.widgets.createTweet(
        tweetId,
        document.getElementById(tweetContainerId),
        {
          theme: 'light',
          conversation: 'none',
          cards: 'hidden'
        }
      )
    }

    onMounted(async () => {
      twitterInstance = await getTwitterInstance()
      // display first tweet group
      tweetGroups[ INITIAL_TWEET_GROUP_INDEX ].forEach(tweetId => {
        createTweetCard(twitterInstance, tweetId, `tweet-container-${tweetId}`)
      })
      alreadyDisplayedTweetGroupsIndexes.push(INITIAL_TWEET_GROUP_INDEX)
    })

    function loadTweets () {
      // do not create card if it has already been rendered
      if (!alreadyDisplayedTweetGroupsIndexes.includes(slide.value)) {
        tweetGroups[ slide.value ].forEach(tweetId => {
          createTweetCard(twitterInstance, tweetId, `tweet-container-${tweetId}`)
        })
        alreadyDisplayedTweetGroupsIndexes.push(slide.value)
      }
    }

    return {
      slide,
      tweetGroups,
      loadTweets
    }
  }
})
</script>

<style lang="scss">
.carousel-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 16px;
  align-content: center;
}
.showcase-cards {
  // prevent tweets with content larger than tweet height from overflowing.
  // Necessary for responsiveness
  overflow: hidden;
}
.twitter-tweet {
  box-shadow: 0 8px 12px 0 rgba($lp-primary, 0.4);
  border-radius: 20px;
  overflow: hidden;
  background-color: $white;
  max-width: 100%;
}
</style>
