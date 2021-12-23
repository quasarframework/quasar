<template>
  <q-carousel
    v-model="slide"
    transition-prev="scale"
    transition-next="scale"
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
      <div class="carousel-grid" :style="carouselGridTemplateColumns">
        <div v-for="(tweetId, cardIndex) in tweetGroup" :key="`twitter-card-${cardIndex}`" class="tweeter-tweet">
          <div :id="`tweet-container-${tweetId}`"></div>
        </div>
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
  '1138034912232185856',
  '1260959783496101894',
  '1317128110509379585',
  '1258436297087086594',
  '1453670879825629189',
  '1044280073690517504',
  '1217321922402250752',
  '971542817834074113',
  '1209117858904629248',
  '1185955239343476737',
  '1315274816354750465',
  '1377514650212970497',
  '1398305954882543616',
  '1301171191269462017',
  '1301043009987866624',
  '1250060119402065923',
  '1162928248600387585',
  '1258436297087086594',
  '1221914932402442240',
  '1185955239343476737',
  '1189462396659752960',
  '1189641922182307840',
  '1190864547734794241',
  '1190967242202271744',
  '1191008308209094660',
  '1191369727253176320',
  '1215238079868538880'
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
          theme: 'light',
          conversation: 'none',
          cards: 'hidden',
          hide_thread: true,
          align: 'center'
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

    function loadTweets () {
      // do not create card if it has already been rendered
      if (!alreadyDisplayedTweetGroupsIndexes.includes(slide.value)) {
        tweetGroups.value[ slide.value ].forEach(tweetId => {
          createTweetCard(twitterInstance, tweetId, `tweet-container-${tweetId}`)
        })
        alreadyDisplayedTweetGroupsIndexes.push(slide.value)
      }
    }

    // calculate how many tweets to show per carousel depending on the screen size
    // e.g. if screen size is sm, show 2 tweets per carousel. Hence, grid template-columns: repeat(2, 1fr);
    const carouselGridTemplateColumns = computed(() => ({ gridTemplateColumns: `repeat(${NUMBER_OF_TWEETS_PER_CAROUSEL[ Screen.name ]}, 1fr)` }))

    return {
      slide,
      tweetGroups,
      loadTweets,
      carouselGridTemplateColumns
    }
  }
})
</script>

<style lang="scss">
.carousel-grid {
  display: grid;
  grid-column-gap: 16px;
  align-content: center;
  flex: 1;
}
.showcase-cards {
  // prevent tweets with content larger than tweet height from overflowing.
  // Necessary for responsiveness
  overflow: hidden;
  display: flex;
  justify-content: center
}
.twitter-tweet {
  box-shadow: $lp-box-shadow--large;
  border-radius: 20px;
  overflow: hidden;
  background-color: $white;
  max-width: 100%;
}
</style>
