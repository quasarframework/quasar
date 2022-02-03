<template>
  <q-carousel
    v-model="slide"
    swipeable
    animated
    navigation
    padding
    :arrows="$q.screen.gt.xs"
    :height="$q.screen.gt.xs? '450px' : '410px'"
    class="bg-transparent"
    keep-alive
    @transition="loadTweets"
  >
    <template v-slot:navigation-icon="{ active, btnProps, onClick }">
      <q-btn
        size="xs"
        :icon="btnProps.icon"
        :color="active ? 'lp-primary' : 'grey-8'"
        flat
        round
        dense
        @click="onClick"
      />
    </template>
    <q-carousel-slide :name="slideIndex" class="showcase-cards text-size-10" v-for="(tweetGroup, slideIndex) in tweetGroups" :key="`slide-${slideIndex}`">
      <div class="carousel-grid">
        <div v-for="(tweetId, cardIndex) in tweetGroup" :key="`twitter-card-${cardIndex}`" :id="`tweet-container-${tweetId}`" />
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<script>
import { defineComponent, onMounted, ref, computed } from 'vue'
import { Screen } from 'quasar'

const scriptElement = document.createElement('script')
scriptElement.setAttribute('src', 'https://platform.twitter.com/widgets.js')
scriptElement.setAttribute('charset', 'utf-8')
document.head.appendChild(scriptElement)

const INITIAL_TWEET_GROUP_INDEX = 0

const NUMBER_OF_TWEETS_PER_CAROUSEL = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 3,
  xl: 3
}

const SHOW_CASE_TWEETS = [
  '1162928248600387585',
  '1189641922182307840',
  '1398305954882543616',
  '1317128110509379585',
  '1209117858904629248',
  '1301043009987866624',
  '1185955239343476737',
  '1138034912232185856',
  '1189462396659752960'
]

function splitArrayIntoChunks (arrayToChunk, chunkLength) {
  const chunkedArray = []
  let indexOfArray = 0

  while (indexOfArray < arrayToChunk.length) {
    chunkedArray.push(arrayToChunk.slice(indexOfArray, indexOfArray += chunkLength))
  }
  return chunkedArray
}

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
    const tweetGroups = computed(() => {
      // create tweet groups depending on the size of the screen
      if (Screen.xs) {
        return splitArrayIntoChunks(SHOW_CASE_TWEETS, NUMBER_OF_TWEETS_PER_CAROUSEL.xs)
      }
      if (Screen.sm) {
        return splitArrayIntoChunks(SHOW_CASE_TWEETS, NUMBER_OF_TWEETS_PER_CAROUSEL.sm)
      }

      return splitArrayIntoChunks(SHOW_CASE_TWEETS, NUMBER_OF_TWEETS_PER_CAROUSEL.md)
    })

    const slide = ref(INITIAL_TWEET_GROUP_INDEX)
    let twitterInstance = null
    const alreadyDisplayedTweetGroupsIndexes = []

    function createTweetCard (twitterInstance, tweetId, tweetContainerId) {
      twitterInstance.widgets.createTweet(
        tweetId,
        document.getElementById(tweetContainerId),
        {
          conversation: 'none',
          cards: 'hidden',
          dnt: true
        }
      )
    }

    onMounted(async () => {
      twitterInstance = await getTwitterInstance()

      // display first tweet group
      tweetGroups.value[ INITIAL_TWEET_GROUP_INDEX ].forEach(tweetId => {
        createTweetCard(twitterInstance, tweetId, `tweet-container-${tweetId}`)
      })
      alreadyDisplayedTweetGroupsIndexes.push(INITIAL_TWEET_GROUP_INDEX)
    })

    async function loadTweets () {
      if (!twitterInstance) {
        twitterInstance = await getTwitterInstance()
      }
      // do not create card if it has already been rendered
      if (!alreadyDisplayedTweetGroupsIndexes.includes(slide.value)) {
        tweetGroups.value[ slide.value ].forEach(tweetId => {
          createTweetCard(twitterInstance, tweetId, `tweet-container-${tweetId}`)
        })
        alreadyDisplayedTweetGroupsIndexes.push(slide.value)
      }
    }

    // calculate how many tweets to show per carousel depending on the screen size
    const tweetsPerPage = computed(() => NUMBER_OF_TWEETS_PER_CAROUSEL[ Screen.name ])

    return {
      slide,
      tweetGroups,
      loadTweets,
      tweetsPerPage
    }
  }
})
</script>

<style lang="scss" scoped>
/*
 [1]: needed to create a white card behind the twitter card, this card gets shown when moving to a previous carousel
 (carouse that had already being displayed) Necessary since the tweet content takes a few seconds to load
 */

.carousel-grid {
  display: grid;
  grid-column-gap: 16px;
  align-content: center;
  flex: 1;
  grid-template-columns: repeat(v-bind(tweetsPerPage), 1fr)
}
.showcase-cards {
  // prevent tweets with content larger than tweet height from overflowing.
  // Necessary for responsiveness
  overflow: hidden;
  display: flex;
  justify-content: center
}
:deep(.twitter-tweet) {
  background-color: $white; // [1]
  border-radius: 20px; // [1]
  box-shadow: $lp-box-shadow--large;
}
</style>
