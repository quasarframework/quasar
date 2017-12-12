<template>
  <div>
    <div class="layout-padding card-examples row items-start">
      <q-card inline class="bigger">
        <q-card-media>
          <img src="~assets/donuts.png">
        </q-card-media>
        <q-card-title class="relative-position">
          <q-btn round color="primary" icon="place" class="absolute" style="top: 0; right: 8px; transform: translateY(-50%);" />

          <div class="ellipsis">Cafe Basilico Cafe Basilico Cafe Basilico Cafe Basilico Cafe Basilico Cafe Basilico Cafe Basilico</div>
          <q-rating slot="subtitle" v-model="stars" :max="5" />
          <div slot="right" class="row items-center">
            <q-icon name="place" /> 250 ft
          </div>
        </q-card-title>
        <q-card-main>
          <p>$・Italian, Cafe</p>
          <p class="text-faded">Small plates, salads & sandwiches in an intimate setting.</p>
        </q-card-main>
        <q-card-separator />
        <q-card-actions>
          <q-btn flat round size="sm" icon="event" />
          <q-btn flat>5:30PM</q-btn>
          <q-btn flat>7:30PM</q-btn>
          <q-btn flat>9:00PM</q-btn>
          <q-btn flat color="primary">Reserve</q-btn>
        </q-card-actions>
      </q-card>

      <q-card inline>
        <q-card-main>
          {{lorem}}
        </q-card-main>
      </q-card>

      <q-card inline>
        <q-card-title>
          Title
          <span slot="subtitle">Subtitle</span>
        </q-card-title>
        <q-card-main>
          {{lorem}}
        </q-card-main>
      </q-card>

      <q-card inline color="secondary">
        <q-card-title>
          Title
          <span slot="subtitle">Subtitle</span>
          <q-icon slot="right" name="alarm" />
        </q-card-title>
        <q-card-main>
          {{lorem}}
        </q-card-main>
        <q-card-separator />
        <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card inline>
        <q-card-title>
          Title
          <span slot="subtitle">Subtitle</span>
          <q-icon slot="right" name="more_vert">
            <q-popover ref="popover">
              <q-list link class="no-border">
                <q-item @click="$refs.popover.hide()">
                  <q-item-main label="Remove Card" />
                </q-item>
                <q-item @click="$refs.popover.hide()">
                  <q-item-main label="Send Feedback" />
                </q-item>
                <q-item @click="$refs.popover.hide()">
                  <q-item-main label="Share" />
                </q-item>
              </q-list>
            </q-popover>
          </q-icon>
        </q-card-title>
        <q-card-main>
          {{lorem}}
        </q-card-main>
        <q-card-separator />
        <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card inline>
        <q-card-title>
          Title
          <span slot="subtitle">Subtitle</span>
        </q-card-title>
        <q-card-separator />
        <q-card-actions vertical>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card inline>
        <q-card-title>
          Title
          <span slot="subtitle">Subtitle</span>
        </q-card-title>
        <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card inline>
        <q-card-media>
          <img src="~assets/mountains.jpg">
        </q-card-media>
        <q-card-title>
          Title
          <span slot="subtitle">Subtitle</span>
        </q-card-title>
        <q-card-main>
          {{lorem}}
        </q-card-main>
      </q-card>

      <q-card inline>
        <q-card-media>
          <img src="~assets/parallax2.jpg">

          <q-card-title slot="overlay">
            Title
          </q-card-title>
        </q-card-media>
      </q-card>

      <q-card inline>
        <q-card-media>
          <img src="~assets/parallax2.jpg">

          <q-card-title slot="overlay">
            Title
            <span slot="subtitle">Subtitle</span>
          </q-card-title>
        </q-card-media>
        <q-card-main>
          {{lorem}}
        </q-card-main>
      </q-card>

      <q-card inline>
        <q-card-media overlay-position="top">
          <img src="~assets/parallax2.jpg">

          <q-card-title slot="overlay">
            Title
            <span slot="subtitle">Subtitle</span>
          </q-card-title>
        </q-card-media>
      </q-card>

      <q-card inline>
        <q-card-media overlay-position="top">
          <img src="~assets/parallax2.jpg">

          <q-card-title slot="overlay">
            <div slot="subtitle" class="text-right">Subtitle</div>
          </q-card-title>
        </q-card-media>
      </q-card>

      <q-card inline>
        <q-card-media overlay-position="full">
          <img src="~assets/parallax2.jpg">

          <q-card-title slot="overlay">
            Title
            <span slot="subtitle">Subtitle</span>
          </q-card-title>
        </q-card-media>
      </q-card>

      <q-card inline>
        <q-card-media>
          <img src="~assets/parallax2.jpg">

          <q-card-title slot="overlay">
            Title
            <span slot="subtitle">Subtitle</span>
          </q-card-title>
        </q-card-media>
        <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card inline>
        <q-card-media>
          <q-parallax :src="'statics/parallax1.jpg'" :height="150">
            <div slot="loading">Loading...</div>
          </q-parallax>
        </q-card-media>
        <q-card-title>
          Parallax
          <span slot="subtitle">Subtitle</span>
        </q-card-title>
        <q-card-separator />
        <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card inline>
        <q-item>
          <q-item-side avatar="/statics/boy-avatar.png" />
          <q-item-main>
            <q-item-tile label>Title</q-item-tile>
            <q-item-tile sublabel>Subhead</q-item-tile>
          </q-item-main>
        </q-item>
        <q-card-media>
          <img src="~assets/parallax2.jpg">
        </q-card-media>
        <q-card-title>
          Title
          <span slot="subtitle">Subtitle</span>
        </q-card-title>
        <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card>

      <q-card inline>
        <q-card-media>
          <img src="~assets/parallax2.jpg">
        </q-card-media>
        <q-list>
          <q-item>
            <q-item-side>
              <q-item-tile color="primary" icon="local bar" />
            </q-item-side>
            <q-item-main>
              <q-item-tile label>Bar XYZ</q-item-tile>
              <q-item-tile sublabel>Have a drink.</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile color="red" icon="local gas station" />
            </q-item-side>
            <q-item-main>
              <q-item-tile label>Gas Station</q-item-tile>
              <q-item-tile sublabel>Fill your gas tank.</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile color="amber" icon="local movies" />
            </q-item-side>
            <q-item-main>
              <q-item-tile label>Cinema XYZ</q-item-tile>
              <q-item-tile sublabel>Watch a movie.</q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
      </q-card>

      <q-card inline>
        <q-card-title>
          Title
        </q-card-title>
        <q-list separator>
          <q-collapsible icon="explore" label="First">
            <div>
              Lorem ipsum dolor sit amet...
            </div>
          </q-collapsible>

          <q-collapsible icon="perm_identity" label="Second">
            <div>
              Lorem ipsum dolor sit amet...
            </div>
          </q-collapsible>

          <q-collapsible icon="shopping_cart" label="Third">
            <div>
              Lorem ipsum dolor sit amet...
            </div>
          </q-collapsible>
        </q-list>
      </q-card>

      <q-card inline>
        <q-card-media>
          <q-video src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0" />
        </q-card-media>
        <q-card-title>
          Title
          <span slot="subtitle">Subtitle</span>
        </q-card-title>
        <q-card-main>
          {{lorem}}
        </q-card-main>
      </q-card>

      <q-card inline>
        <q-card-title>
          Title
        </q-card-title>
        <q-card-main>
          {{lorem}}
        </q-card-main>
        <q-card-separator inset />
        <q-card-main>
          {{lorem}}
        </q-card-main>
      </q-card>

      <q-card inline>
        <q-card-media>
          <img src="~assets/mountains.jpg">
        </q-card-media>
        <q-card-actions align="around">
          <q-btn flat round size="sm" color="red" icon="favorite" />
          <q-btn flat round size="sm" color="faded" icon="bookmark" />
          <q-btn flat round size="sm" color="primary" icon="share" />
        </q-card-actions>
      </q-card>

      <q-card inline>
        <q-card-media>
          <img src="~assets/mountains.jpg">
        </q-card-media>
        <q-card-title>
          Title
          <q-rating slot="subtitle" v-model="stars" :max="5" />
          <span slot="right" class="row items-center">
            <q-icon name="place" /> 20 miles
          </span>
        </q-card-title>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      stars: 3,
      lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  }
}
</script>

<style lang="stylus">
.card-examples
  .q-card
    width 300px
  .bigger
    width 450px
  @media (max-width $breakpoint-xs-max)
    .q-card
      width 100%
</style>
